import {
  auth,
  db,
  onAuthStateChanged,
  collection,
  getDocs,
} from "./firebaseCode.js";

const container =
  document.getElementById("leaderboard");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const snapshot =
    await getDocs(collection(db, "users"));

  let users = [];

  snapshot.forEach((doc) => {
    users.push(doc.data());
  });

  // Sort by trustScore
  users.sort(
    (a, b) =>
      b.trustScore - a.trustScore
  );

  render(users);
});

function render(users) {
  container.innerHTML = "";

  users.forEach((user, index) => {
    let rankIcon = "🥉";

    if (index === 0) rankIcon = "🥇";
    if (index === 1) rankIcon = "🥈";
    if (index === 2) rankIcon = "🥉";

    container.innerHTML += `
      <div class="bg-slate-900 p-5 rounded-xl flex justify-between items-center">

        <div class="flex items-center gap-4">

          <div class="text-2xl">
            ${rankIcon}
          </div>

          <div>
            <h2 class="text-xl font-bold">
              ${user.name}
            </h2>

            <p class="text-slate-400">
              ${user.role}
            </p>
          </div>

        </div>

        <div class="text-right">
          <p class="text-xl font-bold text-blue-400">
            ${user.trustScore} pts
          </p>

          <p class="text-slate-400">
            ${user.badge}
          </p>
        </div>

      </div>
    `;
  });
}