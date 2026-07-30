import { db } from "./firebase.js";

import {
  ref,
  push,
  set,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

let users = [];

window.addUser = function () {

  const name = document.getElementById("userName").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const balance = document.getElementById("userBalance").value.trim();

  if (!name || !email || !balance) {
    alert("Please fill all fields");
    return;
  }

  const newRef = push(ref(db, "users"));

  set(newRef, {
    name: name,
    email: email,
    balance: balance,
    status: "Active"
  });

  document.getElementById("userName").value = "";
  document.getElementById("userEmail").value = "";
  document.getElementById("userBalance").value = "";
};

function renderUsers() {

  const table = document.getElementById("usersTable");

  table.innerHTML = `
  <tr>
    <th>Name</th>
    <th>Email</th>
    <th>Balance</th>
    <th>Status</th>
    <th>Action</th>
  </tr>
  `;

  users.forEach((user) => {

    table.innerHTML += `
    <tr>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>₹${user.balance}</td>
      <td>${user.status}</td>
      <td>
        <button onclick="deleteUser('${user.id}')">
        🗑 Delete
        </button>
      </td>
    </tr>
    `;

  });

}

onValue(ref(db, "users"), (snapshot) => {

  users = [];

  snapshot.forEach((child) => {

    users.push({
      id: child.key,
      ...child.val()
    });

  });

  renderUsers();

});

window.deleteUser = function (id) {

  if (confirm("Delete User?")) {

    remove(ref(db, "users/" + id));

  }

};

window.searchUser = function () {

  const keyword = document
    .getElementById("searchUser")
    .value
    .toLowerCase();

  const rows = document.querySelectorAll("#usersTable tr");

  rows.forEach((row, index) => {

    if (index === 0) return;

    row.style.display = row.innerText.toLowerCase().includes(keyword)
      ? ""
      : "none";

  });

};