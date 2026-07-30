import { db } from "./firebase.js";

import {
ref,
onValue
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const usersRef = ref(db,"users");
const servicesRef = ref(db,"services");
const ordersRef = ref(db,"orders");
const paymentsRef = ref(db,"payments");
const ticketsRef = ref(db,"tickets");

let users=[];
let services=[];
let orders=[];
let payments=[];
let tickets=[];

// =======================
// USERS
// =======================

onValue(usersRef,(snapshot)=>{

users=[];

if(snapshot.exists()){

snapshot.forEach(child=>{

users.push({
id:child.key,
...child.val()
});

});

}

document.getElementById("reportUsers").innerText=
users.length;

});

// =======================
// SERVICES
// =======================

onValue(servicesRef,(snapshot)=>{

services=[];

if(snapshot.exists()){

snapshot.forEach(child=>{

services.push({
id:child.key,
...child.val()
});

});

}

document.getElementById("reportServices").innerText=
services.length;

});

// =======================
// ORDERS
// =======================

onValue(ordersRef,(snapshot)=>{

orders=[];

if(snapshot.exists()){

snapshot.forEach(child=>{

orders.push({
id:child.key,
...child.val()
});

});

}

document.getElementById("reportOrders").innerText=
orders.length;

updateRevenue();

renderReports();

});

// =======================
// PAYMENTS
// =======================

onValue(paymentsRef,(snapshot)=>{

payments=[];

if(snapshot.exists()){

snapshot.forEach(child=>{

payments.push({
id:child.key,
...child.val()
});

});

}

document.getElementById("reportPayments").innerText=
payments.length;

renderReports();

});

// =======================
// TICKETS
// =======================

onValue(ticketsRef,(snapshot)=>{

tickets=[];

if(snapshot.exists()){

snapshot.forEach(child=>{

tickets.push({
id:child.key,
...child.val()
});

});

}

document.getElementById("reportTickets").innerText=
tickets.length;

renderReports();

});

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

document.getElementById("reportRevenue").innerText=
"₹"+total;

}
// =======================
// RECENT ACTIVITY
// =======================

function renderReports() {

const table = document.getElementById("reportsTable");

table.innerHTML = `

<tr>

<th>Type</th>

<th>User</th>

<th>Description</th>

<th>Status</th>

<th>Date</th>

</tr>

`;

// Orders

orders.slice(-5).reverse().forEach(item=>{

table.innerHTML += `

<tr>

<td>🛒 Order</td>

<td>${item.user}</td>

<td>${item.service}</td>

<td>${item.status}</td>

<td>${item.createdAt || "-"}</td>

</tr>

`;

});

// Payments

payments.slice(-5).reverse().forEach(item=>{

table.innerHTML += `

<tr>

<td>💳 Payment</td>

<td>${item.userName}</td>

<td>${item.type} ₹${item.amount}</td>

<td>${item.status}</td>

<td>${item.createdAt || "-"}</td>

</tr>

`;

});

// Tickets

tickets.slice(-5).reverse().forEach(item=>{

table.innerHTML += `

<tr>

<td>🎫 Ticket</td>

<td>${item.userName}</td>

<td>${item.subject}</td>

<td>${item.status}</td>

<td>${item.createdAt || "-"}</td>

</tr>

`;

});

}

// =======================
// SEARCH REPORT
// =======================

window.searchReport = function(){

const key = document
.getElementById("searchReport")
.value
.toLowerCase();

document.querySelectorAll("#reportsTable tr").forEach((row,index)=>{

if(index===0) return;

row.style.display =
row.innerText.toLowerCase().includes(key)
? ""
: "none";

});

};

// =======================
// EXPORT CSV
// =======================

window.exportCSV = function(){

alert("CSV Export feature ready for implementation.");

};

// =======================
// PRINT REPORT
// =======================

window.printReport = function(){

window.print();

};

// =======================
// REFRESH
// =======================

window.refreshReports = function(){

location.reload();

};

// =======================
// CONSOLE
// =======================

console.log("✅ NovaSMM Reports Module Loaded");