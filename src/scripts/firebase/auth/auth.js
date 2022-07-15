import { getAuth, getRedirectResult, signInWithRedirect, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, browserLocalPersistence, setPersistence } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-auth.js";
//import * as app from "../main.js"

//import { authChangeHandler } from "../main.js"

const provider = new GoogleAuthProvider();
var auth;

var authChangeHandler = function() {
    return false
}

export async function setAuthStateHandler(handler) {
    authChangeHandler = handler;
}

export async function initAuth(app) {
    async function authObjSet() {
        auth = await getAuth(app)
    }
    authObjSet().then(() => {
        onAuthStateChanged(auth, (user) => {
            authChangeHandler(!!user, user)
        });
    })
    provider.setCustomParameters({
        prompt: 'select_account',
    });
}

export async function attemptSignIn() {
    await setPersistence(auth, browserLocalPersistence)
        .then(() => {
            return googleSignIn()
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
        });
}

export async function initPersist() {
    await setPersistence(auth, browserLocalPersistence)
        .then(() => {
            return false
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
        });
}

export async function googleSignIn() {
    if (authState()) {
        console.log(authState())
    } else {
        signInWithRedirect(auth, provider)
    }

}

export function signOutUser() {
    signOut(auth).then(() => {
        console.log('user signed out')
    }).catch((error) => {});
}

export function authState() {
    return auth.currentUser;
}