const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("."));

// Load snippets from file
function loadSnippets() {
  try {
    const data = fs.readFileSync("snippets.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Save snippets to file
function saveSnippets(snippets) {
  fs.writeFileSync("snippets.json", JSON.stringify(snippets, null, 2));
}

// Get all snippets
app.get("/api/snippets", (req, res) => {
  const snippets = loadSnippets();
  res.json(snippets);
});

// Add a new snippet
app.post("/api/snippets", (req, res) => {
  const snippets = loadSnippets();
  const newSnippet = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  snippets.push(newSnippet);
  saveSnippets(snippets);
  res.json(newSnippet);
});

// Delete a snippet
app.delete("/api/snippets/:id", (req, res) => {
  let snippets = loadSnippets();
  snippets = snippets.filter((s) => s.id !== parseInt(req.params.id));
  saveSnippets(snippets);
  res.json({ success: true });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
