import { initAuth, googleSignIn, signOutUser, attemptSignIn, authState, initPersist, setAuthStateHandler } from "./auth/auth.js"
import { initFirestore, getCities, addDummyData } from "./firestore/firestore.js"

import { app } from "./FirebaseInitialization.js"

document.getElementById("signOut").onclick = signOutUser

window.addEventListener("beforeunload", async function(e) {
    await beforePageUnload()
});

window.addEventListener("pagehide", async function(e) {
    await beforePageUnload()
});

async function beforePageUnload() {
    await addDummyData(authState().uid)
}

async function pageLoad(e) {
    console.log(btoa('asdf'))
}

window.addEventListener("load", async function(e) {
    await pageLoad(e)
});


document.addEventListener("build", e => {
    console.log(e)
    document.dispatchEvent(eve)
})

var eve = new Event("asdfasdf")


//add stuff to global scope by doing window.main = main(), window.pageLoad = pageLoad()