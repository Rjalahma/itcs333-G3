document.addEventListener("DOMContentLoaded", () => {
  const reviewsContainer = document.getElementById("reviews-container");
  const departmentFilter = document.getElementById("departmentFilter");
  const sortBySelect = document.getElementById("sortBy");
  const paginationContainer = document.getElementById("paginationContainer");
  const prevButton = document.querySelector(".btn-outline-secondary");
  const nextButton = document.querySelector(".btn-primary");

  let reviews = [];
  let filteredReviews = [];
  let currentPage = 1;
  const reviewsPerPage = 3;

  // Fetch Reviews Data
  async function fetchReviews() {
      try {
          const response = await fetch("reviews.json");
          reviews = await response.json();
          filteredReviews = reviews; // Default: Show all reviews
          displayReviews();
          updatePagination();
      } catch (error) {
          console.error("Error fetching reviews:", error);
      }
  }

  // Display Reviews Based on Current Page
  function displayReviews() {
      reviewsContainer.innerHTML = "";
      const startIndex = (currentPage - 1) * reviewsPerPage;
      const endIndex = Math.min(startIndex + reviewsPerPage, filteredReviews.length);
      const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

      paginatedReviews.forEach((review) => {
          const reviewCard = document.createElement("div");
          reviewCard.classList.add("col-md-4");
          reviewCard.innerHTML = `
              <div class="card review-card h-100">
                  <div class="card-body d-flex flex-column">
                      <h5 class="card-title">${review.courseName}</h5>
                      <p class="card-text">${review.reviewText.substring(0, 100)}...</p>
                      <small class="text-muted">By ${review.reviewerName} · Rated: ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</small>
                      <a href="reviews.html#review${review.id}" class="btn btn-primary mt-auto mt-3">Read Full</a>
                  </div>
              </div>
          `;
          reviewsContainer.appendChild(reviewCard);
      });

      updatePagination();
  }

  // Update Pagination Buttons
  function updatePagination() {
      paginationContainer.innerHTML = "";
      const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

      if (totalPages <= 1) {
          paginationContainer.style.display = "none";
          prevButton.style.display = "none";
          nextButton.style.display = "none";
          return;
      } else {
          paginationContainer.style.display = "flex";
          prevButton.style.display = "inline-block";
          nextButton.style.display = "inline-block";
      }

      for (let i = 1; i <= totalPages; i++) {
          const pageItem = document.createElement("li");
          pageItem.classList.add("page-item", currentPage === i ? "active" : "");
          pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
          pageItem.addEventListener("click", () => {
              currentPage = i;
              displayReviews();
          });
          paginationContainer.appendChild(pageItem);
      }

      prevButton.style.visibility = currentPage > 1 ? "visible" : "hidden";
      nextButton.style.visibility = currentPage < totalPages ? "visible" : "hidden";
  }

  // Filter by Department
  departmentFilter.addEventListener("change", () => {
      const selectedDepartment = departmentFilter.value;

      if (selectedDepartment === "IT") {
          filteredReviews = reviews; // Show all departments
      } else {
          filteredReviews = reviews.filter(review => review.department === selectedDepartment);
      }

      currentPage = 1; // Reset to first page after filtering
      displayReviews();
      updatePagination();
  });

  // Sorting by Date
  sortBySelect.addEventListener("change", () => {
      const sortOption = sortBySelect.value;

      if (sortOption === "date_newest") {
          filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else if (sortOption === "date_oldest") {
          filteredReviews.sort((a, b) => new Date(a.date) - new Date(b.date));
      }

      displayReviews();
  });

  // Navigation Controls
  prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
          currentPage--;
          displayReviews();
      }
  });

  nextButton.addEventListener("click", () => {
      const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
      if (currentPage < totalPages) {
          currentPage++;
          displayReviews();
      }
  });

  fetchReviews();
});