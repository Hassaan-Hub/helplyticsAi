import {
    auth,
    db,
    onAuthStateChanged,
    doc,
    getDoc,
    signOut,
} from "./firebaseCode.js";

const welcome = document.getElementById("welcome");

const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();

        welcome.innerText = `Welcome ${data.name}`;
    }
});

logoutBtn.addEventListener("click", async () => {
    await signOut(auth);

    window.location.href = "login.html";
});