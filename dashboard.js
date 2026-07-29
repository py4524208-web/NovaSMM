import { db } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

function countItems(snapshot) {
    if (!snapshot.exists()) return 0;
    return Object.keys(snapshot.val()).length;
}

// Total Orders
onValue(ref(db, "orders"), (snapshot) => {
    document.getElementById("orders").innerText = countItems(snapshot);
});

// Total Services
onValue(ref(db, "services"), (snapshot) => {
    document.getElementById("services").innerText = countItems(snapshot);
});

// Total Users
onValue(ref(db, "users"), (snapshot) => {
    document.getElementById("users").innerText = countItems(snapshot);
});