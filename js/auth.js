import {
    auth,
    db,
    provider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    doc,
    setDoc,
    serverTimestamp,
} from "./firebaseCode.js";

// ---------------- SIGNUP ----------------

const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;

        try {
            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name,
                email,
                role,
                skills: [],
                interests: [],
                location: "",
                trustScore: 0,
                badge: "Beginner",
                createdAt: serverTimestamp(),
            });

            await Swal.fire({ icon: "success", title: "Success!", text: "Account Created Successfully!", background: "#1e293b", color: "#fff", confirmButtonColor: "#2563eb" });

            window.location.href = "onboarding.html";
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error!", text: error.message, background: "#1e293b", color: "#fff", confirmButtonColor: "#2563eb" });
        }
    });
}

// ---------------- LOGIN ----------------

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email =
            document.getElementById("loginEmail").value;

        const password =
            document.getElementById("loginPassword").value;

        try {
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            window.location.href = "dashboard.html";
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error!", text: error.message, background: "#1e293b", color: "#fff", confirmButtonColor: "#2563eb" });
        }
    });
}

// ---------------- GOOGLE LOGIN ----------------

const googleBtn = document.getElementById("googleBtn");

if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
        try {
            const result = await signInWithPopup(
                auth,
                provider
            );

            const user = result.user;

            await setDoc(
                doc(db, "users", user.uid),
                {
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email,
                    role: "Both",
                    skills: [],
                    interests: [],
                    location: "",
                    trustScore: 0,
                    badge: "Beginner",
                    createdAt: serverTimestamp(),
                },
                { merge: true }
            );

            window.location.href = "dashboard.html";
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error!", text: error.message, background: "#1e293b", color: "#fff", confirmButtonColor: "#2563eb" });
        }
    });
}