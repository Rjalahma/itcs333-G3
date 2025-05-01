(async function () {
    const getId = () => new URLSearchParams(location.search).get("id");
    const formatDate = (d) => new Date(d).toLocaleDateString();
    const id = getId();
    if (!id) return;
  
    let review;
    try {
      const res = await fetch("reviews.json");
      if (!res.ok) throw new Error(res.statusText);
      const reviews = await res.json();
      review = reviews.find((r) => String(r.id) === id);
      if (!review) throw new Error("Review not found");
    } catch (e) {
      document.getElementById("readFull").innerHTML = `<p class="text-danger">${e.message}</p>`;
      return;
    }
  
    // Elements
    const viewMode = document.getElementById("readFull");
    const editForm = document.getElementById("editMode");
    const fieldsView = {
      title: document.getElementById("detailTitle"),
      reviewer: document.getElementById("detailName"),
      dept: document.getElementById("detailDept"),
      date: document.getElementById("detailDate"),
      desc: document.getElementById("detailDescription"),
    };
    const fieldsEdit = {
      title: document.getElementById("editTitle"),
      dept: document.getElementById("editDept"),
      date: document.getElementById("editDate"),
      desc: document.getElementById("editDesc"),
    };
  
    function populateView() {
      fieldsView.title.textContent = review.courseName;
      fieldsView.reviewer.textContent = review.reviewerName;
      fieldsView.dept.textContent = review.department;
      fieldsView.date.textContent = formatDate(review.date);
      fieldsView.desc.textContent = review.reviewText;
    }
  
    function populateForm() {
      fieldsEdit.title.value = review.courseName;
      fieldsEdit.dept.value = review.department;
      fieldsEdit.date.value = review.date;
      fieldsEdit.desc.value = review.reviewText;
    }
  
    populateView();
  
    document.getElementById("editBtn").addEventListener("click", () => {
      viewMode.style.display = "none";
      editForm.style.display = "block";
      populateForm();
    });
  
    document.getElementById("cancelBtn").addEventListener("click", () => {
      editForm.style.display = "none";
      viewMode.style.display = "block";
    });
  
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      review.courseName = fieldsEdit.title.value.trim();
      review.department = fieldsEdit.dept.value;
      review.date = fieldsEdit.date.value;
      review.reviewText = fieldsEdit.desc.value.trim();
      populateView();
      editForm.style.display = "none";
      viewMode.style.display = "block";
      alert("Review updated (note: not saved permanently).");
    });
  
    document.getElementById("deleteBtn").addEventListener("click", () => {
      if (confirm("Are you sure to delete this review?")) {
        alert("Review deleted (note: not saved permanently).");
        window.location.href = "CourseReviews.html";
      }
    });
  
    // COMMENTS REPLIES
    document.getElementById("commentForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("commentName").value.trim();
      const text = document.getElementById("commentInput").value.trim();
      const rating = document.getElementById("commentRating").value;
  
      if (!name || !text || !rating) return;
  
      const box = document.createElement("div");
      box.className = "comment-box";
      box.innerHTML = `
        <h6>${name} <small class="text-muted">on ${formatDate(Date.now())}</small></h6>
        <p>${text}</p>
        <p>Rating: ${"★".repeat(rating)}${"☆".repeat(5 - rating)}</p>
      `;
  
      // Reply Feature
      const replyBtn = document.createElement("button");
      replyBtn.textContent = "Reply";
      replyBtn.className = "btn btn-sm btn-outline-primary mt-2";
  
      const replyBox = document.createElement("div");
      replyBox.style.display = "none";
      replyBox.className = "reply-section";
      replyBox.innerHTML = `
        <input type="text" class="form-control my-1 replyName" placeholder="Your name">
        <textarea class="form-control my-1 replyText" placeholder="Reply..." rows="2"></textarea>
        <button class="btn btn-sm btn-success postReplyBtn">Post Reply</button>
      `;
  
      replyBtn.addEventListener("click", () => {
        replyBox.style.display = replyBox.style.display === "none" ? "block" : "none";
      });
  
      replyBox.querySelector(".postReplyBtn").addEventListener("click", () => {
        const replyName = replyBox.querySelector(".replyName").value.trim();
        const replyText = replyBox.querySelector(".replyText").value.trim();
        if (!replyName || !replyText) return;
  
        const replyDisplay = document.createElement("div");
        replyDisplay.className = "ms-3 mt-2 p-2 bg-light border rounded";
        replyDisplay.innerHTML = `<strong>${replyName}</strong>: ${replyText}`;
        box.appendChild(replyDisplay);
        replyBox.remove();
      });
  
      box.appendChild(replyBtn);
      box.appendChild(replyBox);
      document.getElementById("commentsContainer").prepend(box);
      e.target.reset();
    });
  })();