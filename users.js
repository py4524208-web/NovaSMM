import { db } from "./firebase.js";

import {
ref,
push,
set,
onValue,
remove,
update
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const usersRef = ref(db, "users");

let users = [];
let editId = null;

// =======================
// LOAD USERS
// =======================

onValue(usersRef, (snapshot) => {

users = [];

if (snapshot.exists()) {

snapshot.forEach((child) => {

users.push({
id: child.key,
...child.val()
});

});

}

renderUsers();

});

// =======================
// RENDER USERS
// =======================

function renderUsers() {

const table = document.getElementById("usersTable");

table.innerHTML = `

<tr>

<th>User ID</th>

<th>Name</th>

<th>Email</th>

<th>Phone</th>

<th>Balance</th>

<th>Status</th>

<th>Action</th>

</tr>

`;

users.forEach(item => {

table.innerHTML += `

<tr>

<td>${item.id}</td>

<td>${item.name}</td>

<td>${item.email}</td>

<td>${item.phone}</td>

<td>₹${item.balance}</td>

<td>

<select onchange="changeStatus('${item.id}',this.value)">

<option value="Active"
${item.status=="Active"?"selected":""}>
Active
</option>

<option value="Banned"
${item.status=="Banned"?"selected":""}>
Banned
</option>

</select>

</td>

<td>

<button onclick="copyUserId('${item.id}')">

Copy ID

</button>

<button onclick="editUser('${item.id}')">

Edit

</button>

<button onclick="deleteUser('${item.id}')">

Delete

</button>

</td>

</tr>

`;

});

}
// =======================
// SAVE USER
// =======================

window.saveUser = function () {

const name = document.getElementById("userName").value.trim();
const email = document.getElementById("userEmail").value.trim();
const phone = document.getElementById("userPhone").value.trim();
const balance = document.getElementById("userBalance").value.trim();
const status = document.getElementById("userStatus").value;

if (!name || !email || !phone || balance === "") {

alert("Please fill all fields");

return;

}

// =======================
// UPDATE USER
// =======================

if (editId) {

update(ref(db, "users/" + editId), {

name,
email,
phone,
balance: Number(balance),
status

});

editId = null;

document.querySelector("button[onclick='saveUser()']").innerText =
"➕ Save User";

}

// =======================
// ADD USER
// =======================

else {

const newRef = push(usersRef);

set(newRef, {

name,
email,
phone,
balance: Number(balance),
status,
createdAt: new Date().toLocaleString()

});

}

clearForm();

};

// =======================
// CLEAR FORM
// =======================

function clearForm() {

document.getElementById("userName").value = "";
document.getElementById("userEmail").value = "";
document.getElementById("userPhone").value = "";
document.getElementById("userBalance").value = "";
document.getElementById("userStatus").value = "Active";

}

// =======================
// EDIT USER
// =======================

window.editUser = function (id) {

const item = users.find(x => x.id === id);

if (!item) return;

editId = id;

document.getElementById("userName").value = item.name;
document.getElementById("userEmail").value = item.email;
document.getElementById("userPhone").value = item.phone;
document.getElementById("userBalance").value = item.balance;
document.getElementById("userStatus").value = item.status;

document.querySelector("button[onclick='saveUser()']").innerText =
"💾 Update User";

};

// =======================
// DELETE USER
// =======================

window.deleteUser = function (id) {

if (confirm("Delete this user?")) {

remove(ref(db, "users/" + id));

}

};
// =======================
// SEARCH USER
// =======================

window.searchUser = function () {

const key = document
.getElementById("searchUser")
.value
.toLowerCase();

document.querySelectorAll("#usersTable tr").forEach((row, index) => {

if (index === 0) return;

row.style.display = row.innerText.toLowerCase().includes(key)
? ""
: "none";

});

};

// =======================
// CHANGE STATUS
// =======================

window.changeStatus = function (id, status) {

update(ref(db, "users/" + id), {
status
});

};

// =======================
// COPY USER ID
// =======================

window.copyUserId = function (id) {

navigator.clipboard.writeText(id);

alert("User ID Copied Successfully");

};

// =======================
// CANCEL EDIT
// =======================

window.cancelEdit = function () {

editId = null;

clearForm();

const btn = document.querySelector("button[onclick='saveUser()']");

if (btn) {

btn.innerText = "➕ Save User";

}

};

// =======================
// VALIDATION
// =======================

document.addEventListener("DOMContentLoaded", () => {

const balance = document.getElementById("userBalance");

if (balance) {

balance.addEventListener("input", () => {

if (Number(balance.value) < 0) {

balance.value = 0;

}

});

}

});

// =======================
// CONSOLE
// =======================

console.log("✅ NovaSMM Users Module Loaded");