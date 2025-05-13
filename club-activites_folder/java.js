
document.addEventListener('DOMContentLoaded', function() {
  
    const apiUrl = 'https://85a9004b-6f70-4270-987e-d532d17c45e5-00-jmf0e13pp2ab.pike.replit.dev/club-cars.php';
    let allActivities = [];
    let currentPage = 1;
    const itemsPerPage = 6;
    const moreInfoButton = document.getElementById('more-info-button');
   
    async function loadData() {
        // Fetch data from the API
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            allActivities = data;
            copyallActivities = data;
            updateDisplay();
        } catch (error) {
            console.error('Error:', error);

        
            const containerr = document.getElementById('card-container');
            containerr.innerHTML = `<div style=" margin-left: 70% !important;"  class="alert alert-danger w-100" role="alert">there is no data please check your internet conaction </div>`;
            alert(' please check your internet connection and try again');
            return;
        
            
        }
    }


    function updateDisplay() {
      
            
                
        //    calculate the start and end index for the current page
        const container = document.getElementById('card-container');
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = allActivities.slice(start, end);
        // crat the cards of club activty from the data fetched from api 
        
        container.innerHTML = pageItems.map(activity => `
           <div class="course-note-card card">
                <div class="card-body card-grid">
                    <img src="${activity.photo.url}" alt="${activity.photo.alt}" class="img mb-3">
                    <h5 class="card-title">${activity.name}</h5>
                    <p class="card-text">${activity.briefdescription}</p>
                    <p><strong>Day:</strong> ${activity.day}</p>
                    <p><strong>Time:</strong> ${activity.time}</p>
                    <p><strong>Location:</strong> ${activity.location}</p>
                    
                    
                </div>
                <input type="button"
                        class="btn btn-primary more-info-button w-100 align-bottom"
                        onclick="location.href='../item-detiles/item-detiles.html?id=${activity.id}'"
                        value="More info"/>
            </div>


        `).join('');

        // Update pagination
        const totalPages = Math.ceil(allActivities.length / itemsPerPage);
        const pagination = document.querySelector('.pagination');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        // Update page numbers
        pagination.innerHTML = Array.from({length: totalPages}, (_, i) => `
            <li class="page-item ${i + 1 === currentPage ? 'active' : ''}">
                <a class="page-link" href="#">${i + 1}</a>
            </li>
        `).join('');

        // Add click events to page numbers
        pagination.querySelectorAll('.page-link').forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = index + 1;
                updateDisplay();
            });
        });

        // Update prev/next buttons
        prevBtn.classList.toggle('disabled', currentPage === 1);
        nextBtn.classList.toggle('disabled', currentPage === totalPages);
    }
    // Event listeners for prev/next buttons
    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateDisplay();
        }
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        if (currentPage < Math.ceil(allActivities.length / itemsPerPage)) {
            currentPage++;
            updateDisplay();
        }
    });
    // search input event listener so user can search for any activity
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', function() {
        
        const searchTerm = searchInput.value.toLowerCase();
        allActivities = allActivities.filter(activity => 
            activity.name.toLowerCase().includes(searchTerm) ||
            activity.briefdescription.toLowerCase().includes(searchTerm)
           
        );
        currentPage = 1; 
        updateDisplay();
    });
    //  sorting event listener so user can sort the club based on his required club typ
    const filterSelect = document.querySelector('.form-select');

    filterSelect.addEventListener("change", function() {
        let selectedType = filterSelect.value;
        console.log("filterSelect=",filterSelect.value);
        // chack if theree is selected vlaue or not and chack if the value is not "all"
        if (selectedType && selectedType !== "All") {
            // filter the clubs based on the type
            allActivities= copyallActivities.filter(activity => activity.type === selectedType);
            console.log("inside the if filterSelect IF =",filterSelect.value);

        }   
        // if user then select all the allactivities will be equal to the copyallActivities whic is the original club activitiey 
        else if (selectedType === "All") {
            allActivities = copyallActivities;
            console.log("inside the else if filterSelect ALL =",filterSelect.value);
        }
         else {
            allActivities = copyallActivities;  
            console.log("inside the else filterSelect=",filterSelect.value);
            loadData(); 
        }
        currentPage = 1; 
        updateDisplay();
    });
   
    loadData();
});