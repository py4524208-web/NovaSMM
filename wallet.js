import { db } from "./firebase.js";

import {
ref,
push,
set,
onValue,
remove
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

let wallets = [];

window.updateWallet = function () {

const user = document.getElementById("walletUser").value.trim();
const amount = document.getElementById("walletAmount").value.trim();
const type = document.getElementById("walletType").value;

if (!user || !amount) {
alert("Please fill all fields");
return;
}

const newRef = push(ref(db, "wallet"));

set(newRef, {
user,
amount,
type
});

document.getElementById("walletUser").value = "";
document.getElementById("walletAmount").value = "";

};

function renderWallet() {

const table = document.getElementById("walletTable");

table.innerHTML = `
<tr>
<th>User</th>
<th>Amount</th>
<th>Type</th>
<th>Action</th>
</tr>
`;

wallets.forEach((item)=>{

table.innerHTML += `
<tr>
<td>${item.user}</td>
<td>₹${item.amount}</td>
<td>${item.type}</td>
<td>
<button onclick="deleteWallet('${item.id}')">
🗑 Delete
</button>
</td>
</tr>
`;

});

}

onValue(ref(db,"wallet"),(snapshot)=>{

wallets=[];

snapshot.forEach((child)=>{

wallets.push({
id:child.key,
...child.val()
});

});

renderWallet();

});

window.deleteWallet=function(id){

if(confirm("Delete Record?")){

remove(ref(db,"wallet/"+id));

}

};