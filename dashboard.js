import { db } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

// Orders Count
onValue(ref(db, "orders"), (snapshot) => {
    document.getElementById("orders").innerText = snapshot.size || 0;
});

// Services Count
onValue(ref(db, "services"), (snapshot) => {
    document.getElementById("services").innerText = snapshot.size || 0;
});

// Users Count
onValue(ref(db, "users"), (snapshot) => {
    document.getElementById("users").innerText = snapshot.size || 0;
});