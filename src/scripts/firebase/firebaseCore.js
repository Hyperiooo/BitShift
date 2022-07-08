import { initAuth, googleSignIn, signOutUser, attemptSignIn, authState, initPersist, setAuthStateHandler } from "./auth/auth.js"
import { initFirestore, getCities } from "./firestore/firestore.js"

import { app } from "./FirebaseInitialization.js"


var isSignedIn = false
var userObj;

window.addEventListener("load", function() {
    setAuthStateHandler(authChangeHandler).then(() => {
        initAuth(app).then(() => {
            initPersist().then(() => {
                initContent()
            })
        })
    })
    initFirestore(app)
    getCities()
})


//document.getElementById("signOut").onclick = signOutUser


function initContent() /* calls after authChangeHandler detects if the user is logged in */ {
    console.log(userObj.email.split("@")[0].replace(".", "-"))
}

export function authChangeHandler(signedIn, user) {
    console.log('a')
    if (signedIn) {
        console.log("signed in")
        isSignedIn = true
        userObj = user
        console.log(user)
        console.log(window.location)
        if (document.getElementById("accountName")) {
            document.getElementById("accountName").innerHTML = user.displayName
        }
    } else if (!signedIn) {
        console.log("signed out")
            //window.location.href = "login"
        isSignedIn = false
        userObj = null
    }
}