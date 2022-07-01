import { initAuth, googleSignIn, signOutUser, attemptSignIn, authState, initPersist, setAuthStateHandler } from "./auth/auth.js"
import { initFirestore, getCities } from "./firestore/firestore.js"

import { app } from "./FirebaseInitialization.js"

document.getElementById("signOut").onclick = signOutUser