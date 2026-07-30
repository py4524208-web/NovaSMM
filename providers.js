import { db } from "./firebase.js";

import {
ref,
push,
set,
onValue,
remove,
update
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const providerRef = ref(db, "providers");

let providers = [];
let editId = null;

// ======================
// LOAD PROVIDERS
// ======================

onValue(providerRef, (snapshot) => {

providers = [];

if (snapshot.exists()) {

snapshot.forEach((child)=>{

providers.push({
id: child.key,
...child.val()
});

});

}

renderProviders();

});

// ======================
// RENDER TABLE
// ======================

function renderProviders(){

const table=document.getElementById("providerTable");

table.innerHTML=`
<tr>
<th>Name</th>
<th>API URL</th>
<th>API Key</th>
<th>Status</th>
<th>Action</th>
</tr>
`;

providers.forEach(item=>{

table.innerHTML+=`
<tr>

<td>${item.name}</td>

<td>
${item.api}
<br>
<button onclick="copyText('${item.api}')">
Copy
</button>
</td>

<td>
${item.key}
<br>
<button onclick="copyText('${item.key}')">
Copy
</button>
</td>

<td>

<select
onchange="changeStatus('${item.id}',this.value)">

<option value="Active"
${item.status=="Active"?"selected":""}>
Active
</option>

<option value="Inactive"
${item.status=="Inactive"?"selected":""}>
Inactive
</option>

</select>

</td>

<td>

<button
onclick="editProvider('${item.id}')">

Edit

</button>

<button
onclick="deleteProvider('${item.id}')">

Delete

</button>

</td>

</tr>
`;

});

}
// ======================
// ADD / UPDATE PROVIDER
// ======================

window.addProvider = function () {

const name = document.getElementById("providerName").value.trim();
const api = document.getElementById("providerApi").value.trim();
const key = document.getElementById("providerKey").value.trim();
const status = document.getElementById("providerStatus").value;

if (!name || !api || !key) {
alert("Please fill all fields");
return;
}

// UPDATE
if (editId) {

update(ref(db, "providers/" + editId), {
name,
api,
key,
status
});

editId = null;

document.querySelector("button[onclick='addProvider()']").innerText =
"➕ Add Provider";

}

// ADD
else {

const newRef = push(providerRef);

set(newRef, {
name,
api,
key,
status,
createdAt: new Date().toLocaleString()
});

}

clearForm();

};

// ======================
// CLEAR FORM
// ======================

function clearForm() {

document.getElementById("providerName").value = "";
document.getElementById("providerApi").value = "";
document.getElementById("providerKey").value = "";
document.getElementById("providerStatus").value = "Active";

}

// ======================
// EDIT PROVIDER
// ======================

window.editProvider = function(id){

const item = providers.find(x=>x.id===id);

if(!item) return;

editId = id;

document.getElementById("providerName").value = item.name;
document.getElementById("providerApi").value = item.api;
document.getElementById("providerKey").value = item.key;
document.getElementById("providerStatus").value = item.status;

document.querySelector("button[onclick='addProvider()']").innerText =
"💾 Update Provider";

};

// ======================
// DELETE PROVIDER
// ======================

window.deleteProvider = function(id){

if(confirm("Delete this provider?")){

remove(ref(db,"providers/"+id));

}

};

// ======================
// STATUS
// ======================

window.changeStatus = function(id,status){

update(ref(db,"providers/"+id),{
status
});

};
// ======================
// SEARCH PROVIDER
// ======================

window.searchProvider = function () {

const key = document
.getElementById("searchProvider")
.value
.toLowerCase();

document.querySelectorAll("#providerTable tr").forEach((row, index) => {

if (index === 0) return;

row.style.display = row.innerText.toLowerCase().includes(key)
? ""
: "none";

});

};

// ======================
// COPY TEXT
// ======================

window.copyText = function (text) {

navigator.clipboard.writeText(text);

alert("Copied Successfully");

};

// ======================
// CANCEL EDIT
// ======================

window.cancelEdit = function () {

editId = null;

clearForm();

const btn = document.querySelector("button[onclick='addProvider()']");

if (btn) {

btn.innerText = "➕ Add Provider";

}

};

// ======================
// FORM VALIDATION
// ======================

document.addEventListener("DOMContentLoaded", () => {

const apiInput = document.getElementById("providerApi");

if (apiInput) {

apiInput.addEventListener("blur", () => {

const value = apiInput.value.trim();

if (
value &&
!value.startsWith("http://") &&
!value.startsWith("https://")
) {

alert("API URL should start with http:// or https://");

}

});

}

});

// ======================
// CONSOLE MESSAGE
// ======================

console.log("✅ NovaSMM Providers Module Loaded");