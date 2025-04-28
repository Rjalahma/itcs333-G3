//filter

document.addEventListener("DOMContentLoaded", function () {
  const filterForm = document.getElementById("filter-form");

  filterForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Stop the form from submitting

      // Get all checked checkboxes
      const checkedValues = Array.from(filterForm.querySelectorAll("input[type='checkbox']:checked"))
                                 .map(cb => cb.value);

      // Get all product cards
      const allCards = document.querySelectorAll(".course-note-card");

      allCards.forEach(card => {
          // Reset display
          card.style.display = "none";

          // Loop through checked values
          checkedValues.forEach(value => {
              if (card.id.trim() === value.trim()) {
                  card.style.display = "block";
              }
          });

          // Show all if no checkbox is selected
          if (checkedValues.length === 0) {
              card.style.display = "block";
          }
      });
  });
});




// search bar 


document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("search");
  const searchInput = searchForm.querySelector("input[type='search']");
  const cards = document.querySelectorAll(".course-note-card");

  searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const query = searchInput.value.trim().toLowerCase();

      cards.forEach(card => {
          const text = card.textContent.toLowerCase();
          if (text.includes(query)) {
              card.style.display = "block";
          } else {
              card.style.display = "none";
          }
      });

      // If search is empty, show all cards
      if (query === "") {
          cards.forEach(card => card.style.display = "block");
      }
  });
});