// LOGIN
function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;

  if (u === "admin" && p === "admin123") {
    window.location.href = "main.html";
  } else {
    alert("Wrong credentials");
  }
}

// LOAD ISSUES
async function loadIssues() {
  document.getElementById("loader").classList.remove("hidden");

  const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
  const data = await res.json();

  document.getElementById("loader").classList.add("hidden");

  displayIssues(data.data);
}

// DISPLAY
function displayIssues(issues) {
  const container = document.getElementById("issues-container");
  container.innerHTML = "";

  issues.forEach(issue => {
    const div = document.createElement("div");

    const borderColor = issue.status === "open"
      ? "border-t-4 border-green-500"
      : "border-t-4 border-purple-500";

    div.className = `bg-white p-4 rounded shadow cursor-pointer ${borderColor}`;

    div.innerHTML = `
      <h4 class="font-semibold">${issue.title}</h4>
      <p class="text-sm text-gray-500">${issue.description}</p>

      <div class="flex justify-between mt-2 text-sm">
        <span class="text-blue-500">${issue.author}</span>
        <span class="text-gray-400">${issue.createdAt}</span>
      </div>

      <div class="mt-2 flex gap-2 flex-wrap text-xs">
        <span class="bg-red-100 text-red-600 px-2 rounded">${issue.priority}</span>
        <span class="bg-yellow-100 text-yellow-600 px-2 rounded">${issue.label}</span>
      </div>
    `;

    div.onclick = () => openModal(issue);

    container.appendChild(div);
  });
}

// FILTER
function filterIssues(type) {
  if (type === "all") return loadIssues();

  fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then(res => res.json())
    .then(data => {
      const filtered = data.data.filter(i => i.status === type);
      displayIssues(filtered);
    });
}

// SEARCH
function searchIssues() {
  const text = document.getElementById("search").value;

  fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`)
    .then(res => res.json())
    .then(data => displayIssues(data.data));
}

// MODAL
function openModal(issue) {
  document.getElementById("modal").classList.remove("hidden");
  document.getElementById("modal-title").innerText = issue.title;
  document.getElementById("modal-desc").innerText = issue.description;
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

// AUTO LOAD
if (window.location.pathname.includes("main.html")) {
  loadIssues();
}