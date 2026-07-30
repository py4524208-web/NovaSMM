import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
ref,
onValue
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

// =======================
// LOGIN CHECK
// =======================

onAuthStateChanged(auth,(user)=>{

if(!user){

location.href="customer-login.html";

return;

}

loadServices();

});

// =======================
// LOAD SERVICES
// =======================

function loadServices(){

const table=document.getElementById("servicesTable");

const servicesRef=ref(db,"services");

onValue(servicesRef,(snapshot)=>{

table.innerHTML=`
<tr>
<th>Category</th>
<th>Service</th>
<th>Rate</th>
<th>Min</th>
<th>Max</th>
<th>Action</th>
</tr>
`;

if(snapshot.exists()){

snapshot.forEach((child)=>{

const s=child.val();

table.innerHTML+=`
<tr>

<td>${s.category||"-"}</td>

<td>${s.name||"-"}</td>

<td>₹${s.price||0}</td>

<td>${s.min||0}</td>

<td>${s.max||0}</td>

<td>

<button onclick="orderService('${child.key}')">

Order

</button>

</td>

</tr>
`;

});

}

});

}

console.log("Customer Services Part 1 Loaded");