import {
    auth,
    db,
    onAuthStateChanged,
    doc,
    getDoc,
} from "./firebaseCode.js";

const name =
    document.getElementById("name");

const email =
    document.getElementById("email");

const role =
    document.getElementById("role");

const skills =
    document.getElementById("skills");

const interests =
    document.getElementById("interests");

const location =
    document.getElementById("location");

const trustScore =
    document.getElementById("trustScore");

const badge =
    document.getElementById("badge");

const avatar =
    document.getElementById("avatar");

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const docRef =
        doc(db, "users", user.uid);

    const docSnap =
        await getDoc(docRef);

    if (!docSnap.exists()) return;

    const data = docSnap.data();

    name.innerText = data.name;
    email.innerText = data.email;
    role.innerText = data.role;

    location.innerText =
        data.location || "Not Added";

    trustScore.innerText =
        `${data.trustScore} Points`;

    badge.innerText =
        `Badge: ${data.badge}`;

    avatar.innerText =
        data.name.charAt(0).toUpperCase();

    skills.innerHTML = "";
    interests.innerHTML = "";

    data.skills.forEach((skill) => {
        skills.innerHTML += `
      <span
        class="bg-blue-600 px-3 py-2 rounded-lg mr-2 inline-block mb-2"
      >
        ${skill}
      </span>
    `;
    });

    data.interests.forEach((interest) => {
        interests.innerHTML += `
      <span
        class="bg-purple-600 px-3 py-2 rounded-lg mr-2 inline-block mb-2"
      >
        ${interest}
      </span>
    `;
    });
});