import { db } from "./firebase.js";

import {
ref,
push,
set,
onValue,
remove,
update
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const serviceRef = ref(db,"services");
const providerRef = ref(db,"providers");

let services=[];
let providers=[];
let editId=null;

// ======================
// LOAD PROVIDERS
// ======================

onValue(providerRef,(snapshot)=>{

providers=[];

if(snapshot.exists()){

snapshot.forEach((child)=>{

providers.push({
id:child.key,
...child.val()
});

});

}

loadProviders();

});

// ======================
// LOAD SERVICES
// ======================

onValue(serviceRef,(snapshot)=>{

services=[];

if(snapshot.exists()){

snapshot.forEach((child)=>{

services.push({
id:child.key,
...child.val()
});

});

}

renderServices();

});

// ======================
// LOAD PROVIDER DROPDOWN
// ======================

function loadProviders(){

const select=document.getElementById("serviceProvider");

select.innerHTML=`
<option value="">
Select Provider
</option>
`;

providers.forEach(item=>{

select.innerHTML+=`
<option value="${item.name}">
${item.name}
</option>
`;

});

}

// ======================
// RENDER SERVICES
// ======================

function renderServices(){

const table=document.getElementById("serviceTable");

table.innerHTML=`

<tr>

<th>ID</th>

<th>Service</th>

<th>Price</th>

<th>Min</th>

<th>Max</th>

<th>Provider</th>

<th>Status</th>

<th>Action</th>

</tr>

`;

services.forEach(item=>{

table.innerHTML+=`

<tr>

<td>${item.id}</td>

<td>${item.name}</td>

<td>₹${item.price}</td>

<td>${item.min}</td>

<td>${item.max}</td>

<td>${item.provider}</td>

<td>${item.status}</td>

<td>

<button onclick="editService('${item.id}')">

Edit

</button>

<button onclick="deleteService('${item.id}')">

Delete

</button>

</td>

</tr>

`;

});

}
// ======================
// ADD / UPDATE SERVICE
// ======================

window.addService = function () {

const name = document.getElementById("serviceName").value.trim();
const price = document.getElementById("servicePrice").value.trim();
const min = document.getElementById("serviceMin").value.trim();
const max = document.getElementById("serviceMax").value.trim();
const provider = document.getElementById("serviceProvider").value;
const status = document.getElementById("serviceStatus").value;

if (!name || !price || !min || !max || !provider) {

alert("Please fill all fields");

return;

}

// UPDATE

if(editId){

update(ref(db,"services/"+editId),{

name,
price:Number(price),
min:Number(min),
max:Number(max),
provider,
status

});

editId=null;

document.querySelector("button[onclick='addService()']").innerText="➕ Add Service";

}

// ADD

else{

const newRef=push(serviceRef);

set(newRef,{

name,
price:Number(price),
min:Number(min),
max:Number(max),
provider,
status,
createdAt:new Date().toLocaleString()

});

}

clearForm();

};

// ======================
// CLEAR FORM
// ======================

function clearForm(){

document.getElementById("serviceName").value="";
document.getElementById("servicePrice").value="";
document.getElementById("serviceMin").value="";
document.getElementById("serviceMax").value="";
document.getElementById("serviceProvider").value="";
document.getElementById("serviceStatus").value="Active";

}

// ======================
// EDIT SERVICE
// ======================

window.editService=function(id){

const item=services.find(x=>x.id===id);

if(!item) return;

editId=id;

document.getElementById("serviceName").value=item.name;
document.getElementById("servicePrice").value=item.price;
document.getElementById("serviceMin").value=item.min;
document.getElementById("serviceMax").value=item.max;
document.getElementById("serviceProvider").value=item.provider;
document.getElementById("serviceStatus").value=item.status;

document.querySelector("button[onclick='addService()']").innerText="💾 Update Service";

};

// ======================
// DELETE SERVICE
// ======================

window.deleteService=function(id){

if(confirm("Delete this service?")){

remove(ref(db,"services/"+id));

}

};
// ======================
// SEARCH SERVICE
// ======================

window.searchService = function () {

const key = document
.getElementById("searchService")
.value
.toLowerCase();

document.querySelectorAll("#serviceTable tr").forEach((row,index)=>{

if(index===0) return;

row.style.display = row.innerText.toLowerCase().includes(key)
? ""
: "none";

});

};

// ======================
// CHANGE STATUS
// ======================

window.changeStatus = function(id,status){

update(ref(db,"services/"+id),{

status

});

};

// ======================
// COPY SERVICE ID
// ======================

window.copyServiceId = function(id){

navigator.clipboard.writeText(id);

alert("Service ID Copied");

};

// ======================
// CANCEL EDIT
// ======================

window.cancelEdit = function(){

editId=null;

clearForm();

const btn=document.querySelector("button[onclick='addService()']");

if(btn){

btn.innerText="➕ Add Service";

}

};

// ======================
// FORM VALIDATION
// ======================

document.addEventListener("DOMContentLoaded",()=>{

const price=document.getElementById("servicePrice");

if(price){

price.addEventListener("input",()=>{

if(Number(price.value)<0){

price.value=0;

}

});

}

});

// ======================
// CONSOLE
// ======================

console.log("✅ NovaSMM Services Module Loaded");