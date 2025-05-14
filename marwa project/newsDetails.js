document.addEventListener("DOMContentLoaded", () => {
  const baseUrl = "https://3c7369f4-95ff-4637-90ec-7df90d80a290-00-1dizmtza3ollh.pike.replit.dev/comments_api.php";
  const newsApiUrl = "https://3c7369f4-95ff-4637-90ec-7df90d80a290-00-1dizmtza3ollh.pike.replit.dev/news_api.php";

  const params = new URLSearchParams(window.location.search);
  const newsId = params.get("id");

  if (!newsId || isNaN(newsId)) {
    alert("Invalid news ID.");
    return;
  }

  // Link Edit button to edit page
  document.querySelector(".edit-btn-link").href = `editNews.html?id=${newsId}`;

  const newsTitleElement = document.querySelector(".news-title");
  const newsContentElement = document.querySelector(".news-text");
  const newsImageElement = document.querySelector(".news-image");
  const deleteButton = document.getElementById("delete-news");
  const commentsList = document.querySelector(".comments-list");
  const commentInput = document.querySelector(".comment-input");
  const addCommentForm = document.querySelector(".add-comment-form");

  // Load news details
  fetch(newsApiUrl)
    .then(res => res.json())
    .then(data => {
      const newsItem = data.find(item => item.id == newsId);
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

  // Delete news 
  deleteButton.addEventListener("click", () => {
    if (!newsId || isNaN(newsId)) {
      alert("Invalid news ID. Cannot delete.");
      return;
    }

    if (confirm("Are you sure you want to delete this news?")) {
      const formData = new URLSearchParams();
      formData.append("id", newsId);

      fetch(newsApiUrl, {
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

  // Load comments 
  function fetchComments() {
    fetch(`${baseUrl}?news_id=${newsId}`)
      .then(res => res.json())
      .then(data => renderComments(data))
      .catch(err => {
        console.error("Error fetching comments:", err);
        commentsList.innerHTML = "<p>Error loading comments.</p>";
      });
  }

  //  Render comments 
  function renderComments(comments) {
    commentsList.innerHTML = "";

    comments.forEach(comment => {
      if (!comment.id || !comment.comment) return;

      const commentElement = document.createElement("div");
      commentElement.classList.add("comment");
      commentElement.innerHTML = `
        <p class="comment-text">${comment.comment}</p>
        <small>${comment.created_at ? new Date(comment.created_at).toLocaleString() : ""}</small>
        <textarea class="edit-input" style="display:none;">${comment.comment}</textarea>
        <div style="margin-top: 10px;">
          <button class="edit-comment-btn" data-id="${comment.id}">Edit</button>
          <button class="save-comment-btn" data-id="${comment.id}" style="display:none;">Save</button>
          <button class="delete-comment-btn" data-id="${comment.id}">Delete</button>
        </div>
      `;
      commentsList.appendChild(commentElement);
    });

    // Edit comment
    document.querySelectorAll(".edit-comment-btn").forEach(button => {
      button.addEventListener("click", e => {
        const commentDiv = e.target.closest(".comment");
        const textarea = commentDiv.querySelector(".edit-input");
        const textP = commentDiv.querySelector(".comment-text");
        const saveBtn = commentDiv.querySelector(".save-comment-btn");

        textarea.style.display = "block";
        textP.style.display = "none";
        e.target.style.display = "none";
        saveBtn.style.display = "inline-block";
      });
    });

    // Save edited comment
    document.querySelectorAll(".save-comment-btn").forEach(button => {
      button.addEventListener("click", e => {
        const commentId = e.target.dataset.id;
        const commentDiv = e.target.closest(".comment");
        const textarea = commentDiv.querySelector(".edit-input");
        const newComment = textarea.value.trim();

        if (!newComment) {
          alert("Comment cannot be empty.");
          return;
        }

        const formData = new URLSearchParams();
        formData.append("id", commentId);
        formData.append("comment", newComment);

        fetch(baseUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: formData
        })
          .then(res => res.json())
          .then(data => {
            if (data.message) {
              fetchComments();
            } else {
              alert("Failed to update comment.");
            }
          })
          .catch(err => {
            console.error("Error updating comment:", err);
            alert("An error occurred while updating the comment.");
          });
      });
    });

    // Delete comment
    document.querySelectorAll(".delete-comment-btn").forEach(button => {
      button.addEventListener("click", e => {
        const commentId = e.target.dataset.id;

        if (!commentId || commentId === "undefined" || isNaN(commentId)) {
          alert("Invalid comment ID. Cannot delete.");
          return;
        }

        if (confirm("Are you sure you want to delete this comment?")) {
          fetch(baseUrl, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `id=${commentId}`
          })
            .then(res => res.json())
            .then(data => {
              if (data.message) {
                fetchComments();
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

  // Submit new comment 
  addCommentForm.addEventListener("submit", e => {
    e.preventDefault();
    const newComment = commentInput.value.trim();

    if (newComment) {
      fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          news_id: newsId,
          comment: newComment
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.message) {
            commentInput.value = "";
            fetchComments();
          } else {
            alert("Failed to add comment: " + (data.error || "Unknown error"));
          }
        })
        .catch(err => {
          console.error("Error adding comment:", err);
          alert("Submission failed.");
        });
    }
  });

  // Initial load
  fetchComments();
});
