import {
    auth,
    db,
    onAuthStateChanged,
    collection,
    getDocs,
} from "./firebaseCode.js";

const container = document.getElementById("requestsContainer");

const categoryFilter = document.getElementById("categoryFilter");

const urgencyFilter = document.getElementById("urgencyFilter");

let allRequests = [];

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    await loadRequests();
});

async function loadRequests() {
    const snapshot = await getDocs(
        collection(db, "requests")
    );

    allRequests = [];

    snapshot.forEach((doc) => {
        allRequests.push({
            id: doc.id,
            ...doc.data(),
        });
    });

    renderRequests(allRequests);
}

function renderRequests(data) {
    container.innerHTML = "";

    if (data.length === 0) {
        container.innerHTML = `
      <h2>No Requests Found</h2>
    `;
        return;
    }

    data.forEach((item) => {
        container.innerHTML += `
      <div class="bg-slate-900 p-6 rounded-xl">

        <h2 class="text-xl font-bold mb-3">
          ${item.title}
        </h2>

        <p class="text-slate-400 mb-4">
          ${item.description.slice(0, 100)}
        </p>

        <div class="space-y-2 mb-4">
          <p>📁 ${item.category}</p>
          <p>⚡ ${item.urgency}</p>
          <p>✅ ${item.status}</p>
        </div>

        <a
          href="request-detail.html?id=${item.id}"
          class="bg-blue-600 px-4 py-2 rounded-lg inline-block"
        >
          View Details
        </a>

      </div>
    `;
    });
}

categoryFilter.addEventListener(
    "change",
    applyFilters
);

urgencyFilter.addEventListener(
    "change",
    applyFilters
);

function applyFilters() {
    let filtered = allRequests;

    const category =
        categoryFilter.value;

    const urgency =
        urgencyFilter.value;

    if (category !== "All") {
        filtered = filtered.filter(
            (item) =>
                item.category === category
        );
    }

    if (urgency !== "All") {
        filtered = filtered.filter(
            (item) =>
                item.urgency === urgency
        );
    }

    renderRequests(filtered);
}