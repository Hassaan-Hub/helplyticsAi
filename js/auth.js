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

            alert("Account Created Successfully!");

            window.location.href = "onboarding.html";
        } catch (error) {
            alert(error.message);
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
            alert(error.message);
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
            alert(error.message);
        }
    });
}