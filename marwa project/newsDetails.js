document.addEventListener("DOMContentLoaded", () => {
  const baseUrl = "https://3c7369f4-95ff-4637-90ec-7df90d80a290-00-1dizmtza3ollh.pike.replit.dev";

  const params = new URLSearchParams(window.location.search);
  const newsId = params.get("id");

  const newsTitleElement = document.querySelector(".news-title");
  const newsContentElement = document.querySelector(".news-text");
  const newsImageElement = document.querySelector(".news-image");
  const deleteButton = document.getElementById("delete-news");

  const commentsList = document.querySelector(".comments-list");
  const commentInput = document.querySelector(".comment-input");
  const addCommentForm = document.querySelector(".add-comment-form");

  // ========== Load news details ==========
  fetch(`${baseUrl}/news_api.php`)
    .then(res => res.json())
    .then(data => {
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
    .catch(err => {
      console.error("Error fetching news details:", err);
      newsContentElement.textContent = "Error loading news.";
    });

  // ========== Delete news ==========
  deleteButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this news?")) {
      const formData = new URLSearchParams();
      formData.append("id", newsId);

      fetch(`${baseUrl}/news_api.php`, {
        method: "DELETE",
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if (data.message) {
            alert("News deleted successfully.");
            window.location.href = "campusNews.html";
          } else {
            alert("Failed to delete news.");
          }
        })
        .catch(err => {
          console.error("Error deleting news:", err);
          alert("An error occurred while deleting.");
        });
    }
  });

  // ========== Load comments ==========
  function fetchComments() {
    fetch(`${baseUrl}/comments_api.php?news_id=${newsId}`)
      .then(res => res.json())
      .then(data => renderComments(data))
      .catch(err => {
        console.error("Error fetching comments:", err);
        commentsList.innerHTML = "<p>Error loading comments.</p>";
      });
  }

  function renderComments(comments) {
  commentsList.innerHTML = "";

  if (!comments || comments.length === 0) {
    commentsList.innerHTML = "<p>No comments yet.</p>";
    return;
  }

  comments.forEach((comment) => {
    const commentElement = document.createElement("div");
    commentElement.classList.add("comment");
    commentElement.innerHTML = `
      <p>${comment.comment}</p>
      <small>${comment.created_at ? new Date(comment.created_at).toLocaleString() : ""}</small>
      <button class="delete-comment-btn" data-id="${comment.id}">Delete</button>
    `;
    commentsList.appendChild(commentElement);
  });

  // Add event listeners for delete buttons
  document.querySelectorAll(".delete-comment-btn").forEach(button => {
    button.addEventListener("click", (e) => {
      const commentId = e.target.dataset.id;
      if (confirm("Are you sure you want to delete this comment?")) {
        fetch(`${baseUrl}/comments_api.php`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: `id=${commentId}`
        })
          .then(res => res.json())
          .then(data => {
            if (data.message) {
              fetchComments(); // Reload after delete
            } else {
              alert("Failed to delete comment.");
            }
          })
          .catch(err => {
            console.error("Error deleting comment:", err);
            alert("Error deleting comment.");
          });
      }
    });
  });
}


  // ========== Submit new comment ==========
  addCommentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newComment = commentInput.value.trim();

    if (newComment) {
      fetch(`${baseUrl}/comments_api.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          news_id: newsId,
          comment: newComment,
        }),
      })
        .then(res => res.json())
        .then((data) => {
          if (data.message) {
            commentInput.value = "";
            fetchComments(); // Reload comments after adding
          } else {
            alert("Failed to add comment: " + (data.error || "Unknown error"));
          }
        })
        .catch((err) => {
          console.error("Error adding comment:", err);
          alert("Submission failed.");
        });
    }
  });

  fetchComments(); // Initial comment load
});
