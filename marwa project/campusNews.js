document.addEventListener("DOMContentLoaded", () => {
  const newsList = document.querySelector(".news-list");
  const paginationDiv = document.querySelector(".pagination");
  const searchInput = document.querySelector(".search-bar");
  const sortSelect = document.querySelector(".sort");

  let allNews = [];
  let currentDisplayedNews = [];
  let currentPage = 1;
  const itemsPerPage = 4;

  const baseUrl = "https://3c7369f4-95ff-4637-90ec-7df90d80a290-00-1dizmtza3ollh.pike.replit.dev/news_api.php";

  // Fetch all news
  fetch(baseUrl)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch news");
      return res.json();
    })
    .then(data => {
      allNews = data;
      currentDisplayedNews = data;
      renderNews(currentDisplayedNews);
      setupPagination(currentDisplayedNews);
    })
    .catch(err => {
      newsList.innerHTML = "<p>Error loading news.</p>";
      console.error(err);
    });

  // Render news for current page
  function renderNews(newsArray) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newsToDisplay = newsArray.slice(startIndex, endIndex);

    newsList.innerHTML = "";
    newsToDisplay.forEach((item) => {
      const card = `
        <div class="news-item">
          <img src="${item.image}" alt="News Image" style="width: 100%; height: auto; object-fit: cover;">
          <div class="news-type">${item.category}</div>
          <div class="description">${item.description}</div>
          <a href="news-details.html?id=${item.id}" class="more-info-button">More Info</a>
        </div>
      `;
      newsList.innerHTML += card;
    });
  }

  // Setup pagination
  function setupPagination(newsArray) {
    const totalPages = Math.ceil(newsArray.length / itemsPerPage);
    paginationDiv.innerHTML = "";

    // Previous Button
    paginationDiv.innerHTML += `
      <button class="previous" ${currentPage === 1 ? "disabled" : ""}>Previous</button>
    `;

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
      paginationDiv.innerHTML += `
        <button class="page-number ${currentPage === i ? "active" : ""}" data-page="${i}">${i}</button>
      `;
    }

    // Next Button
    paginationDiv.innerHTML += `
      <button class="next" ${currentPage === totalPages ? "disabled" : ""}>Next</button>
    `;
  }

  // Handle pagination clicks
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("page-number")) {
      currentPage = Number(e.target.dataset.page);
      renderNews(currentDisplayedNews);
    }

    if (e.target.classList.contains("previous") && currentPage > 1) {
      currentPage--;
      renderNews(currentDisplayedNews);
      setupPagination(currentDisplayedNews);
    }

    if (e.target.classList.contains("next") && currentPage < Math.ceil(currentDisplayedNews.length / itemsPerPage)) {
      currentPage++;
      renderNews(currentDisplayedNews);
      setupPagination(currentDisplayedNews);
    }
  });

  // Search functionality
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allNews.filter(item =>
      item.title.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm)
    );
    currentDisplayedNews = filtered;
    currentPage = 1;
    renderNews(currentDisplayedNews);
    setupPagination(currentDisplayedNews);
  });

  // Sort/filter by category
  sortSelect.addEventListener("change", (e) => {
    const selected = e.target.value;
    if (selected === "Filter by category" || selected === "") {
      currentDisplayedNews = allNews;
    } else {
      currentDisplayedNews = allNews.filter(item => item.category === selected);
    }
    currentPage = 1;
    renderNews(currentDisplayedNews);
    setupPagination(currentDisplayedNews);
  });
});
