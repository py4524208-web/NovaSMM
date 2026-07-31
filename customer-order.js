import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
ref,
get,
push,
set
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

let currentUser = null;
let currentService = null;

// =======================
// LOGIN CHECK
// =======================

onAuthStateChanged(auth, async(user)=>{

if(!user){

location.href="customer-login.html";

return;

}

currentUser=user;

loadService();

});

// =======================
// LOAD SELECTED SERVICE
// =======================

async function loadService(){

const id=localStorage.getItem("selectedService");

if(!id){

location.href="customer-services.html";

return;

}

const snap=await get(ref(db,"services/"+id));

if(!snap.exists()) return;

currentService=snap.val();

document.getElementById("serviceName").value=currentService.name||"";

document.getElementById("servicePrice").value=currentService.price||0;

document.getElementById("serviceMin").value=currentService.min||0;

document.getElementById("serviceMax").value=currentService.max||0;

}
// =======================
// TOTAL PRICE CALCULATION
// =======================

const qtyInput = document.getElementById("orderQuantity");

if (qtyInput) {

  qtyInput.addEventListener("input", () => {

    if (!currentService) return;

    const qty = Number(qtyInput.value || 0);
    const rate = Number(currentService.price || 0);

    const total = (qty * rate) / 1000;

    document.getElementById("totalPrice").innerHTML =
      total.toFixed(2);

  });

}

// =======================
// PLACE ORDER
// =======================

const placeBtn = document.getElementById("placeOrderBtn");

if (placeBtn) {

placeBtn.onclick = async () => {

const link = document.getElementById("orderLink").value.trim();

const qty = Number(document.getElementById("orderQuantity").value);

const msg = document.getElementById("msg");

msg.innerHTML = "";

if (!link || qty <= 0) {

msg.innerHTML = "Please enter link & quantity.";

return;

}

if (qty < Number(currentService.min) || qty > Number(currentService.max)) {

msg.innerHTML =
`Quantity must be between ${currentService.min} and ${currentService.max}`;

return;

}

const customerRef = ref(db, "customers/" + currentUser.uid);

const customerSnap = await get(customerRef);

const customer = customerSnap.val();

const total = (qty * Number(currentService.price)) / 1000;

if ((customer.wallet || 0) < total) {

msg.innerHTML = "Insufficient wallet balance.";

return;

}

const orderRef = push(ref(db, "customer_orders/" + currentUser.uid));

await set(orderRef, {

service: currentService.name,
serviceId: localStorage.getItem("selectedService"),
link,
quantity: qty,
price: total,
status: "Pending",
provider: "",
providerOrderId: "",
createdAt: new Date().toLocaleString()

});

msg.innerHTML = "✅ Order placed successfully.";

};

}

console.log("Customer Order Part 2 Loaded");
// =======================
// WALLET ENGINE
// =======================

import "./wallet-engine.js";

// =======================
// PLACE ORDER (UPDATED)
// =======================

const oldPlaceOrder = placeBtn.onclick;

placeBtn.onclick = async () => {

  const link = document.getElementById("orderLink").value.trim();
  const qty = Number(document.getElementById("orderQuantity").value);
  const msg = document.getElementById("msg");

  msg.innerHTML = "";

  if (!link || qty <= 0) {
    msg.innerHTML = "Please enter link and quantity.";
    return;
  }

  const total = (qty * Number(currentService.price)) / 1000;

  // Wallet Check
  const ok = await WalletEngine.deductBalance(
    currentUser.uid,
    total,
    "Order : " + currentService.name
  );

  if (!ok) {
    msg.innerHTML = "❌ Insufficient Wallet Balance";
    return;
  }

  // Run old order code
  await oldPlaceOrder();

};