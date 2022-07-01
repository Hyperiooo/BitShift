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
            /*signInWithPopup(auth, provider).then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
        
                console.log("User logged in: ")
                console.log(user)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });*/
    }

}

export function signOutUser() {
    signOut(auth).then(() => {
        console.log('user signed out')
    }).catch((error) => {
        // An error happened.
    });
}

export function authState() {
    /*onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            const uid = user.uid;
            return user
        } else {
            return false
        }
    });*/
    return auth.currentUser;
}