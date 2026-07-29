import { db } from "./firebase.js";

import {
ref,
push,
set,
onValue,
remove
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

let services = [];

window.addService = function () {

const name = document.getElementById("serviceName").value.trim();
const price = document.getElementById("servicePrice").value.trim();
const category = document.getElementById("serviceCategory").value;
const provider = document.getElementById("providerId").value.trim();

if (!name || !price || !provider) {
alert("Please fill all fields");
return;
}

const newRef = push(ref(db, "services"));

set(newRef, {
name: name,
price: price,
category: category,
provider: provider,
status: "Active"
});

document.getElementById("serviceName").value = "";
document.getElementById("servicePrice").value = "";
document.getElementById("providerId").value = "";

};
function renderServices() {

const table = document.getElementById("serviceTable");

table.innerHTML = `
<tr>
<th>Name</th>
<th>Category</th>
<th>Price</th>
<th>Provider</th>
<th>Status</th>
<th>Action</th>
</tr>
`;

services.forEach((service)=>{

table.innerHTML += `
<tr>
<td>${service.name}</td>
<td>${service.category}</td>
<td>₹${service.price}</td>
<td>${service.provider}</td>
<td>${service.status}</td>
<td>
<button onclick="deleteService('${service.id}')">🗑 Delete</button>
</td>
</tr>
`;

});

}

onValue(ref(db,"services"),(snapshot)=>{

services=[];

snapshot.forEach((child)=>{

services.push({
id:child.key,
...child.val()
});

});

renderServices();

});

window.deleteService=function(id){

if(confirm("Delete Service?")){

remove(ref(db,"services/"+id));

}

}

window.searchService=function(){

const keyword=document.getElementById("searchService").value.toLowerCase();

const rows=document.querySelectorAll("#serviceTable tr");

rows.forEach((row,index)=>{

if(index===0) return;

row.style.display=row.innerText.toLowerCase().includes(keyword)?"":"none";

});

}