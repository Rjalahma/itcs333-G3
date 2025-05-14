// campusNews.js - Responsible for fetching and displaying campus news with pagination, search, and filter

document.addEventListener("DOMContentLoaded", () => {
  const newsList = document.querySelector(".news-list");
  const paginationDiv = document.querySelector(".pagination");
  const searchInput = document.querySelector(".search-bar");
  const sortSelect = document.querySelector(".sort");

  let allNews = []; // Full list of all news items
  let currentDisplayedNews = []; // Currently filtered/displayed news
  let currentPage = 1;
  const itemsPerPage = 4;

  //  baseUrl now points directly to API file
  const baseUrl = "https://3c7369f4-95ff-4637-90ec-7df90d80a290-00-1dizmtza3ollh.pike.replit.dev/news_api.php";

  // Fetch all news items from API
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

  // Render a list of news items for the current page
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

  // Generate pagination buttons based on number of items
  function setupPagination(newsArray) {
    const totalPages = Math.ceil(newsArray.length / itemsPerPage);
    paginationDiv.innerHTML = "";

    // Previous button
    paginationDiv.innerHTML += `
      <button class="previous" ${currentPage === 1 ? "disabled" : ""}>Previous</button>
    `;

    // Page number buttons
    for (let i = 1; i <= totalPages; i++) {
      paginationDiv.innerHTML += `
        <button class="page-number ${currentPage === i ? "active" : ""}" data-page="${i}">${i}</button>
      `;
    }

    // Next button
    paginationDiv.innerHTML += `
      <button class="next" ${currentPage === totalPages ? "disabled" : ""}>Next</button>
    `;
  }

  // Handle pagination button clicks
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("page-number")) {
      currentPage = Number(e.target.dataset.page);
      renderNews(currentDisplayedNews);
      setupPagination(currentDisplayedNews); // Added this to update active state
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

  // Search through title and description
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

  // Filter by category dropdown
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
