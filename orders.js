import { db } from "./firebase.js";

import {
  ref,
  push,
  set,
  onValue,
  remove,
  update
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const ordersRef = ref(db, "orders");
let orders = [];

// =======================
// Load Orders
// =======================

onValue(ordersRef, (snapshot) => {

  orders = [];

  if (snapshot.exists()) {

    snapshot.forEach((item) => {

      orders.push({
        id: item.key,
        ...item.val()
      });

    });

  }

  renderOrders();

});

// =======================
// Render Orders
// =======================

function renderOrders() {

  const tbody = document.querySelector("#ordersTable tbody");

  tbody.innerHTML = "";

  orders.forEach((order) => {

    tbody.innerHTML += `
    <tr>

      <td>${order.orderId || order.id}</td>

      <td>${order.user}</td>

      <td>${order.service}</td>

      <td>${order.quantity}</td>

      <td>₹${order.price}</td>

      <td>

      <select onchange="changeStatus('${order.id}',this.value)">

      <option value="Pending" ${order.status=="Pending"?"selected":""}>Pending</option>

      <option value="Processing" ${order.status=="Processing"?"selected":""}>Processing</option>

      <option value="Completed" ${order.status=="Completed"?"selected":""}>Completed</option>

      <option value="Cancelled" ${order.status=="Cancelled"?"selected":""}>Cancelled</option>

      </select>

      </td>

      <td>

      <button onclick="editOrder('${order.id}')">✏️</button>

      <button onclick="deleteOrder('${order.id}')">🗑</button>

      </td>

    </tr>
    `;

  });

}

// =======================
// Search
// =======================

window.searchOrder = function () {

  const key = document
    .getElementById("searchOrder")
    .value
    .toLowerCase();

  document.querySelectorAll("#ordersTable tbody tr").forEach(row => {

    row.style.display =
      row.innerText.toLowerCase().includes(key)
        ? ""
        : "none";

  });

};