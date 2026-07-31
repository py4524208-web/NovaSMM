import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  ref,
  get,
  push,
  set,
  update
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

let currentUser = null;
let currentService = null;

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.replace("customer-login.html");
    return;
  }

  currentUser = user;

  await loadService();

});

async function loadService() {

  const id = localStorage.getItem("selectedService");

  if (!id) {

    window.location.replace("customer-services.html");

    return;

  }

  const snap = await get(ref(db, "services/" + id));

  if (!snap.exists()) {

    alert("Service Not Found");

    window.location.replace("customer-services.html");

    return;

  }

  currentService = snap.val();

  document.getElementById("serviceName").value = currentService.name || "";
  document.getElementById("servicePrice").value = currentService.price || 0;
  document.getElementById("serviceMin").value = currentService.min || 0;
  document.getElementById("serviceMax").value = currentService.max || 0;

}

const qtyInput = document.getElementById("orderQuantity");

if (qtyInput) {

  qtyInput.addEventListener("input", () => {

    if (!currentService) return;

    const qty = Number(qtyInput.value || 0);

    const total = (qty * Number(currentService.price)) / 1000;

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
      msg.innerHTML = "Please enter link and quantity.";
      return;
    }

    if (
      qty < Number(currentService.min) ||
      qty > Number(currentService.max)
    ) {
      msg.innerHTML =
        `Quantity must be between ${currentService.min} and ${currentService.max}`;
      return;
    }

    const customerRef = ref(db, "customers/" + currentUser.uid);
    const customerSnap = await get(customerRef);

    if (!customerSnap.exists()) {
      msg.innerHTML = "Customer not found.";
      return;
    }

    const customer = customerSnap.val();

    const total =
      (qty * Number(currentService.price)) / 1000;

    if ((customer.wallet || 0) < total) {
      msg.innerHTML = "Insufficient Wallet Balance.";
      return;
    }

    // Wallet Deduct
    await update(customerRef, {
      wallet: (customer.wallet || 0) - total
    });

    // Save Order
    const orderRef = push(
      ref(db, "customer_orders/" + currentUser.uid)
    );

    await set(orderRef, {

      service: currentService.name,
      serviceId: localStorage.getItem("selectedService"),
      link: link,
      quantity: qty,
      price: total,
      status: "Pending",
      provider: "",
      providerOrderId: "",
      createdAt: new Date().toLocaleString()

    });

    msg.innerHTML = "✅ Order Placed Successfully.";

    setTimeout(() => {
      window.location.href = "customer-orders.html";
    }, 1000);

  };

}

console.log("Customer Order Ready");