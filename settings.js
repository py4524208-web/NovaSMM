import { db } from "./firebase.js";

import {
ref,
set,
update,
onValue
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const settingsRef = ref(db, "settings");

// =======================
// LOAD SETTINGS
// =======================

onValue(settingsRef, (snapshot) => {

if (!snapshot.exists()) return;

const data = snapshot.val();

document.getElementById("siteName").value =
data.siteName || "";

document.getElementById("siteUrl").value =
data.siteUrl || "";

document.getElementById("adminEmail").value =
data.adminEmail || "";

document.getElementById("supportWhatsapp").value =
data.supportWhatsapp || "";

document.getElementById("upiId").value =
data.upiId || "";

document.getElementById("merchantName").value =
data.merchantName || "";

document.getElementById("currency").value =
data.currency || "INR";

document.getElementById("theme").value =
data.theme || "dark";

document.getElementById("maintenance").value =
data.maintenance || "off";

});

// =======================
// SAVE WEBSITE SETTINGS
// =======================

window.saveSettings = function () {

update(settingsRef, {

siteName: document.getElementById("siteName").value,

siteUrl: document.getElementById("siteUrl").value,

adminEmail: document.getElementById("adminEmail").value,

supportWhatsapp: document.getElementById("supportWhatsapp").value

});

alert("Website Settings Saved");

};

// =======================
// SAVE PAYMENT SETTINGS
// =======================

window.savePaymentSettings = function () {

update(settingsRef, {

upiId: document.getElementById("upiId").value,

merchantName: document.getElementById("merchantName").value,

currency: document.getElementById("currency").value

});

alert("Payment Settings Saved");

};
// =======================
// CHANGE PASSWORD
// =======================

window.changePassword = function () {

const password = document.getElementById("adminPassword").value;
const confirm = document.getElementById("confirmPassword").value;

if (!password || !confirm) {

alert("Please fill both password fields");

return;

}

if (password !== confirm) {

alert("Passwords do not match");

return;

}

update(settingsRef, {

adminPassword: password

});

document.getElementById("adminPassword").value = "";
document.getElementById("confirmPassword").value = "";

alert("Password Changed Successfully");

};

// =======================
// SAVE PANEL SETTINGS
// =======================

window.savePanelSettings = function () {

const theme = document.getElementById("theme").value;
const maintenance = document.getElementById("maintenance").value;

update(settingsRef, {

theme,
maintenance

});

if (theme === "dark") {

document.body.classList.remove("light-theme");

} else {

document.body.classList.add("light-theme");

}

alert("Panel Settings Saved");

};

// =======================
// VALIDATION
// =======================

document.addEventListener("DOMContentLoaded", () => {

const currency = document.getElementById("currency");

if (currency && currency.value === "") {

currency.value = "INR";

}

});

// =======================
// CONSOLE
// =======================

console.log("✅ NovaSMM Settings Module Loaded");