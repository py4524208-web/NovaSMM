import { db } from "./firebase.js";

import {
  ref,
  push,
  set,
  onValue,
  remove,
  update
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";
// =======================
// Firebase References
// =======================

const usersRef = ref(db, "users");
const servicesRef = ref(db, "services");
const ordersRef = ref(db, "orders");

let users = [];
let services = [];
let orders = [];
// Load Users
onValue(usersRef, (snapshot) => {

  users = [];

  if (snapshot.exists()) {
    snapshot.forEach((item) => {
      users.push({
        id: item.key,
        ...item.val()
      });
    });
  }

});

// Load Services
onValue(servicesRef, (snapshot) => {

  services = [];

  if (snapshot.exists()) {
    snapshot.forEach((item) => {
      services.push({
        id: item.key,
        ...item.val()
      });
    });
  }

});
window.addOrder = function () {

  const user = prompt("Customer Name");
  if (!user) return;

  const service = prompt("Service Name");
  if (!service) return;

  const quantity = prompt("Quantity");
  if (!quantity) return;

  const price = prompt("Price");
  if (!price) return;

  const newRef = push(ordersRef);

  set(newRef, {
    orderId: "ORD" + Date.now(),
    user: user,
    service: service,
    quantity: Number(quantity),
    price: Number(price),
    status: "Pending",
    createdAt: new Date().toLocaleString()
  });

};
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
window.editOrder = function(id){

    const order = orders.find(x => x.id === id);

    const user = prompt("User", order.user);
    if(user === null) return;

    const service = prompt("Service", order.service);
    if(service === null) return;

    const quantity = prompt("Quantity", order.quantity);
    if(quantity === null) return;

    const price = prompt("Price", order.price);
    if(price === null) return;

    update(ref(db,"orders/"+id),{
        user,
        service,
        quantity,
        price
    });

};

window.deleteOrder = function(id){

    if(confirm("Delete this order?")){
        remove(ref(db,"orders/"+id));
    }

};

window.changeStatus = function(id,status){

    update(ref(db,"orders/"+id),{
        status
    });

};