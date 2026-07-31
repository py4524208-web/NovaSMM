import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import { auth } from "./firebase.js";

const page = location.pathname.split("/").pop();

// =======================
// AUTO REDIRECT
// =======================

onAuthStateChanged(auth, (user) => {

  // Login page par ho aur pehle se login ho
  if (
    user &&
    (page === "customer-login.html" || page === "")
  ) {
    location.replace("customer-dashboard.html");
    return;
  }

  // Protected pages
  const protectedPages = [
    "customer-dashboard.html",
    "customer-services.html",
    "customer-order.html",
    "customer-orders.html",
    "customer-wallet.html",
    "customer-tickets.html"
  ];

  if (protectedPages.includes(page) && !user) {
    location.replace("customer-login.html");
  }

});

// =======================
// LOGIN
// =======================

const btn = document.getElementById("loginBtn");

if (btn) {

  btn.onclick = async () => {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const msg = document.getElementById("msg");

    msg.innerHTML = "";

    if (!email || !password) {
      msg.innerHTML = "Please fill all fields.";
      return;
    }

    try {

      await signInWithEmailAndPassword(auth, email, password);

      location.replace("customer-dashboard.html");

    } catch (e) {

      msg.innerHTML = e.code;

    }

  };

}

// =======================
// LOGOUT
// =======================

window.customerLogout = async function () {

  try {

    await signOut(auth);

    localStorage.removeItem("selectedService");

    location.replace("customer-login.html");

  } catch (e) {

    console.error(e);

    alert(e.message);

  }

};

// =======================
// ENTER KEY
// =======================

document.addEventListener("keydown", (e) => {

  if (e.key === "Enter" && btn) {
    btn.click();
  }

});

console.log("Customer Auth Loaded");