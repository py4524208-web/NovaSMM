import { db } from "./firebase.js";

import {
ref,
get,
set,
push,
update,
onValue
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

// =======================
// PROVIDER ENGINE
// =======================

window.ProviderEngine = {

providers: [],

async loadProviders(){

const snap = await get(ref(db,"provider_api"));

this.providers=[];

if(!snap.exists()) return;

snap.forEach((child)=>{

this.providers.push({

id:child.key,

...child.val()

});

});

console.log("Providers Loaded :",this.providers.length);

},

getAll(){

return this.providers;

}

};

console.log("Provider Engine Part 1 Loaded");
// =======================
// API REQUEST
// =======================

ProviderEngine.request = async function(provider, action, params = {}) {

try {

const body = new URLSearchParams();

body.append("key", provider.key);
body.append("action", action);

for (const k in params) {
body.append(k, params[k]);
}

const response = await fetch(provider.url, {
method: "POST",
headers: {
"Content-Type": "application/x-www-form-urlencoded"
},
body
});

const data = await response.json();

return data;

} catch (e) {

console.error("Provider API Error", e);

return null;

}

};

// =======================
// TEST CONNECTION
// =======================

ProviderEngine.testProvider = async function(providerId){

const provider = this.providers.find(p => p.id === providerId);

if(!provider) return false;

const result = await this.request(provider,"balance");

if(result && result.balance !== undefined){

console.log("Connected :", provider.name);

return true;

}

return false;

};

// =======================
// GET PROVIDER BALANCE
// =======================

ProviderEngine.getBalance = async function(providerId){

const provider = this.providers.find(p => p.id === providerId);

if(!provider) return null;

const result = await this.request(provider,"balance");

if(result && result.balance !== undefined){

await update(ref(db,"provider_api/"+provider.id),{

balance:result.balance,
status:"Connected"

});

return result.balance;

}

return null;

};

console.log("Provider Engine Part 2 Loaded");