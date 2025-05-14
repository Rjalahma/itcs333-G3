document.addEventListener("DOMContentLoaded", () => {
  const reviewsContainer = document.getElementById("reviews-container");
  const departmentFilter = document.getElementById("departmentFilter");
  const sortBySelect = document.getElementById("sortBy");
  const paginationContainer = document.getElementById("paginationContainer");
  const prevButton = document.querySelector(".btn-outline-secondary");
  const nextButton = document.querySelector(".btn-primary");
  const searchInput = document.querySelector("input[type='search']");
  const searchBtn = document.querySelector("button[type='submit']");
  const reviewForm = document.getElementById("reviewForm");

  let reviews = [];
  let filteredReviews = [];
  let currentPage = 1;
  const reviewsPerPage = 3;

  const apiUrl = "http://localhost/Shahad-Reviews/api/reviews.php";

  function showLoading() {
    reviewsContainer.innerHTML = '<p class="text-center w-100">Loading reviews...</p>';
  }

  async function fetchReviews() {
    showLoading();
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to load reviews.");
      reviews = await response.json();
      filteredReviews = [...reviews];
      displayReviews();
      updatePagination();
    } catch (error) {
      reviewsContainer.innerHTML = `<p class="text-danger w-100">Error: ${error.message}</p>`;
    }
  }

  function displayReviews() {
    reviewsContainer.innerHTML = "";
    const start = (currentPage - 1) * reviewsPerPage;
    const end = Math.min(start + reviewsPerPage, filteredReviews.length);
    const paginatedReviews = filteredReviews.slice(start, end);

    if (paginatedReviews.length === 0) {
      reviewsContainer.innerHTML = '<p class="text-center w-100">No reviews found.</p>';
      return;
    }

    paginatedReviews.forEach((review) => {
      const reviewCard = document.createElement("div");
      reviewCard.classList.add("col-md-4");
      reviewCard.innerHTML = `
        <div class="card review-card h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${review.courseName}</h5>
            <p class="card-text">${review.reviewText.substring(0, 100)}...</p>
            <small class="text-muted">By ${review.reviewerName} · Rated: ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</small>
            <a href="reviews.html?id=${review.id}" class="btn btn-primary mt-auto mt-3">Read Full</a>
          </div>
        </div>`;
      reviewsContainer.appendChild(reviewCard);
    });

    updatePagination();
  }

  function updatePagination() {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

    if (totalPages <= 1) {
      paginationContainer.style.display = "none";
      prevButton.style.display = "none";
      nextButton.style.display = "none";
      return;
    }

    paginationContainer.style.display = "flex";
    prevButton.style.display = "inline-block";
    nextButton.style.display = "inline-block";

    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${i === currentPage ? "active" : ""}`;
      li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      li.addEventListener("click", () => {
        currentPage = i;
        displayReviews();
      });
      paginationContainer.appendChild(li);
    }

    prevButton.style.visibility = currentPage > 1 ? "visible" : "hidden";
    nextButton.style.visibility = currentPage < totalPages ? "visible" : "hidden";
  }

  prevButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      displayReviews();
    }
  });

  nextButton.addEventListener("click", (e) => {
    e.preventDefault();
    const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      displayReviews();
    }
  });

  departmentFilter.addEventListener("change", () => {
    const dept = departmentFilter.value;
    filteredReviews = dept === "IT" ? [...reviews] : reviews.filter(r => r.department === dept);
    currentPage = 1;
    displayReviews();
  });

  sortBySelect.addEventListener("change", () => {
    const option = sortBySelect.value;
    if (option === "date_newest") {
      filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (option === "date_oldest") {
      filteredReviews.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (option === "rating_highest") {
      filteredReviews.sort((a, b) => b.rating - a.rating);
    } else if (option === "rating_lowest") {
      filteredReviews.sort((a, b) => a.rating - b.rating);
    }
    displayReviews();
  });

  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.toLowerCase().trim();
    filteredReviews = reviews.filter(r =>
      r.courseName.toLowerCase().includes(query) ||
      r.reviewerName.toLowerCase().includes(query)
    );
    currentPage = 1;
    displayReviews();
  });

  // Handle review form submission
  if (reviewForm) {
    reviewForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const requiredFields = ["courseName", "department", "reviewText", "rating", "reviewerName"];
      let isValid = true;

      requiredFields.forEach((fieldId) => {
        let field = document.getElementById(fieldId);
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add("is-invalid");
        } else {
          field.classList.remove("is-invalid");
        }
      });

      if (!isValid) {
        this.reportValidity();
        return;
      }

      const newReview = {
        courseName: document.getElementById("courseName").value.trim(),
        reviewText: document.getElementById("reviewText").value.trim(),
        reviewerName: document.getElementById("reviewerName").value.trim(),
        rating: parseInt(document.getElementById("rating").value),
        department: document.getElementById("department").value,
        date: new Date().toISOString().split("T")[0]
      };

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReview)
        });

        if (!response.ok) throw new Error("Failed to submit review.");

        alert("Review submitted successfully!");
        this.reset();
        fetchReviews();
      } catch (error) {
        alert("Error: " + error.message);
      }
    });
  }

  fetchReviews();
});