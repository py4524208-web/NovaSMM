import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  ref,
  get,
  onValue
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

// =======================
// AUTH CHECK
// =======================

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.replace("customer-login.html");
    return;
  }

  loadCustomer(user.uid);
  loadOrders(user.uid);
  loadProfile(user.uid);
  liveWallet(user.uid);

});

// =======================
// LOAD CUSTOMER
// =======================

async function loadCustomer(uid) {

  const snap = await get(ref(db, "customers/" + uid));

  if (!snap.exists()) return;

  const data = snap.val();

  const wallet = document.getElementById("walletBalance");

  if (wallet) {
    wallet.innerHTML = "₹" + (data.wallet || 0);
  }

}

// =======================
// LOAD ORDERS
// =======================

function loadOrders(uid) {

  const ordersRef = ref(db, "customer_orders/" + uid);

  onValue(ordersRef, (snapshot) => {

    const table = document.getElementById("recentOrders");

    if (!table) return;

    table.innerHTML = `
<tr>
<th>Service</th>
<th>Link</th>
<th>Status</th>
<th>Quantity</th>
</tr>
`;

    let total = 0;
    let pending = 0;
    let completed = 0;

    if (snapshot.exists()) {

      snapshot.forEach((child) => {

        const order = child.val();

        total++;

        if (order.status === "Pending") pending++;
        if (order.status === "Completed") completed++;

        table.innerHTML += `
<tr>
<td>${order.service}</td>
<td>${order.link}</td>
<td>${order.status}</td>
<td>${order.quantity}</td>
</tr>
`;

      });

    }

    document.getElementById("totalOrders").innerHTML = total;
    document.getElementById("pendingOrders").innerHTML = pending;
    document.getElementById("completedOrders").innerHTML = completed;

  });

}
// =======================
// LOAD PROFILE
// =======================

async function loadProfile(uid) {

  const snap = await get(ref(db, "customers/" + uid));

  if (!snap.exists()) return;

  const data = snap.val();

  document.title = "NovaSMM - " + (data.name || "Customer");

}

// =======================
// LIVE WALLET
// =======================

function liveWallet(uid) {

  onValue(ref(db, "customers/" + uid + "/wallet"), (snap) => {

    const wallet = document.getElementById("walletBalance");

    if (wallet) {

      wallet.innerHTML = "₹" + (snap.val() || 0);

    }

  });

}

// =======================
// NOTIFICATION
// =======================

window.showNotification = function (message) {

  alert(message);

};

// =======================
// LOGOUT
// =======================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

  logoutBtn.addEventListener("click", async () => {

    try {

      await signOut(auth);

      localStorage.removeItem("selectedService");
      sessionStorage.clear();

      window.location.replace("customer-login.html");

    } catch (e) {

      console.error(e);
      alert("Logout Failed : " + e.message);

    }

  });

}

console.log("Customer Dashboard Loaded");