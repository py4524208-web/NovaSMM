import { app } from "./firebase.js";

alert("firebase imported");

import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const auth = getAuth(app);

window.login = async function () {

  alert("Login Start");

  try {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const user = await signInWithEmailAndPassword(auth, email, password);

    alert("Success");

    location.href = "dashboard.html";

  } catch(e) {

    alert(e.code + "\n" + e.message);

    console.log(e);

  }

}