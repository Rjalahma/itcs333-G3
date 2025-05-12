document.addEventListener("DOMContentLoaded", () => {
  const commentsList = document.querySelector(".comments-list");
  const commentInput = document.querySelector(".comment-input");
  const addCommentForm = document.querySelector(".add-comment-form");

  // Get news_id from URL
  const params = new URLSearchParams(window.location.search);
  const newsId = params.get("id");

  // Fetch comments
  function fetchComments() {
    fetch(`https://your-replit-url/comments_api.php?news_id=${newsId}`)
      .then((res) => res.json())
      .then((data) => {
        renderComments(data);
      })
      .catch((err) => console.error("Error fetching comments:", err));
  }

  // Render comments
  function renderComments(comments) {
    commentsList.innerHTML = "";
    comments.forEach((comment) => {
      const commentElement = document.createElement("div");
      commentElement.classList.add("comment");
      commentElement.innerHTML = `
        <p>${comment.comment}</p>
        <small>${new Date(comment.created_at).toLocaleString()}</small>
      `;
      commentsList.appendChild(commentElement);
    });
  }

  // Add a new comment
  addCommentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newComment = commentInput.value.trim();

    if (newComment) {
      fetch("https://your-replit-url/comments_api.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          news_id: newsId,
          comment: newComment,
        }),
      })
        .then((res) => res.json())
        .then(() => {
          commentInput.value = "";
          fetchComments(); // Refresh comments
        })
        .catch((err) => console.error("Error adding comment:", err));
    }
  });

  // Initial fetch
  fetchComments();
});
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const newsId = params.get("id");

  const newsTitleElement = document.querySelector(".news-title");
  const newsContentElement = document.querySelector(".news-text");
  const newsImageElement = document.querySelector(".news-image");
  const deleteButton = document.getElementById("delete-news");

  // Fetch and display news details
  fetch(`https://your-replit-url/news_api.php`)
    .then((res) => res.json())
    .then((data) => {
      const newsItem = data.find((item) => item.id == newsId);
      if (newsItem) {
        newsTitleElement.textContent = newsItem.title;
        newsContentElement.innerHTML = `<p>${newsItem.content}</p>`;
        newsImageElement.src = newsItem.image;
      } else {
        newsContentElement.textContent = "News not found.";
        deleteButton.style.display = "none";
      }
    })
    .catch((err) => console.error("Error fetching news details:", err));

  // Delete news
  deleteButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this news?")) {
      fetch("https://your-replit-url/news_api.php", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `id=${newsId}`,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            alert("News deleted successfully.");
            window.location.href = "campusNews.html"; 
          } else {
            alert("Failed to delete news.");
          }
        })
        .catch((err) => console.error("Error deleting news:", err));
    }
  });
});
