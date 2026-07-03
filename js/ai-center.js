import {
  auth,
  db,
  onAuthStateChanged,
  collection,
  getDocs,
} from "./firebaseCode.js";

const trendingSkills =
  document.getElementById("trendingSkills");

const topCategories =
  document.getElementById("topCategories");

const urgencyStats =
  document.getElementById("urgencyStats");

const growthText =
  document.getElementById("growthText");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  await loadAIData();
});

// MAIN AI ENGINE (simple logic)
async function loadAIData() {

  const usersSnap =
    await getDocs(collection(db, "users"));

  const reqSnap =
    await getDocs(collection(db, "requests"));

  let skillCount = {};
  let categoryCount = {};
  let urgencyCount = {
    High: 0,
    Medium: 0,
    Low: 0
  };

  let totalRequests = 0;

  // USERS → Skills analysis
  usersSnap.forEach((doc) => {
    const user = doc.data();

    if (user.skills) {
      user.skills.forEach((s) => {
        skillCount[s] =
          (skillCount[s] || 0) + 1;
      });
    }
  });

  // REQUESTS → Category + urgency
  reqSnap.forEach((doc) => {
    const req = doc.data();

    totalRequests++;

    categoryCount[req.category] =
      (categoryCount[req.category] || 0) + 1;

    urgencyCount[req.urgency] =
      (urgencyCount[req.urgency] || 0) + 1;
  });

  // RENDER SKILLS
  trendingSkills.innerHTML =
    Object.entries(skillCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(
        (s) =>
          `<li>⭐ ${s[0]} (${s[1]})</li>`
      )
      .join("");

  // RENDER CATEGORIES
  topCategories.innerHTML =
    Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .map(
        (c) =>
          `<li>📌 ${c[0]} (${c[1]})</li>`
      )
      .join("");

  // RENDER URGENCY
  urgencyStats.innerHTML = `
    <li>🔴 High: ${urgencyCount.High}</li>
    <li>🟡 Medium: ${urgencyCount.Medium}</li>
    <li>🟢 Low: ${urgencyCount.Low}</li>
  `;

  // SIMPLE AI INSIGHT
  growthText.innerText = `
    Total Requests: ${totalRequests}
    | Active Users: ${usersSnap.size}
    | System Status: Healthy 🚀
  `;
}