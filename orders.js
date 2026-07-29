import { db } from "./firebase.js";

import {
  ref,
  push,
  set,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const ordersRef = ref(db, "orders");

window.addOrder = function () {

    const user = prompt("Customer Name");
    if (!user) return;

    const service = prompt("Service Name");
    if (!service) return;

    const quantity = prompt("Quantity");
    if (!quantity) return;

    const price = prompt("Price");
    if (!price) return;

    const newRef = push(ordersRef);

    set(newRef, {
        orderId: newRef.key,
        user,
        service,
        quantity,
        price,
        status: "Pending"
    });

};

onValue(ordersRef, (snapshot) => {

    const tbody = document.querySelector("#ordersTable tbody");
    tbody.innerHTML = "";

    snapshot.forEach((item) => {

        const order = item.val();

        tbody.innerHTML += `
        <tr>
            <td>${order.orderId}</td>
            <td>${order.user}</td>
            <td>${order.service}</td>
            <td>${order.quantity}</td>
            <td>${order.price}</td>
            <td>${order.status}</td>
            <td>
                <button onclick="deleteOrder('${order.orderId}')">Delete</button>
            </td>
        </tr>
        `;

    });

});

window.deleteOrder = function(id) {

    remove(ref(db, "orders/" + id));

};