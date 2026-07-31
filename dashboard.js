import { db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const usersRef = ref(db,"users");
const servicesRef = ref(db,"services");
const ordersRef = ref(db,"orders");
const paymentsRef = ref(db,"payments");

let users=[];
let services=[];
let orders=[];
let payments=[];

// =======================
// USERS
// =======================

onValue(usersRef,(snapshot)=>{

users=[];

if(snapshot.exists()){

snapshot.forEach((child)=>{

users.push({
id:child.key,
...child.val()
});

});

}

document.getElementById("totalUsers").innerText=users.length;

updateWallet();

});

// =======================
// SERVICES
// =======================

onValue(servicesRef,(snapshot)=>{

services=[];

if(snapshot.exists()){

snapshot.forEach((child)=>{

services.push({
id:child.key,
...child.val()
});

});

}

document.getElementById("totalServices").innerText=services.length;

});

// =======================
// ORDERS
// =======================

onValue(ordersRef,(snapshot)=>{

orders=[];

if(snapshot.exists()){

snapshot.forEach((child)=>{

orders.push({
id:child.key,
...child.val()
});

});

}

document.getElementById("totalOrders").innerText=orders.length;

updateRevenue();

renderRecentOrders();

});

// =======================
// PAYMENTS
// =======================

onValue(paymentsRef,(snapshot)=>{

payments=[];

if(snapshot.exists()){

snapshot.forEach((child)=>{

payments.push({
id:child.key,
...child.val()
});

});

}

document.getElementById("pendingPayments").innerText=

payments.filter(x=>x.status==="Pending").length;

renderRecentPayments();

});

// =======================
// TOTAL WALLET
// =======================

function updateWallet(){

let total=0;

users.forEach(user=>{

total+=Number(user.balance||0);

});

document.getElementById("walletBalance").innerText="₹"+total;

}

// =======================
// TOTAL REVENUE
// =======================

function updateRevenue(){

let total=0;

orders.forEach(order=>{

if(order.status==="Completed"){

total+=Number(order.price||0);

}

});

document.getElementById("totalRevenue").innerText="₹"+total;

}
// =======================
// RECENT ORDERS
// =======================

function renderRecentOrders() {

const table = document.getElementById("recentOrders");

table.innerHTML = `

<tr>
<th>Order ID</th>
<th>User</th>
<th>Service</th>
<th>Status</th>
<th>Amount</th>
</tr>

`;

orders
.slice(-10)
.reverse()
.forEach(item => {

table.innerHTML += `

<tr>

<td>${item.orderId}</td>

<td>${item.user}</td>

<td>${item.service}</td>

<td>${item.status}</td>

<td>₹${item.price}</td>

</tr>

`;

});

}

// =======================
// RECENT PAYMENTS
// =======================

function renderRecentPayments() {

const table = document.getElementById("recentPayments");

table.innerHTML = `

<tr>

<th>Payment ID</th>

<th>User</th>

<th>Type</th>

<th>Status</th>

<th>Amount</th>

</tr>

`;

payments
.slice(-10)
.reverse()
.forEach(item => {

table.innerHTML += `

<tr>

<td>${item.paymentId}</td>

<td>${item.userName}</td>

<td>${item.type}</td>

<td>${item.status}</td>

<td>₹${item.amount}</td>

</tr>

`;

});

}

// =======================
// AUTO REFRESH
// =======================

setInterval(() => {

updateWallet();

updateRevenue();

}, 5000);

// =======================
// DASHBOARD READY
// =======================

console.log("✅ NovaSMM Dashboard Loaded");