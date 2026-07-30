import { db } from "./firebase.js";

import {
  ref,
  push,
  set,
  onValue,
  remove,
  update
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

let users = [];

// Add User
window.addUser = function () {

  const name = prompt("User Name");
  if (!name) return;

  const email = prompt("Email");
  if (!email) return;

  const balance = prompt("Balance");
  if (!balance) return;

  const newRef = push(ref(db, "users"));

  set(newRef, {
    name,
    email,
    balance,
    status: "Active"
  });

};

// Load Users
onValue(ref(db, "users"), (snapshot) => {

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

// Render Users
function renderUsers() {

  const tbody = document.querySelector("#usersTable tbody");

  tbody.innerHTML = "";

  users.forEach((user) => {

    tbody.innerHTML += `

<tr>

<td>${user.id}</td>

<td>${user.name}</td>

<td>${user.email}</td>

<td>₹${user.balance}</td>

<td>

<select onchange="changeStatus('${user.id}',this.value)">

<option value="Active"
${user.status=="Active"?"selected":""}>
Active
</option>

<option value="Banned"
${user.status=="Banned"?"selected":""}>
Banned
</option>

</select>

</td>

<td>

<button onclick="editUser('${user.id}')">
✏️
</button>

<button onclick="deleteUser('${user.id}')">
🗑️
</button>

</td>

</tr>

`;

  });

}
// Edit User
window.editUser = function(id){

    const user = users.find(x => x.id === id);

    const name = prompt("User Name", user.name);
    if(name === null) return;

    const email = prompt("Email", user.email);
    if(email === null) return;

    const balance = prompt("Balance", user.balance);
    if(balance === null) return;

    update(ref(db,"users/"+id),{
        name,
        email,
        balance
    });

};

// Delete User
window.deleteUser = function(id){

    if(confirm("Delete this user?")){
        remove(ref(db,"users/"+id));
    }

};

// Change Status
window.changeStatus = function(id,status){

    update(ref(db,"users/"+id),{
        status
    });

};

// Search User
window.searchUser = function(){

    const key = document
        .getElementById("searchUser")
        .value
        .toLowerCase();

    document.querySelectorAll("#usersTable tbody tr").forEach(row=>{

        row.style.display =
            row.innerText.toLowerCase().includes(key)
            ? ""
            : "none";

    });

};