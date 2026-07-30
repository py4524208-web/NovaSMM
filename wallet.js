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
const walletRef = ref(db, "wallet");

let users = [];
let wallets = [];
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

loadUsers();

});

// =======================
// LOAD WALLET
// =======================

onValue(walletRef, (snapshot) => {

wallets = [];

if (snapshot.exists()) {

snapshot.forEach((child) => {

wallets.push({
id: child.key,
...child.val()
});

});

}

renderWallet();

});

// =======================
// LOAD USER DROPDOWN
// =======================

function loadUsers() {

const select = document.getElementById("walletUser");

select.innerHTML = `
<option value="">Select User</option>
`;

users.forEach(user => {

select.innerHTML += `
<option value="${user.id}">
${user.name}
</option>
`;

});

}

// =======================
// RENDER WALLET
// =======================

function renderWallet() {

const table = document.getElementById("walletTable");

table.innerHTML = `

<tr>

<th>User</th>

<th>Balance</th>

<th>Last Transaction</th>

<th>Remark</th>

<th>Action</th>

</tr>

`;

wallets.forEach(item => {

table.innerHTML += `

<tr>

<td>${item.userName}</td>

<td>₹${item.balance}</td>

<td>${item.type}</td>

<td>${item.remark}</td>

<td>

<button onclick="editWallet('${item.id}')">

Edit

</button>

<button onclick="deleteWallet('${item.id}')">

Delete

</button>

</td>

</tr>

`;

});

}
// =======================
// SAVE WALLET
// =======================

window.saveWallet = function () {

const userId = document.getElementById("walletUser").value;
const amount = Number(document.getElementById("walletAmount").value);
const type = document.getElementById("walletType").value;
const remark = document.getElementById("walletRemark").value.trim();

if (!userId || amount <= 0) {
alert("Please fill all fields");
return;
}

const user = users.find(u => u.id === userId);

if (!user) {
alert("User not found");
return;
}

let newBalance = Number(user.balance || 0);

if (type === "Add") {
newBalance += amount;
} else {
if (newBalance < amount) {
alert("Insufficient Balance");
return;
}
newBalance -= amount;
}

// Update User Balance
update(ref(db, "users/" + userId), {
balance: newBalance
});

// Update Wallet
if (editId) {

update(ref(db, "wallet/" + editId), {
userId,
userName: user.name,
balance: newBalance,
amount,
type,
remark,
updatedAt: new Date().toLocaleString()
});

editId = null;

document.querySelector("button[onclick='saveWallet()']").innerText =
"💾 Save";

} else {

const newRef = push(walletRef);

set(newRef, {
userId,
userName: user.name,
balance: newBalance,
amount,
type,
remark,
createdAt: new Date().toLocaleString()
});

}

clearWalletForm();

};

// =======================
// CLEAR FORM
// =======================

function clearWalletForm() {

document.getElementById("walletUser").value = "";
document.getElementById("walletAmount").value = "";
document.getElementById("walletType").value = "Add";
document.getElementById("walletRemark").value = "";

}

// =======================
// EDIT WALLET
// =======================

window.editWallet = function(id){

const item = wallets.find(x => x.id === id);

if(!item) return;

editId = id;

document.getElementById("walletUser").value = item.userId;
document.getElementById("walletAmount").value = item.amount;
document.getElementById("walletType").value = item.type;
document.getElementById("walletRemark").value = item.remark;

document.querySelector("button[onclick='saveWallet()']").innerText =
"💾 Update";

};

// =======================
// DELETE WALLET
// =======================

window.deleteWallet = function(id){

if(confirm("Delete this transaction?")){

remove(ref(db,"wallet/"+id));

}

};
// =======================
// SEARCH WALLET
// =======================

window.searchWallet = function () {

const key = document
.getElementById("searchWallet")
.value
.toLowerCase();

document.querySelectorAll("#walletTable tr").forEach((row, index) => {

if (index === 0) return;

row.style.display = row.innerText.toLowerCase().includes(key)
? ""
: "none";

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

clearWalletForm();

const btn = document.querySelector("button[onclick='saveWallet()']");

if (btn) {

btn.innerText = "💾 Save";

}

};

// =======================
// VALIDATION
// =======================

document.addEventListener("DOMContentLoaded", () => {

const amount = document.getElementById("walletAmount");

if (amount) {

amount.addEventListener("input", () => {

if (Number(amount.value) < 0) {

amount.value = 0;

}

});

}

});

// =======================
// CONSOLE
// =======================

console.log("✅ NovaSMM Wallet Module Loaded");