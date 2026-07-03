import {
  auth,
  db,
  onAuthStateChanged,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "./firebaseCode.js";

const totalUsers =
  document.getElementById("totalUsers");

const totalRequests =
  document.getElementById("totalRequests");

const activeHelpers =
  document.getElementById("activeHelpers");

const usersTable =
  document.getElementById("usersTable");

const requestsTable =
  document.getElementById("requestsTable");

let currentUser = null;

// AUTH CHECK
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = user;

  await loadAdminData();
});

// LOAD ALL DATA
async function loadAdminData() {

  const usersSnap =
    await getDocs(collection(db, "users"));

  const reqSnap =
    await getDocs(collection(db, "requests"));

  let helperCount = 0;

  // USERS
  usersTable.innerHTML = "";

  usersSnap.forEach((docSnap) => {
    const u = docSnap.data();

    usersTable.innerHTML += `
      <div class="bg-slate-900 p-4 rounded-lg flex justify-between items-center">
        <div>
          <h3 class="font-bold">${u.name}</h3>
          <p class="text-slate-400">${u.email}</p>
        </div>

        <button onclick="deleteUser('${docSnap.id}')"
          class="bg-red-600 px-3 py-1 rounded">
          Delete
        </button>
      </div>
    `;
  });

  // REQUESTS
  requestsTable.innerHTML = "";

  reqSnap.forEach((docSnap) => {
    const r = docSnap.data();

    if (r.helpers) {
      helperCount += r.helpers.length;
    }

    requestsTable.innerHTML += `
      <div class="bg-slate-900 p-4 rounded-lg flex justify-between items-center">
        <div>
          <h3 class="font-bold">${r.title}</h3>
          <p class="text-slate-400">${r.category}</p>
        </div>

        <button onclick="deleteRequest('${docSnap.id}')"
          class="bg-red-600 px-3 py-1 rounded">
          Delete
        </button>
      </div>
    `;
  });

  // STATS
  totalUsers.innerText = usersSnap.size;
  totalRequests.innerText = reqSnap.size;
  activeHelpers.innerText = helperCount;
}

// DELETE USER
window.deleteUser = async (id) => {
  await deleteDoc(doc(db, "users", id));
  alert("User deleted");
  loadAdminData();
};

// DELETE REQUEST
window.deleteRequest = async (id) => {
  await deleteDoc(doc(db, "requests", id));
  alert("Request deleted");
  loadAdminData();
};