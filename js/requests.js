import {
    auth,
    db,
    onAuthStateChanged,
    addDoc,
    collection,
    serverTimestamp,
} from "./firebaseCode.js";

const form = document.getElementById("requestForm");
const description =
    document.getElementById("description");

const categoryText =
    document.getElementById("categoryText");

const tagText =
    document.getElementById("tagText");

let category = "";

// AI Category + Tags
description.addEventListener("input", () => {
    const text =
        description.value.toLowerCase();

    let tags = [];

    if (
        text.includes("html") ||
        text.includes("css") ||
        text.includes("javascript") ||
        text.includes("firebase")
    ) {
        category = "Programming";

        tags = [
            "#html",
            "#css",
            "#javascript",
            "#firebase",
        ];
    } else if (
        text.includes("design")
    ) {
        category = "Design";

        tags = ["#figma", "#uiux"];
    } else {
        category = "General";

        tags = ["#help"];
    }

    categoryText.innerText =
        `Category: ${category}`;

    tagText.innerText =
        `Suggested Tags: ${tags.join(" ")}`;
});

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title =
            document.getElementById("title").value;

        const desc =
            document.getElementById("description").value;

        const tags = document
            .getElementById("tags")
            .value.split(",");

        const urgency =
            document.getElementById("urgency").value;

        try {
            await addDoc(
                collection(db, "requests"),
                {
                    title,
                    description: desc,
                    tags,
                    category,
                    urgency,
                    status: "pending",
                    createdBy: user.uid,
                    helpers: [],
                    createdAt: serverTimestamp(),
                }
            );

            alert("Request Published!");

            window.location.href =
                "dashboard.html";
        } catch (error) {
            alert(error.message);
        }
    });
});