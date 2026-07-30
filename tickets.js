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
const ticketsRef = ref(db, "tickets");

let users = [];
let tickets = [];
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
// LOAD TICKETS
// =======================

onValue(ticketsRef, (snapshot) => {

tickets = [];

if (snapshot.exists()) {

snapshot.forEach((child) => {

tickets.push({
id: child.key,
...child.val()
});

});

}

renderTickets();

});

// =======================
// LOAD USER DROPDOWN
// =======================

function loadUsers() {

const select = document.getElementById("ticketUser");

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
// RENDER TICKETS
// =======================

function renderTickets() {

const table = document.getElementById("ticketsTable");

table.innerHTML = `

<tr>

<th>Ticket ID</th>

<th>User</th>

<th>Subject</th>

<th>Status</th>

<th>Date</th>

<th>Action</th>

</tr>

`;

tickets.forEach(item => {

table.innerHTML += `

<tr>

<td>${item.ticketId}</td>

<td>${item.userName}</td>

<td>${item.subject}</td>

<td>

<select onchange="changeStatus('${item.id}',this.value)">

<option value="Open"
${item.status=="Open"?"selected":""}>
Open
</option>

<option value="Pending"
${item.status=="Pending"?"selected":""}>
Pending
</option>

<option value="Closed"
${item.status=="Closed"?"selected":""}>
Closed
</option>

</select>

</td>

<td>${item.createdAt}</td>

<td>

<button onclick="copyTicketId('${item.ticketId}')">
Copy ID
</button>

<button onclick="editTicket('${item.id}')">
Edit
</button>

<button onclick="deleteTicket('${item.id}')">
Delete
</button>

</td>

</tr>

`;

});

}
// =======================
// SAVE TICKET
// =======================

window.saveTicket = function () {

const userId = document.getElementById("ticketUser").value;
const subject = document.getElementById("ticketSubject").value.trim();
const message = document.getElementById("ticketMessage").value.trim();
const status = document.getElementById("ticketStatus").value;

if (!userId || !subject || !message) {

alert("Please fill all fields");

return;

}

const user = users.find(u => u.id === userId);

if (!user) {

alert("User not found");

return;

}

// =======================
// UPDATE
// =======================

if (editId) {

update(ref(db, "tickets/" + editId), {

userId,
userName: user.name,
subject,
message,
status,
updatedAt: new Date().toLocaleString()

});

editId = null;

document.querySelector("button[onclick='saveTicket()']").innerText =
"🎫 Save Ticket";

}

// =======================
// ADD
// =======================

else {

const newRef = push(ticketsRef);

set(newRef, {

ticketId: "TKT" + Date.now(),

userId,
userName: user.name,
subject,
message,
status,

createdAt: new Date().toLocaleString()

});

}

clearTicketForm();

};

// =======================
// CLEAR FORM
// =======================

function clearTicketForm() {

document.getElementById("ticketUser").value = "";

document.getElementById("ticketSubject").value = "";

document.getElementById("ticketMessage").value = "";

document.getElementById("ticketStatus").value = "Open";

}

// =======================
// EDIT TICKET
// =======================

window.editTicket = function(id){

const item = tickets.find(x => x.id === id);

if(!item) return;

editId = id;

document.getElementById("ticketUser").value = item.userId;
document.getElementById("ticketSubject").value = item.subject;
document.getElementById("ticketMessage").value = item.message;
document.getElementById("ticketStatus").value = item.status;

document.querySelector("button[onclick='saveTicket()']").innerText =
"💾 Update Ticket";

};

// =======================
// DELETE TICKET
// =======================

window.deleteTicket = function(id){

if(confirm("Delete this ticket?")){

remove(ref(db,"tickets/"+id));

}

};
// =======================
// SEARCH TICKET
// =======================

window.searchTicket = function () {

const key = document
.getElementById("searchTicket")
.value
.toLowerCase();

document.querySelectorAll("#ticketsTable tr").forEach((row,index)=>{

if(index===0) return;

row.style.display =
row.innerText.toLowerCase().includes(key)
? ""
: "none";

});

};

// =======================
// CHANGE STATUS
// =======================

window.changeStatus = function(id,status){

update(ref(db,"tickets/"+id),{
status
});

};

// =======================
// COPY TICKET ID
// =======================

window.copyTicketId = function(id){

navigator.clipboard.writeText(id);

alert("Ticket ID Copied");

};

// =======================
// CANCEL EDIT
// =======================

window.cancelEdit = function(){

editId = null;

clearTicketForm();

const btn=document.querySelector("button[onclick='saveTicket()']");

if(btn){

btn.innerText="🎫 Save Ticket";

}

};

// =======================
// VALIDATION
// =======================

document.addEventListener("DOMContentLoaded",()=>{

const subject=document.getElementById("ticketSubject");

if(subject){

subject.maxLength=100;

}

});

// =======================
// CONSOLE
// =======================

console.log("✅ NovaSMM Tickets Module Loaded");