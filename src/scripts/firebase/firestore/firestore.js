import { getFirestore, collection, getDoc, addDoc, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore-lite.js';

var db;

export function initFirestore(app) {
    db = getFirestore(app);
}

export async function getCities() {
    try {
        const docRef = await setDoc(doc(db, "cities", "neew-city-id"), {
            first: "Ada",
            last: "Lovelace",
            born: 1815
        });
        console.log("Document written with ID: ", docRef);
    } catch (e) {
        console.error("Error adding document: ", e);
    }

}

export async function checkNewUserId(uid) {
    var docRef = doc(db, "users", uid);
    var docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data()
    }
    return false
}

export async function setupNewAccount(uid, user) {
    console.log("setting up new account")
    await setDoc(doc(db, "users", uid), {
        id: uid,
        name: user.displayName,
        email: user.email
    });
}