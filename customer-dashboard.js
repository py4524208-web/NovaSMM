import { auth, db } from "./firebase.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
ref,
get,
onValue
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

// =======================
// AUTH CHECK
// =======================

onAuthStateChanged(auth, async(user)=>{

if(!user){

location.href="customer-login.html";

return;

}

loadCustomer(user.uid);

loadOrders(user.uid);

});

// =======================
// LOAD CUSTOMER
// =======================

async function loadCustomer(uid){

const snap=await get(ref(db,"customers/"+uid));

if(!snap.exists()) return;

const data=snap.val();

document.getElementById("walletBalance").innerHTML="₹"+(data.wallet||0);

}

// =======================
// LOAD ORDERS
// =======================

function loadOrders(uid){

const ordersRef=ref(db,"customer_orders/"+uid);

onValue(ordersRef,(snapshot)=>{

const table=document.getElementById("recentOrders");

table.innerHTML=`
<tr>
<th>Service</th>
<th>Link</th>
<th>Status</th>
<th>Quantity</th>
</tr>
`;

let total=0;
let pending=0;
let completed=0;

if(snapshot.exists()){

snapshot.forEach((child)=>{

const order=child.val();

total++;

if(order.status==="Pending") pending++;

if(order.status==="Completed") completed++;

table.innerHTML+=`
<tr>
<td>${order.service}</td>
<td>${order.link}</td>
<td>${order.status}</td>
<td>${order.quantity}</td>
</tr>
`;

});

}

document.getElementById("totalOrders").innerHTML=total;
document.getElementById("pendingOrders").innerHTML=pending;
document.getElementById("completedOrders").innerHTML=completed;

});

}

console.log("Customer Dashboard Part 1 Loaded");
// =======================
// LOAD PROFILE
// =======================

async function loadProfile(uid){

  const snap = await get(ref(db,"customers/"+uid));

  if(!snap.exists()) return;

  const data = snap.val();

  document.title = "NovaSMM - " + data.name;

  console.log("Customer:",data.name);

}

// =======================
// LIVE WALLET UPDATE
// =======================

function liveWallet(uid){

  onValue(ref(db,"customers/"+uid+"/wallet"),(snap)=>{

    if(snap.exists()){

      document.getElementById("walletBalance").innerHTML =
      "₹" + snap.val();

    }

  });

}

// =======================
// DASHBOARD INIT
// =======================

onAuthStateChanged(auth,(user)=>{

  if(!user) return;

  loadProfile(user.uid);

  liveWallet(user.uid);

});

// =======================
// NOTIFICATION
// =======================

window.showNotification = function(message){

  alert(message);

};

// =======================
// FUTURE READY
// =======================

// Upcoming:
// ✔ Auto Order Tracking
// ✔ Live Notifications
// ✔ Wallet History
// ✔ Recent Transactions
// ✔ Service Recommendations

console.log("Customer Dashboard Part 2 Loaded");

import { signOut } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { auth } from "./firebase.js";

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    location.href = "customer-login.html";
  });
}
// =======================
// LOGOUT
// =======================

window.customerLogout = async function () {

  try {

    await signOut(auth);

    localStorage.removeItem("selectedService");

    window.location.replace("customer-login.html");

  } catch (e) {

    console.error(e);
    alert(e.message);

  }

};