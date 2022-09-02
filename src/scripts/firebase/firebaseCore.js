import {
	initAuth,
	googleSignIn,
	signOutUser,
	attemptSignIn,
	authState,
	initPersist,
	setAuthStateHandler,
} from "./auth/auth.js";
import {
	initFirestore,
	checkNewUserId,
	setupNewAccount,
} from "./firestore/firestore.js";

import { app } from "./FirebaseInitialization.js";

var isSignedIn = false;
var userObj;
var userId;

window.addEventListener("load", function () {
	console.log("onload function");
	setAuthStateHandler(authChangeHandler).then(() => {
		initAuth(app).then(() => {
			initPersist().then(() => {
				initContent();
			});
		});
	});
	initFirestore(app);
});

//document.getElementById("signOut").onclick = signOutUser

function initContent() /* calls after authChangeHandler detects if the user is logged in */ {
	console.log(userObj.email.split("@")[0].replace(".", "-"));
}

export async function authChangeHandler(signedIn, user) {
	if (signedIn) {
		console.log("signed in");
		isSignedIn = true;
		userObj = user;
		userId = user.uid;
		var userExists = await checkNewUserId(userId);
		window.closeSplash()
		console.log(userExists);
		if (!userExists) await isNewAccount();
		if (document.getElementById("accountName")) {
			document.getElementById("accountName").innerHTML = user.displayName;
		}
	} else if (!signedIn) {
		console.log("signed out");
		//window.location.href = "login";
		isSignedIn = false;
		userObj = null;
	}
}

async function isNewAccount() {
	console.log("this is a new account");
	await setupNewAccount(userId, userObj).then((e) => {
		return false;
	});
}
