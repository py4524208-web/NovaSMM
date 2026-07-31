import { db } from "./firebase.js";

import {
ref,
get,
update,
push,
set,
runTransaction
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

// =======================
// WALLET ENGINE
// =======================

window.WalletEngine = {};

// =======================
// GET BALANCE
// =======================

WalletEngine.getBalance = async function(uid){

const snap = await get(ref(db,"customers/"+uid+"/wallet"));

if(!snap.exists()) return 0;

return Number(snap.val());

};

// =======================
// CHECK BALANCE
// =======================

WalletEngine.hasBalance = async function(uid,amount){

const balance = await this.getBalance(uid);

return balance >= Number(amount);

};

console.log("Wallet Engine Part 1 Loaded");
// =======================
// DEDUCT BALANCE
// =======================

WalletEngine.deductBalance = async function(uid, amount, reason = "Order") {

amount = Number(amount);

const walletRef = ref(db, "customers/" + uid + "/wallet");

const result = await runTransaction(walletRef, (balance) => {

balance = Number(balance || 0);

if (balance < amount) {

return;

}

return balance - amount;

});

if (!result.committed) {

return false;

}

// Save Transaction
const txnRef = push(ref(db, "wallet_transactions/" + uid));

await set(txnRef, {

type: "Debit",
amount: amount,
reason: reason,
status: "Success",
createdAt: new Date().toLocaleString()

});

return true;

};

// =======================
// ADD BALANCE
// =======================

WalletEngine.addBalance = async function(uid, amount, reason = "Deposit") {

amount = Number(amount);

const walletRef = ref(db, "customers/" + uid + "/wallet");

await runTransaction(walletRef, (balance) => {

balance = Number(balance || 0);

return balance + amount;

});

// Save Transaction
const txnRef = push(ref(db, "wallet_transactions/" + uid));

await set(txnRef, {

type: "Credit",
amount: amount,
reason: reason,
status: "Success",
createdAt: new Date().toLocaleString()

});

return true;

};

console.log("Wallet Engine Part 2 Loaded");
// =======================
// WALLET HISTORY
// =======================

WalletEngine.getTransactions = async function(uid){

const snap = await get(ref(db,"wallet_transactions/"+uid));

if(!snap.exists()) return [];

const list=[];

snap.forEach((child)=>{

list.unshift({

id:child.key,

...child.val()

});

});

return list;

};

// =======================
// LIVE BALANCE
// =======================

WalletEngine.liveBalance=function(uid,callback){

import("https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js")
.then(({onValue})=>{

onValue(ref(db,"customers/"+uid+"/wallet"),(snap)=>{

callback(Number(snap.val()||0));

});

});

};

// =======================
// TRANSFER
// =======================

WalletEngine.transfer=async function(fromUid,toUid,amount){

amount=Number(amount);

const ok=await this.deductBalance(fromUid,amount,"Transfer");

if(!ok) return false;

await this.addBalance(toUid,amount,"Received");

return true;

};

console.log("Wallet Engine Ready");