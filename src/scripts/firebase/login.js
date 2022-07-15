import { initAuth, attemptSignIn, signOutUser, initPersist, setAuthStateHandler, googleSignIn } from "./auth/auth.js"
import { initFirestore, getCities, checkNewUserId, setupNewAccount } from "./firestore/firestore.js"

import { app } from "./FirebaseInitialization.js"


var isSignedIn = false
var userObj;
var userId;

window.onload = function() {
    setAuthStateHandler(authChangeHandler).then(() => {
        initAuth(app).then(() => {
            initPersist().then(() => {
                initContent()
            })
        })
    })
    initFirestore(app)
    getCities()
}

document.getElementById("signIn").onclick = attemptSignIn


function initContent() {}

export async function authChangeHandler(signedIn, user) {
    if (signedIn) {
        console.log("signed in")
        isSignedIn = true
        userObj = user
        userId = user.uid
        var userExists = await checkNewUserId(userId)
        console.log(userExists)
        if (!userExists) isNewAccount();
        //window.location.href = "./"

    } else if (!signedIn) {
        console.log("signed out")
        isSignedIn = false
        userObj = null
    }
}

function isNewAccount() {
    console.log("this is a new account")
    setupNewAccount(userId, userObj)
}