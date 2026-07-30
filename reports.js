document.getElementById("users").innerText =
localStorage.getItem("totalUsers") || 0;

document.getElementById("orders").innerText =
localStorage.getItem("totalOrders") || 0;

document.getElementById("revenue").innerText =
"₹" + (localStorage.getItem("totalRevenue") || 0);

document.getElementById("pending").innerText =
localStorage.getItem("pendingOrders") || 0;