import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import { auth } from "./firebase.js";

const page = location.pathname.split("/").pop();

// Already Logged In
onAuthStateChanged(auth, (user) => {
  if (user && page === "customer-login.html") {
    location.href = "customer-dashboard.html";
  }
});

// Login
const btn = document.getElementById("loginBtn");

if (btn) {
  btn.onclick = async () => {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const msg = document.getElementById("msg");

    msg.innerHTML = "";

    if (!email || !password) {
      msg.innerHTML = "Please fill all fields";
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      location.href = "customer-dashboard.html";
    } catch (e) {
      msg.innerHTML = e.code;
    }

  };
}

// Logout
window.customerLogout = async function () {

  try {

    await signOut(auth);

    location.href = "customer-login.html";

  } catch (e) {

    console.error(e);
    alert(e.message);

  }

};

// Protect Customer Pages
if (page !== "customer-login.html" && page !== "customer-register.html") {

  onAuthStateChanged(auth, (user) => {

    if (!user) {
      location.href = "customer-login.html";
    }

  });

}

// Enter Key Login
document.addEventListener("keydown", function (e) {

  if (e.key === "Enter" && btn) {
    btn.click();
  }

});

console.log("Customer Login Ready");