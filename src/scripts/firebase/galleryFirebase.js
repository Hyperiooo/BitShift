import {
	initAuth,
	googleSignIn,
	signOutUser,
	attemptSignIn,
	authState,
	initPersist,
	setAuthStateHandler,
} from "./auth/auth.js";
import { initFirestore, addDummyData } from "./firestore/firestore.js";

import { app } from "./FirebaseInitialization.js";

document.getElementById("signOut").onclick = signOutUser;
window.addEventListener("beforeunload", (e) => {
	//e.preventDefault()
	beforePageUnload();
	saveData();
	//e.returnValue = null
});

window.addEventListener("pagehide", (e) => {
	//e.preventDefault()
	beforePageUnload();
	saveData();
});
async function beforePageUnload() {
	console.log(window.a);
	await addDummyData(authState().uid);
}

async function pageLoad(e) {}

window.addEventListener("load", async function (e) {
	console.log("a");
	await pageLoad(e);
});

var eve = new Event("asdfasdf");

window.beforePageUnload = beforePageUnload;

//add stuff to global scope by doing window.main = main(), window.pageLoad = pageLoad()
