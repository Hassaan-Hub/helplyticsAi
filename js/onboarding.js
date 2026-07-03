import {
    auth,
    db,
    onAuthStateChanged,
    doc,
    updateDoc,
} from "./firebaseCode.js";

const form = document.getElementById("onboardingForm");

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const skills = document.getElementById("skills").value.split(",");

        const interests = document.getElementById("interests").value.split(",");

        const location = document.getElementById("location").value;

        try {
            await updateDoc(doc(db, "users", user.uid), {
                skills,
                interests,
                location,
            });

            alert("Profile Completed!");

            window.location.href = "dashboard.html";
        } catch (error) {
            alert(error.message);
        }
    });
});