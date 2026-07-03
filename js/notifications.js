import {
    auth,
    db,
    onAuthStateChanged,
    collection,
    getDocs,
} from "./firebaseCode.js";

const container =
    document.getElementById(
        "notificationContainer"
    );

onAuthStateChanged(
    auth,
    async (user) => {
        if (!user) {
            window.location.href =
                "login.html";
            return;
        }

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "notifications"
                )
            );

        container.innerHTML = "";

        snapshot.forEach((doc) => {
            const data = doc.data();

            if (data.userId === user.uid) {
                container.innerHTML += `
          <div
            class="bg-slate-900 p-5 rounded-xl"
          >
            <p>${data.message}</p>
          </div>
        `;
            }
        });
    }
);