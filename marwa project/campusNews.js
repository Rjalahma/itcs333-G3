document.addEventListener("DOMContentLoaded", () => { 
  const newsList = document.querySelector(".news-list"); 
  const paginationDiv = document.querySelector(".pagination"); 
  let allNews = []; 
  let currentPage = 1;  
  const itemsPerPage = 4;  
 
  // Fetch news data from API 
  fetch("https://3c7369f4-95ff-4637-90ec-7df90d80a290-00-1dizmtza3ollh.pike.replit.dev/news_api.php")
    .then((res) => { 
      if (!res.ok) throw new Error("Failed to fetch news"); 
      return res.json(); 
    }) 
    .then((data) => { 
      allNews = data; 
      renderNews(allNews);  
      setupPagination(allNews);  
    }) 
    .catch((err) => { 
      newsList.innerHTML = "<p>Error loading news.</p>"; 
      console.error(err); 
    }); 
 
  // Render news cards for the current page 
  function renderNews(newsArray) { 
    const startIndex = (currentPage - 1) * itemsPerPage; 
    const endIndex = startIndex + itemsPerPage; 
    const newsToDisplay = newsArray.slice(startIndex, endIndex); 
 
    newsList.innerHTML = "";  
    newsToDisplay.forEach((item) => { 
      const card = ` 
        <div class="news-item"> 
          <img src="${item.image}" alt="News Image" style="width: 100%; height: auto; object
fit: cover;"> 
          <div class="news-type">${item.category}</div> 
          <div class="description">${item.description}</div> 
          <a href="news-details.html?id=${item.id}" class="more-info-button">More Info</a> 
        </div> 
      `; 
      newsList.innerHTML += card; 
    }); 
  } 
 
  // Setup pagination buttons 
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
        <button class="page-number ${currentPage === i ? "active" : ""}" data
page="${i}">${i}</button> 
      `; 
    } 
 
    // Next Button 
    paginationDiv.innerHTML += ` 
      <button class="next" ${currentPage === totalPages ? "disabled" : ""}>Next</button> 
    `; 
 
    // Add event listeners 
    document.querySelector(".previous").addEventListener("click", () => { 
      if (currentPage > 1) { 
        currentPage--; 
        renderNews(allNews); 
        setupPagination(allNews); 
      } 
    }); 
 
    document.querySelector(".next").addEventListener("click", () => { 
      if (currentPage < totalPages) { 
        currentPage++; 
        renderNews(allNews); 
        setupPagination(allNews); 
      } 
    }); 
 
    document.querySelectorAll(".page-number").forEach((button) => { 
      button.addEventListener("click", () => { 
        currentPage = Number(button.dataset.page); 
        renderNews(allNews); 
        setupPagination(allNews); 
      }); 
    }); 
  } 
}); 