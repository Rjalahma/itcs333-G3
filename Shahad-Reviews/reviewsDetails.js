(async function () {
    function getId() {
        return new URLSearchParams(location.search).get("id");
    }

    function formatDate(d) {
        return new Date(d).toLocaleDateString();
    }

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
        console.error(e);
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

    // Populate View
    function populateView() {
        fieldsView.title.textContent = review.courseName;
        fieldsView.reviewer.textContent = review.reviewerName;
        fieldsView.dept.textContent = review.department;
        fieldsView.date.textContent = formatDate(review.date);
        fieldsView.desc.textContent = review.reviewText;
    }

    // Populate Form for Editing
    function populateForm() {
        fieldsEdit.title.value = review.courseName;
        fieldsEdit.dept.value = review.department;
        fieldsEdit.date.value = review.date;
        fieldsEdit.desc.value = review.reviewText;
    }

    populateView();

    // Edit button
    document.getElementById("editBtn").addEventListener("click", () => {
        viewMode.style.display = "none";
        editForm.style.display = "block";
        populateForm();
    });

    // Cancel Editing
    document.getElementById("cancelBtn").addEventListener("click", () => {
        editForm.style.display = "none";
        viewMode.style.display = "block";
    });

    // Save Review Updates
    editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        review.courseName = fieldsEdit.title.value.trim();
        review.department = fieldsEdit.dept.value;
        review.date = fieldsEdit.date.value;
        review.reviewText = fieldsEdit.desc.value.trim();
        populateView();
        editForm.style.display = "none";
        viewMode.style.display = "block";
        alert("Review updated!");
    });

    // Delete Review
    document.getElementById("deleteBtn").addEventListener("click", () => {
        if (confirm("Delete this review?")) {
            alert("Review deleted.");
            window.location.href = "CourseReviews.html";
        }
    });

    // Handle Comments
    document.getElementById("commentForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("commentName").value;
        const text = document.getElementById("commentInput").value;
        const box = document.createElement("div");
        box.className = "comment-box";
        box.innerHTML = `<h6>${name} <small class="text-muted">on ${formatDate(Date.now())}</small></h6><p>${text}</p>`;
        document.getElementById("commentsContainer").prepend(box);
        e.target.reset();
    });
})();