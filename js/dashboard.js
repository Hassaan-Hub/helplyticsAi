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
    const result = await Swal.fire({
        title: "Logout?",
        text: "Are you sure you want to logout?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#64748b",
        confirmButtonText: "Logout",
        background: "#1e293b",
        color: "#fff",
    });

    if (!result.isConfirmed) return;

    await signOut(auth);

    window.location.href = "login.html";
});