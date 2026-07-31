import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  ref,
  onValue
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

let allOrders = [];

// Login Check
onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.replace("customer-login.html");
    return;
  }

  loadOrders(user.uid);

});

// Load Orders
function loadOrders(uid) {

  const ordersRef = ref(db, "customer_orders/" + uid);

  onValue(ordersRef, (snapshot) => {

    allOrders = [];

    if (snapshot.exists()) {

      snapshot.forEach((child) => {

        allOrders.push(child.val());

      });

    }

    renderOrders(allOrders);

  });

}

// Render Orders
function renderOrders(list) {

  const table = document.getElementById("ordersTable");

  table.innerHTML = `
<tr>
<th>Service</th>
<th>Link</th>
<th>Quantity</th>
<th>Price</th>
<th>Status</th>
<th>Date</th>
</tr>`;

  list.forEach(order => {

    table.innerHTML += `
<tr>
<td>${order.service}</td>
<td>${order.link}</td>
<td>${order.quantity}</td>
<td>₹${order.price}</td>
<td>${order.status}</td>
<td>${order.createdAt}</td>
</tr>`;

  });

}

// Search
const search = document.getElementById("searchOrder");

if (search) {

  search.addEventListener("keyup", () => {

    const key = search.value.toLowerCase();

    const filtered = allOrders.filter(o =>
      (o.service || "").toLowerCase().includes(key)
    );

    renderOrders(filtered);

  });

}

// Logout
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

  logoutBtn.onclick = async () => {

    await signOut(auth);

    window.location.replace("customer-login.html");

  };

}

console.log("Customer Orders Ready");