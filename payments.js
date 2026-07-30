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
const paymentsRef = ref(db, "payments");

let users = [];
let payments = [];
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
// LOAD PAYMENTS
// =======================

onValue(paymentsRef, (snapshot) => {

payments = [];

if (snapshot.exists()) {

snapshot.forEach((child) => {

payments.push({
id: child.key,
...child.val()
});

});

}

renderPayments();

});

// =======================
// LOAD USER DROPDOWN
// =======================

function loadUsers() {

const select = document.getElementById("paymentUser");

select.innerHTML = `
<option value="">Select User</option>
`;

users.forEach(user => {

select.innerHTML += `
<option value="${user.id}">
${user.name}
</option>
`;

});

}

// =======================
// RENDER PAYMENTS
// =======================

function renderPayments() {

const table = document.getElementById("paymentsTable");

table.innerHTML = `

<tr>

<th>Payment ID</th>

<th>User</th>

<th>Type</th>

<th>Amount</th>

<th>Status</th>

<th>Remark</th>

<th>Action</th>

</tr>

`;

payments.forEach(item => {

table.innerHTML += `

<tr>

<td>${item.paymentId}</td>

<td>${item.userName}</td>

<td>${item.type}</td>

<td>₹${item.amount}</td>

<td>

<select onchange="changeStatus('${item.id}',this.value)">

<option value="Pending"
${item.status=="Pending"?"selected":""}>
Pending
</option>

<option value="Approved"
${item.status=="Approved"?"selected":""}>
Approved
</option>

<option value="Rejected"
${item.status=="Rejected"?"selected":""}>
Rejected
</option>

</select>

</td>

<td>${item.remark}</td>

<td>

<button onclick="copyPaymentId('${item.paymentId}')">

Copy ID

</button>

<button onclick="editPayment('${item.id}')">

Edit

</button>

<button onclick="deletePayment('${item.id}')">

Delete

</button>

</td>

</tr>

`;

});

}
// =======================
// SAVE PAYMENT
// =======================

window.savePayment = function () {

const userId = document.getElementById("paymentUser").value;
const type = document.getElementById("paymentType").value;
const amount = Number(document.getElementById("paymentAmount").value);
const status = document.getElementById("paymentStatus").value;
const remark = document.getElementById("paymentRemark").value.trim();

if (!userId || amount <= 0) {

alert("Please fill all fields");

return;

}

const user = users.find(u => u.id === userId);

if (!user) {

alert("User not found");

return;

}

// UPDATE
if (editId) {

update(ref(db, "payments/" + editId), {

userId,
userName: user.name,
type,
amount,
status,
remark,
updatedAt: new Date().toLocaleString()

});

editId = null;

document.querySelector("button[onclick='savePayment()']").innerText =
"💾 Save Payment";

}

// ADD
else {

const newRef = push(paymentsRef);

set(newRef, {

paymentId: "PAY" + Date.now(),

userId,
userName: user.name,
type,
amount,
status,
remark,

createdAt: new Date().toLocaleString()

});

}

clearPaymentForm();

};

// =======================
// CLEAR FORM
// =======================

function clearPaymentForm() {

document.getElementById("paymentUser").value = "";

document.getElementById("paymentType").value = "Deposit";

document.getElementById("paymentAmount").value = "";

document.getElementById("paymentStatus").value = "Pending";

document.getElementById("paymentRemark").value = "";

}

// =======================
// EDIT PAYMENT
// =======================

window.editPayment = function(id){

const item = payments.find(x => x.id === id);

if(!item) return;

editId = id;

document.getElementById("paymentUser").value = item.userId;
document.getElementById("paymentType").value = item.type;
document.getElementById("paymentAmount").value = item.amount;
document.getElementById("paymentStatus").value = item.status;
document.getElementById("paymentRemark").value = item.remark;

document.querySelector("button[onclick='savePayment()']").innerText =
"💾 Update Payment";

};

// =======================
// DELETE PAYMENT
// =======================

window.deletePayment = function(id){

if(confirm("Delete this payment?")){

remove(ref(db,"payments/"+id));

}

};
// =======================
// SEARCH PAYMENT
// =======================

window.searchPayment = function () {

const key = document
.getElementById("searchPayment")
.value
.toLowerCase();

document.querySelectorAll("#paymentsTable tr").forEach((row,index)=>{

if(index===0) return;

row.style.display = row.innerText.toLowerCase().includes(key)
? ""
: "none";

});

};

// =======================
// CHANGE STATUS
// =======================

window.changeStatus = async function(id,status){

const payment = payments.find(x=>x.id===id);

if(!payment) return;

// Update Payment Status
await update(ref(db,"payments/"+id),{
status
});

// Auto Wallet Update
if(status==="Approved"){

const user = users.find(u=>u.id===payment.userId);

if(user){

let balance = Number(user.balance || 0);

if(payment.type==="Deposit"){

balance += Number(payment.amount);

}else if(payment.type==="Withdraw"){

balance -= Number(payment.amount);

if(balance<0) balance=0;

}

await update(ref(db,"users/"+payment.userId),{
balance
});

}

}

};

// =======================
// COPY PAYMENT ID
// =======================

window.copyPaymentId = function(id){

navigator.clipboard.writeText(id);

alert("Payment ID Copied");

};

// =======================
// CANCEL EDIT
// =======================

window.cancelEdit = function(){

editId = null;

clearPaymentForm();

const btn = document.querySelector("button[onclick='savePayment()']");

if(btn){

btn.innerText = "💾 Save Payment";

}

};

// =======================
// VALIDATION
// =======================

document.addEventListener("DOMContentLoaded",()=>{

const amount = document.getElementById("paymentAmount");

if(amount){

amount.addEventListener("input",()=>{

if(Number(amount.value)<0){

amount.value = 0;

}

});

}

});

// =======================
// CONSOLE
// =======================

console.log("✅ NovaSMM Payments Module Loaded");