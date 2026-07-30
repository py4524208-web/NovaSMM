let payments = [];

window.addPayment = function () {

const user = document.getElementById("payUser").value;
const amount = document.getElementById("payAmount").value;
const method = document.getElementById("payMethod").value;

if (!user || !amount) {
alert("Enter all details");
return;
}

payments.push({
user,
amount,
method
});

renderPayments();

document.getElementById("payUser").value = "";
document.getElementById("payAmount").value = "";

};

function renderPayments() {

const table = document.getElementById("paymentTable");

table.innerHTML = `
<tr>
<th>User</th>
<th>Amount</th>
<th>Method</th>
<th>Action</th>
</tr>
`;

payments.forEach((p, i) => {

table.innerHTML += `
<tr>
<td>${p.user}</td>
<td>₹${p.amount}</td>
<td>${p.method}</td>
<td>
<button onclick="deletePayment(${i})">🗑 Delete</button>
</td>
</tr>
`;

});

}

window.deletePayment = function (i) {

payments.splice(i, 1);

renderPayments();

};