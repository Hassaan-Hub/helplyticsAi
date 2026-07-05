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

            await Swal.fire({ icon: "success", title: "Success!", text: "Profile Completed!", background: "#1e293b", color: "#fff", confirmButtonColor: "#2563eb" });

            window.location.href = "dashboard.html";
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error!", text: error.message, background: "#1e293b", color: "#fff", confirmButtonColor: "#2563eb" });
        }
    });
});