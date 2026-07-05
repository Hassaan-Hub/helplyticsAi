import {
    auth,
    db,
    onAuthStateChanged,
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    addDoc,
    collection,
    serverTimestamp,
} from "./firebaseCode.js";

const params = new URLSearchParams(window.location.search);
const requestId = params.get("id");
const title = document.getElementById("title");
const description = document.getElementById("description");
const category = document.getElementById("category");
const urgency = document.getElementById("urgency");
const status = document.getElementById("status");
const helpersList = document.getElementById("helpersList");
const helpBtn = document.getElementById("helpBtn");
const solveBtn = document.getElementById("solveBtn");

let currentUser;
let requestData;

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

    await loadRequest();
});

async function loadRequest() {
    const docRef = doc(db, "requests", requestId);

    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return;
    }

    requestData = docSnap.data();

    title.innerText =
        requestData.title;

    description.innerText =
        requestData.description;

    category.innerText =
        `Category: ${requestData.category}`;

    urgency.innerText =
        `Urgency: ${requestData.urgency}`;

    status.innerText =
        `Status: ${requestData.status}`;

    helpersList.innerHTML = "";

    requestData.helpers.forEach((helper) => {
        helpersList.innerHTML += `
      <li>${helper}</li>
    `;
    });
}

helpBtn.addEventListener(
    "click",
    async () => {
        await updateDoc(
            doc(db, "requests", requestId),
            {
                helpers: arrayUnion(
                    currentUser.email
                ),
            }
        );

        await addDoc(
            collection(db, "notifications"),
            {
                userId:
                    requestData.createdBy,
                message:
                    `${currentUser.email} wants to help you.`,
                read: false,
                createdAt:
                    serverTimestamp(),
            }
        );

        await Swal.fire({ icon: "success", title: "Success!", text: "You are now a helper!", background: "#1e293b", color: "#fff", confirmButtonColor: "#2563eb" });

        loadRequest();
    }
);

solveBtn.addEventListener(
    "click",
    async () => {
        await updateDoc(
            doc(db, "requests", requestId),
            {
                status: "Solved",
            }
        );

        await Swal.fire({ icon: "success", title: "Success!", text: "Request Solved!", background: "#1e293b", color: "#fff", confirmButtonColor: "#2563eb" });

        loadRequest();
    }
);