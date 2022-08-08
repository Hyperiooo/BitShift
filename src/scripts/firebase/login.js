import {
	initAuth,
	attemptSignIn,
	attemptGoogleSignIn,
	signOutUser,
	initPersist,
	setAuthStateHandler,
	googleSignIn,
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

window.onload = function () {
	setAuthStateHandler(authChangeHandler).then(() => {
		initAuth(app).then(() => {
			initPersist().then(() => {
				initContent();
			});
		});
	});
	initFirestore(app);
};

//document.getElementById("signIn").onclick = attemptSignIn;
//document.getElementById("google-login").onclick = attemptGoogleSignIn;

window.addEventListener("attempt-google-login", (e) => {
	attemptGoogleSignIn();
});

function initContent() {}

export async function authChangeHandler(signedIn, user) {
	if (signedIn) {
		console.log("signed in");
		isSignedIn = true;
		userObj = user;
		userId = user.uid;
		window.location.href = "./";
	} else if (!signedIn) {
		console.log("signed out");
		isSignedIn = false;
		userObj = null;
	}
}
