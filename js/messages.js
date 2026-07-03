import {
  auth,
  db,
  onAuthStateChanged,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  serverTimestamp,
  updateDoc,
  doc,
  setDoc,
} from "./firebaseCode.js";

let currentUser = null;
let selectedUser = null;

const usersList = document.getElementById("usersList");
const chatBox = document.getElementById("chatBox");
const chatWith = document.getElementById("chatWith");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const typingIndicator = document.getElementById("typingIndicator");

let unsubscribeMessages = null;

// AUTH
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = user;
  loadUsers();
});

// USERS LIST
async function loadUsers() {
  const snap = await getDocs(collection(db, "users"));

  usersList.innerHTML = "";

  snap.forEach((docSnap) => {
    const user = docSnap.data();

    if (user.uid === currentUser.uid) return;

    usersList.innerHTML += `
      <div onclick="selectUser('${user.uid}', '${user.name}')"
        class="p-3 bg-slate-800 rounded-lg mb-2 cursor-pointer hover:bg-slate-700">
        ${user.name}
      </div>
    `;
  });
}

// SELECT USER
window.selectUser = function (uid, name) {
  selectedUser = uid;
  chatWith.innerText = "Chat with " + name;

  onSnapshot(doc(db, "typing", `${selectedUser}_${currentUser.uid}`),
    (snap) => {
      if (snap.exists() && snap.data().isTyping) {
        typingIndicator.innerText =
          "Typing...";
      } else {
        typingIndicator.innerText = "";
      }
    }
  );

  loadMessagesRealTime();
};

// REAL-TIME MESSAGES
function loadMessagesRealTime() {
  if (unsubscribeMessages) {
    unsubscribeMessages();
  }

  const q = query(
    collection(db, "messages"),
    orderBy("createdAt")
  );

  unsubscribeMessages = onSnapshot(q, (snapshot) => {
    chatBox.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const msg = docSnap.data();

      if (msg.receiverId === currentUser.uid && !msg.seen) {
        updateDoc(doc(db, "messages", docSnap.id), {
          seen: true,
        });
      }

      if (
        (msg.senderId === currentUser.uid &&
          msg.receiverId === selectedUser) ||
        (msg.senderId === selectedUser &&
          msg.receiverId === currentUser.uid)
      ) {
        chatBox.innerHTML += `<div class="p-2 flex justify-between rounded-lg 
        ${msg.senderId === currentUser.uid ? "bg-blue-600 ml-auto text-right" : "bg-slate-800"} 
        max-w-sm min-w-[160px]">
        ${msg.text}

        <div class="flex gap-2 text-xs mt-1 opacity-70">
        ${msg.createdAt
            ? new Date(
              msg.createdAt.seconds * 1000
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
            : ""
          }
          ${msg.senderId === currentUser.uid
                  ? `<div class="text-xs mt-1">
                  ${msg.seen ? "✓✓" : "✓"}
                </div>`
                  : ""
                }
        </div>

  </div>
`;
      }
    });

    // auto scroll bottom
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}

// SEND MESSAGE
sendBtn.addEventListener("click", async () => {
  if (!selectedUser) return alert("Select a user first");
  if (!msgInput.value.trim()) return;

  await addDoc(collection(db, "messages"), {
    senderId: currentUser.uid,
    receiverId: selectedUser,
    text: msgInput.value,
    createdAt: serverTimestamp(),
    delivered: true,
    seen: false,
  });

  msgInput.value = "";

  await setDoc(doc(db, "typing", `${currentUser.uid}_${selectedUser}`), {
    senderId: currentUser.uid,
    receiverId: selectedUser,
    isTyping: false,
  }
  );
});



msgInput.addEventListener("input", async () => {
  if (!selectedUser) return;

  await setDoc(doc(db, "typing", `${currentUser.uid}_${selectedUser}`), {
    senderId: currentUser.uid,
    receiverId: selectedUser,
    isTyping: msgInput.value.length > 0,
  }
  );
}
);


msgInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});