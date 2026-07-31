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