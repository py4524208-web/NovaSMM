
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

// =======================
// Order Form
// =======================

window.openOrderForm = function () {

loadOrderForm();

document.getElementById("orderForm").style.display = "block";

};

window.closeOrderForm = function () {

document.getElementById("orderForm").style.display = "none";

};

// =======================
// Load Form Data
// =======================

function loadOrderForm() {

  const userSelect = document.getElementById("orderUser");
  const serviceSelect = document.getElementById("orderService");

  if (!userSelect || !serviceSelect) return;

  userSelect.innerHTML = '<option value="">Select User</option>';

  users.forEach(user => {
    userSelect.innerHTML += `
      <option value="${user.name}">${user.name}</option>
    `;
  });

  serviceSelect.innerHTML = '<option value="">Select Service</option>';

  services.forEach(service => {
    serviceSelect.innerHTML += `
      <option value="${service.id}">${service.name}</option>
    `;
  });

  serviceSelect.onchange = function () {
    const service = services.find(s => s.id === this.value);

    document.getElementById("orderPrice").value =
      service ? service.price : "";
  };

}



window.saveOrder = function () {

  const user = document.getElementById("orderUser").value;
  const serviceId = document.getElementById("orderService").value;
  const quantity = document.getElementById("orderQuantity").value;

  if (!user || !serviceId || !quantity) {
    alert("Please fill all fields");
    return;
  }

  const service = services.find(s => s.id === serviceId);

  const newRef = push(ordersRef);

  set(newRef, {
    orderId: "ORD" + Date.now(),
    user: user,
    service: service.name,
    quantity: Number(quantity),
    price: Number(service.price),
    status: "Pending",
    createdAt: new Date().toLocaleString()
  });

  closeOrderForm();

  document.getElementById("orderQuantity").value = "";
  document.getElementById("orderPrice").value = "";

};