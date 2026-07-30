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