// API base URL
const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api"
    : "/api";

// Load all snippets when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadSnippets();
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  document.getElementById("addBtn").addEventListener("click", addSnippet);
  document
    .getElementById("searchInput")
    .addEventListener("input", searchSnippets);
}

// Load and display all snippets
async function loadSnippets() {
  try {
    const response = await fetch(`${API_URL}/snippets`);
    const snippets = await response.json();
    displaySnippets(snippets);
  } catch (error) {
    console.error("Error loading snippets:", error);
  }
}

// Display snippets on the page
function displaySnippets(snippets) {
    console.log("Displaying snippets:", snippets);
  const snippetsList = document.getElementById("snippetsList");
  const snippetCount = document.getElementById("snippetCount");

  snippetCount.textContent = snippets.length;

  if (snippets.length === 0) {
    snippetsList.innerHTML =
      '<p style="text-align: center; color: #999; padding: 40px;">No snippets yet. Add your first one above!</p>';
    return;
  }

  snippetsList.innerHTML = snippets
    .map(
      (snippet) => `
        <div class="snippet-card">
            <div class="snippet-header">
                <div class="snippet-title">${escapeHtml(snippet.title)}</div>
                <div class="snippet-language">${escapeHtml(
                  snippet.language
                )}</div>
            </div>
            
            ${
              snippet.tags
                ? `
                <div class="snippet-tags">
                    ${snippet.tags
                      .split(",")
                      .map(
                        (tag) =>
                          `<span class="tag">${escapeHtml(tag.trim())}</span>`
                      )
                      .join("")}
                </div>
            `
                : ""
            }
            
            <div class="snippet-code">${escapeHtml(snippet.code)}</div>
            
            ${
              snippet.description
                ? `
                <div class="snippet-description">${escapeHtml(
                  snippet.description
                )}</div>
            `
                : ""
            }
            
            <div class="snippet-meta">
                Added: ${new Date(snippet.createdAt).toLocaleDateString()}
            </div>
            
            <button class="delete-btn" onclick="deleteSnippet(${
              snippet.id
            })">Delete</button>
        </div>
    `
    )
    .join("");
}

// Add a new snippet
async function addSnippet() {
  const title = document.getElementById("titleInput").value.trim();
  const language = document.getElementById("languageInput").value.trim();
  const tags = document.getElementById("tagsInput").value.trim();
  const code = document.getElementById("codeInput").value.trim();
  const description = document.getElementById("descriptionInput").value.trim();

  // Validation
  if (!title || !language || !code) {
    alert("Please fill in Title, Language, and Code fields!");
    return;
  }

  const snippet = {
    title,
    language,
    tags,
    code,
    description,
  };

  try {
    const response = await fetch(`${API_URL}/snippets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(snippet),
    });

    if (response.ok) {
      // Clear form
      document.getElementById("titleInput").value = "";
      document.getElementById("languageInput").value = "";
      document.getElementById("tagsInput").value = "";
      document.getElementById("codeInput").value = "";
      document.getElementById("descriptionInput").value = "";

      // Reload snippets
      loadSnippets();
    }
  } catch (error) {
    console.error("Error adding snippet:", error);
    alert("Error adding snippet. Please try again.");
  }
}

// Delete a snippet
async function deleteSnippet(id) {
  if (!confirm("Are you sure you want to delete this snippet?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/snippets/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      loadSnippets();
    }
  } catch (error) {
    console.error("Error deleting snippet:", error);
    alert("Error deleting snippet. Please try again.");
  }
}

// Search snippets
function searchSnippets() {
    console.log("Search triggered!");
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
   console.log("Searching for:", searchTerm);

  fetch(`${API_URL}/snippets`)
    .then((response) => response.json())
    .then((snippets) => {
      const filtered = snippets.filter(snippet => {
    return snippet.title.toLowerCase().includes(searchTerm) ||
           snippet.language.toLowerCase().includes(searchTerm) ||
           (snippet.tags && snippet.tags.toLowerCase().includes(searchTerm)) ||
           snippet.code.toLowerCase().includes(searchTerm) ||
           (snippet.description && snippet.description.toLowerCase().includes(searchTerm));
});
console.log("Filtered results:", filtered);
displaySnippets(filtered);
})
}
// Helper function to escape HTML and prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
