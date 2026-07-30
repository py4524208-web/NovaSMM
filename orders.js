import { db } from "./firebase.js";

import {
ref,
push,
set,
onValue,
remove,
update
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const usersRef = ref(db, "users");
const servicesRef = ref(db, "services");
const ordersRef = ref(db, "orders");

let users = [];
let services = [];
let orders = [];
let editId = null;

// =======================
// LOAD USERS
// =======================

onValue(usersRef, (snapshot) => {

users = [];

if (snapshot.exists()) {

snapshot.forEach((child) => {

users.push({
id: child.key,
...child.val()
});

});

}

loadUsers();

});

// =======================
// LOAD SERVICES
// =======================

onValue(servicesRef, (snapshot) => {

services = [];

if (snapshot.exists()) {

snapshot.forEach((child) => {

services.push({
id: child.key,
...child.val()
});

});

}

loadServices();

});

// =======================
// LOAD ORDERS
// =======================

onValue(ordersRef, (snapshot) => {

orders = [];

if (snapshot.exists()) {

snapshot.forEach((child) => {

orders.push({
id: child.key,
...child.val()
});

});

}

renderOrders();

});

// =======================
// LOAD USER DROPDOWN
// =======================

function loadUsers() {

const select = document.getElementById("orderUser");

select.innerHTML = `
<option value="">Select User</option>
`;

users.forEach(user => {

select.innerHTML += `
<option value="${user.name}">
${user.name}
</option>
`;

});

}

// =======================
// LOAD SERVICE DROPDOWN
// =======================

function loadServices() {

const select = document.getElementById("orderService");

select.innerHTML = `
<option value="">Select Service</option>
`;

services.forEach(service => {

select.innerHTML += `
<option value="${service.id}">
${service.name}
</option>
`;

});

select.onchange = function () {

const item = services.find(x => x.id == this.value);

document.getElementById("orderPrice").value =
item ? item.price : "";

};

}

// =======================
// RENDER ORDERS
// =======================

function renderOrders() {

const table = document.getElementById("ordersTable");

table.innerHTML = `

<tr>

<th>Order ID</th>

<th>User</th>

<th>Service</th>

<th>Qty</th>

<th>Price</th>

<th>Status</th>

<th>Action</th>

</tr>

`;

orders.forEach(item => {

table.innerHTML += `

<tr>

<td>${item.orderId}</td>

<td>${item.user}</td>

<td>${item.service}</td>

<td>${item.quantity}</td>

<td>₹${item.price}</td>

<td>${item.status}</td>

<td>

<button onclick="editOrder('${item.id}')">

Edit

</button>

<button onclick="deleteOrder('${item.id}')">

Delete

</button>

</td>

</tr>

`;

});

}
// =======================
// SAVE ORDER
// =======================

window.saveOrder = function () {

const user = document.getElementById("orderUser").value;
const serviceId = document.getElementById("orderService").value;
const quantity = document.getElementById("orderQuantity").value;
const status = document.getElementById("orderStatus").value;

if (!user || !serviceId || !quantity) {

alert("Please fill all fields");

return;

}

const service = services.find(x => x.id === serviceId);

if (!service) {

alert("Service not found");

return;

}

// =======================
// UPDATE
// =======================

if (editId) {

update(ref(db, "orders/" + editId), {

user,
service: service.name,
quantity: Number(quantity),
price: Number(service.price),
status

});

editId = null;

document.querySelector("button[onclick='saveOrder()']").innerText =
"➕ Save Order";

}

// =======================
// ADD
// =======================

else {

const newRef = push(ordersRef);

set(newRef, {

orderId: "ORD" + Date.now(),

user,

service: service.name,

quantity: Number(quantity),

price: Number(service.price),

status,

createdAt: new Date().toLocaleString()

});

}

clearForm();

};

// =======================
// CLEAR FORM
// =======================

function clearForm() {

document.getElementById("orderUser").value = "";

document.getElementById("orderService").value = "";

document.getElementById("orderQuantity").value = "";

document.getElementById("orderPrice").value = "";

document.getElementById("orderStatus").value = "Pending";

}

// =======================
// EDIT ORDER
// =======================

window.editOrder = function (id) {

const item = orders.find(x => x.id === id);

if (!item) return;

editId = id;

document.getElementById("orderUser").value = item.user;

const service = services.find(s => s.name === item.service);

if (service) {

document.getElementById("orderService").value = service.id;

}

document.getElementById("orderQuantity").value = item.quantity;

document.getElementById("orderPrice").value = item.price;

document.getElementById("orderStatus").value = item.status;

document.querySelector("button[onclick='saveOrder()']").innerText =
"💾 Update Order";

};

// =======================
// DELETE ORDER
// =======================

window.deleteOrder = function (id) {

if (confirm("Delete this order?")) {

remove(ref(db, "orders/" + id));

}

};
// =======================
// SEARCH ORDER
// =======================

window.searchOrder = function () {

const key = document
.getElementById("searchOrder")
.value
.toLowerCase();

document.querySelectorAll("#ordersTable tr").forEach((row, index) => {

if (index === 0) return;

row.style.display = row.innerText.toLowerCase().includes(key)
? ""
: "none";

});

};

// =======================
// CHANGE STATUS
// =======================

window.changeStatus = function (id, status) {

update(ref(db, "orders/" + id), {
status
});

};

// =======================
// COPY ORDER ID
// =======================

window.copyOrderId = function (id) {

navigator.clipboard.writeText(id);

alert("Order ID Copied");

};

// =======================
// CANCEL EDIT
// =======================

window.cancelEdit = function () {

editId = null;

clearForm();

const btn = document.querySelector("button[onclick='saveOrder()']");

if (btn) {
btn.innerText = "➕ Save Order";
}

};

// =======================
// VALIDATION
// =======================

document.addEventListener("DOMContentLoaded", () => {

const qty = document.getElementById("orderQuantity");

if (qty) {

qty.addEventListener("input", () => {

if (Number(qty.value) < 1) {
qty.value = 1;
}

});

}

});

// =======================
// CONSOLE
// =======================

console.log("✅ NovaSMM Orders Module Loaded");