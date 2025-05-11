document.addEventListener("DOMContentLoaded", () => {
    const newsList = document.querySelector(".news-list");
    const searchInput = document.querySelector(".search-bar");
    const sortSelect = document.querySelector(".sort");
    let allNews = [];
  
    // Fetch news data
    fetch("https://marwaalzubari.marwadata.repl.co/news_api.php")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch news");
        return res.json();
      })
      .then(data => {
        allNews = data;
        renderNews(allNews);
      })
      .catch(err => {
        newsList.innerHTML = "<p>Error loading news.</p>";
        console.error(err);
      });
  
    // Render news cards
    function renderNews(newsArray) {
      newsList.innerHTML = "";
      newsArray.forEach(item => {
        const card = `
          <div class="news-item">
            <img src="${item.image}" alt="News Image">
            <div class="news-type">${item.category}</div>
            <div class="description">${item.description}</div>
            <a href="news-details.html?id=${item.id}" class="more-info-button">More Info</a>
          </div>
        `;
        newsList.innerHTML += card;
      });
    }
  
    // Filter by search
    searchInput.addEventListener("input", () => {
      const term = searchInput.value.toLowerCase();
      const filtered = allNews.filter(n =>
        n.title.toLowerCase().includes(term) ||
        n.description.toLowerCase().includes(term)
      );
      renderNews(filtered);
    });
  
    // Filter by category
    sortSelect.addEventListener("change", () => {
      const category = sortSelect.value;
      if (category === "Filter by category") {
        renderNews(allNews);
      } else {
        const filtered = allNews.filter(n => n.category === category);
        renderNews(filtered);
      }
    });
  });
  