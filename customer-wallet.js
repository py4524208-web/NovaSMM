import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  ref,
  onValue
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

// =======================
// LOGIN CHECK
// =======================

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.replace("customer-login.html");
    return;
  }

  loadWallet(user.uid);
  loadTransactions(user.uid);

});

// =======================
// LOAD WALLET
// =======================

function loadWallet(uid) {

  onValue(ref(db, "customers/" + uid + "/wallet"), (snap) => {

    document.getElementById("walletBalance").innerHTML =
      "₹" + (snap.val() || 0);

  });

}

// =======================
// LOAD TRANSACTIONS
// =======================

function loadTransactions(uid) {

  const table = document.getElementById("walletTable");

  onValue(ref(db, "wallet_transactions/" + uid), (snapshot) => {

    table.innerHTML = `
<tr>
<th>Type</th>
<th>Amount</th>
<th>Reason</th>
<th>Status</th>
<th>Date</th>
</tr>
`;

    if (snapshot.exists()) {

      snapshot.forEach((child) => {

        const t = child.val();

        table.innerHTML += `
<tr>
<td>${t.type}</td>
<td>₹${t.amount}</td>
<td>${t.reason}</td>
<td>${t.status}</td>
<td>${t.createdAt}</td>
</tr>
`;

      });

    }

  });

}

// =======================
// LOGOUT
// =======================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

  logoutBtn.onclick = async () => {

    await signOut(auth);

    window.location.replace("customer-login.html");

  };

}

console.log("Customer Wallet Ready");