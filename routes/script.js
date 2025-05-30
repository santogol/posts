const API_URL = "http://localhost:8800/api/posts";

document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const userId = document.getElementById("userId").value;
  const desc = document.getElementById("desc").value;
  const image = document.getElementById("image").value;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, desc, image }),
  });

  if (res.ok) {
    document.getElementById("postForm").reset();
    loadPosts();
  }
});

async function loadPosts() {
  const container = document.getElementById("postsContainer");
  container.innerHTML = "<p>Caricamento...</p>";

  const res = await fetch(`${API_URL}/timeline/all`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: "123" }), // opzionale, se necessario
  });

  const posts = await res.json();
  container.innerHTML = "";

  posts.forEach((post) => {
    const postEl = document.createElement("div");
    postEl.className = "post";

    postEl.innerHTML = `
      <p><strong>Utente:</strong> ${post.userId}</p>
      <p>${post.desc}</p>
      ${post.image ? `<img src="${post.image}" />` : ""}
      <p><strong>Likes:</strong> ${post.likes.length}</p>

      <div class="actions">
        <button onclick="likePost('${post._id}', '${post.userId}')">❤️ Like</button>
        <button onclick="deletePost('${post._id}', '${post.userId}')">🗑️ Cancella</button>
      </div>

      <div class="comment-section">
        <input placeholder="Scrivi un commento..." id="comment-${post._id}" />
        <button onclick="addComment('${post._id}', '${post.userId}')">Invia</button>
        <div>${post.comments.map(c => `<p class="comment"><strong>${c.userId}</strong>: ${c.text}</p>`).join("")}</div>
      </div>
    `;
    container.appendChild(postEl);
  });
}

async function likePost(postId, userId) {
  await fetch(`${API_URL}/${postId}/like`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  loadPosts();
}

async function deletePost(postId, userId) {
  await fetch(`${API_URL}/${postId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  loadPosts();
}

async function addComment(postId, userId) {
  const input = document.getElementById(`comment-${postId}`);
  const text = input.value;
  if (!text.trim()) return;

  await fetch(`${API_URL}/${postId}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, text }),
  });

  input.value = "";
  loadPosts();
}

loadPosts();
