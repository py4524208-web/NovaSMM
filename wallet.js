import { db } from "./firebase.js";

import {
  ref,
  push,
  set,
  onValue,
  remove,
  update
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

let wallets = [];
let users = [];

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

});

// Update Wallet
window.updateWallet = function () {

  const user = document.getElementById("walletUser").value.trim();
  const amount = Number(document.getElementById("walletAmount").value);
  const type = document.getElementById("walletType").value;

  if (!user || !amount) {
    alert("Please fill all fields");
    return;
  }

  const foundUser = users.find(
    x => x.name.toLowerCase() === user.toLowerCase()
  );

  if (!foundUser) {
    alert("User not found");
    return;
  }

  let currentBalance = Number(foundUser.balance || 0);

  if (type === "Add") {
    currentBalance += amount;
  } else {
    currentBalance -= amount;
  }

  update(ref(db, "users/" + foundUser.id), {
    balance: currentBalance
  });

  const newRef = push(ref(db, "wallet"));

  set(newRef, {
    user,
    amount,
    type,
    date: new Date().toLocaleString()
  });

  document.getElementById("walletUser").value = "";
  document.getElementById("walletAmount").value = "";

  alert("Wallet Updated");

};

// Render Wallet
function renderWallet() {

  const table = document.getElementById("walletTable");

  table.innerHTML = `
<tr>
<th>User</th>
<th>Amount</th>
<th>Type</th>
<th>Date</th>
<th>Action</th>
</tr>
`;

  wallets.forEach((item) => {

    table.innerHTML += `
<tr>

<td>${item.user}</td>

<td>₹${item.amount}</td>

<td>${item.type}</td>

<td>${item.date || "-"}</td>

<td>
<button onclick="deleteWallet('${item.id}')">
🗑 Delete
</button>
</td>

</tr>
`;

  });

}

// Load Wallet
onValue(ref(db, "wallet"), (snapshot) => {

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

// Delete Wallet Record
window.deleteWallet = function (id) {

  if (confirm("Delete Record?")) {

    remove(ref(db, "wallet/" + id));

  }

};