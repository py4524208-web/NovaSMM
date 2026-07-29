import { db } from "./firebase.js";
import {
getDatabase,
ref,
push,
set,
onValue,
remove
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

window.addOrder=function(){

const user=prompt("User Name");
const service=prompt("Service");
const qty=prompt("Quantity");
const price=prompt("Price");

if(!user)return;

const id=Date.now();

set(ref(db,"orders/"+id),{

id,
user,
service,
qty,
price,
status:"Pending"

});

}

const tbody=document.querySelector("#ordersTable tbody");

onValue(ref(db,"orders"),snapshot=>{

tbody.innerHTML="";

snapshot.forEach(data=>{

const o=data.val();

tbody.innerHTML+=`
<tr>
<td>${o.id}</td>
<td>${o.user}</td>
<td>${o.service}</td>
<td>${o.qty}</td>
<td>$${o.price}</td>
<td>${o.status}</td>
<td>
<button onclick="deleteOrder('${o.id}')">Delete</button>
</td>
</tr>
`;

});

});

window.deleteOrder=function(id){

remove(ref(db,"orders/"+id));

}