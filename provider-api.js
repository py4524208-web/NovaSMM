import { db } from "./firebase.js";

import {
ref,
push,
set,
onValue,
remove
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const providersRef = ref(db, "provider_api");

// =======================
// SAVE PROVIDER
// =======================

window.saveProvider = function () {

const name = document.getElementById("providerName").value.trim();
const url = document.getElementById("providerUrl").value.trim();
const key = document.getElementById("providerKey").value.trim();

if (!name || !url || !key) {

alert("Fill all fields");

return;

}

const newProvider = push(providersRef);

set(newProvider, {

name,
url,
key,
status: "Saved",
balance: "0.00",
createdAt: new Date().toLocaleString()

});

alert("Provider Saved");

clearForm();

};

// =======================
// CLEAR FORM
// =======================

function clearForm() {

document.getElementById("providerName").value = "";
document.getElementById("providerUrl").value = "";
document.getElementById("providerKey").value = "";

}

// =======================
// LOAD PROVIDERS
// =======================

onValue(providersRef, (snapshot) => {

const table = document.getElementById("providerApiTable");

table.innerHTML = `

<tr>
<th>Name</th>
<th>Balance</th>
<th>Status</th>
<th>Action</th>
</tr>

`;

if (!snapshot.exists()) return;

snapshot.forEach((child) => {

const p = child.val();

table.innerHTML += `

<tr>

<td>${p.name}</td>

<td>₹${p.balance}</td>

<td>${p.status}</td>

<td>

<button onclick="deleteProvider('${child.key}')">
Delete
</button>

</td>

</tr>

`;

});

});

// =======================
// DELETE
// =======================

window.deleteProvider = function(id){

remove(ref(db,"provider_api/"+id));

};

console.log("Provider API Part 1 Loaded");
// =======================
// TEST CONNECTION
// =======================

window.testConnection = async function () {

const url = document.getElementById("providerUrl").value.trim();
const key = document.getElementById("providerKey").value.trim();

if (!url || !key) {

alert("Enter API URL & API Key");

return;

}

alert("Provider Test feature ready.\n\nAPI connect hote hi yahan Live Connection check hoga.");

};

// =======================
// CHECK BALANCE
// =======================

window.checkBalance = async function () {

alert("Balance API baad me provider ke API se connect hogi.");

};

// =======================
// SYNC SERVICES
// =======================

window.syncServices = async function () {

alert("Sync Services feature ready.\n\nProvider API add hote hi services automatically Firebase me import hongi.");

};

// =======================
// UPDATE PROVIDER
// =======================

window.updateProviderStatus = function(id,status,balance){

update(ref(db,"provider_api/"+id),{

status,
balance

});

};

// =======================
// SEARCH PROVIDER
// =======================

window.searchProvider=function(){

const key=document
.getElementById("searchProvider")
.value
.toLowerCase();

document.querySelectorAll("#providerApiTable tr").forEach((row,index)=>{

if(index===0)return;

row.style.display=
row.innerText.toLowerCase().includes(key)
?
""
:
"none";

});

};

console.log("Provider API Part 2 Loaded");