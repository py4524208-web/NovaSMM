import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  ref,
  push,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

let currentUser = null;

// =======================
// LOGIN CHECK
// =======================

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.replace("customer-login.html");
    return;
  }

  currentUser = user;

  loadTickets();

});

// =======================
// SEND TICKET
// =======================

const sendBtn = document.getElementById("sendTicketBtn");

if (sendBtn) {

  sendBtn.onclick = async () => {

    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();
    const msg = document.getElementById("msg");

    msg.innerHTML = "";

    if (!subject || !message) {

      msg.innerHTML = "Please fill all fields.";

      return;

    }

    const ticketRef = push(ref(db, "tickets/" + currentUser.uid));

    await set(ticketRef, {

      subject,
      message,
      status: "Open",
      createdAt: new Date().toLocaleString()

    });

    document.getElementById("subject").value = "";
    document.getElementById("message").value = "";

    msg.innerHTML = "✅ Ticket Submitted";

  };

}

// =======================
// LOAD TICKETS
// =======================

function loadTickets() {

  const table = document.getElementById("ticketTable");

  onValue(ref(db, "tickets/" + currentUser.uid), (snapshot) => {

    table.innerHTML = `
<tr>
<th>Subject</th>
<th>Message</th>
<th>Status</th>
<th>Date</th>
</tr>
`;

    if (snapshot.exists()) {

      snapshot.forEach((child) => {

        const t = child.val();

        table.innerHTML += `
<tr>
<td>${t.subject}</td>
<td>${t.message}</td>
<td>${t.status}</td>
<td>${t.createdAt}</td>
</tr>
`;

      });

    }

  });

}

// =======================
// LOGOUT
// =======================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

  logoutBtn.onclick = async () => {

    await signOut(auth);

    window.location.replace("customer-login.html");

  };

}

console.log("Customer Tickets Ready");