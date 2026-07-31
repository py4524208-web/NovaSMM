// =======================
// NOVASMM SECURITY
// =======================

console.log("NovaSMM Security Started");

// Disable Right Click
document.addEventListener("contextmenu", e => {
    e.preventDefault();
});

// Disable F12
document.addEventListener("keydown", e => {

    if (e.key === "F12") {
        e.preventDefault();
    }

    if (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) {
        e.preventDefault();
    }

    if (e.ctrlKey && e.key.toUpperCase() === "U") {
        e.preventDefault();
    }

});
// =======================
// SECURITY LOG
// =======================

import { db, auth } from "./firebase.js";

import {
ref,
push,
set
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

function logSecurity(event, details = {}) {

const user = auth.currentUser;

set(push(ref(db, "security_logs")), {

event: event,

uid: user ? user.uid : "Guest",

email: user ? user.email : "Guest",

page: location.pathname,

userAgent: navigator.userAgent,

language: navigator.language,

platform: navigator.platform,

time: new Date().toISOString(),

details: details

});

}

// =======================
// DEVTOOLS DETECTION
// =======================

let devtoolsOpen = false;

setInterval(() => {

const start = Date.now();

debugger;

const end = Date.now();

if (end - start > 100 && !devtoolsOpen) {

devtoolsOpen = true;

logSecurity("Developer Tools Opened");


}

}, 2000);

// =======================
// COPY DETECTION
// =======================

document.addEventListener("copy", () => {

logSecurity("Copy Attempt");

});

// =======================
// CUT DETECTION
// =======================

document.addEventListener("cut", () => {

logSecurity("Cut Attempt");

});

// =======================
// PASTE DETECTION
// =======================

document.addEventListener("paste", () => {

logSecurity("Paste Attempt");

});

console.log("Security Part 2 Loaded");