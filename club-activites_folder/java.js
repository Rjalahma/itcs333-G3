
document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://6809f2951f1a52874cde75c1.mockapi.io/cludData';
    let allActivities = [];
    let currentPage = 1;
    const itemsPerPage = 6;
    const moreInfoButton = document.getElementById('more-info-button');
   
    async function loadData() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            allActivities = data;
            copyallActivities = data;
            updateDisplay();
        } catch (error) {
            console.error('Error:', error);
        }
    }


    function updateDisplay() {
      
            
                
 
        const container = document.getElementById('card-container');
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = allActivities.slice(start, end);

        container.innerHTML = pageItems.map(activity => `
            <div class="course-note-card card">
                <div class="card-body">
                    <img src="${activity.photo.url}" alt="${activity.photo.alt}" class="img">
                    <h5 class="card-title">${activity.name}</h5>
                    <p class="card-text">${activity.briefdescription}</p>
                    <p><strong>Day:</strong> ${activity.day}</p>
                    <p><strong>Time:</strong> ${activity.time}</p>
                    <p><strong>Location:</strong> ${activity.location}</p>
                    <input type="button" id ="more-info-button" class="btn btn-primary-cards" onclick="location.href='../item-detiles/item-detiles.html?id=${activity.id}'" value="More info"/>
                </div>
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
    // if (moreInfoButton) {
    // moreInfoButton.addEventListener('click', function(e) {
    //     console.log("more-info-button=",moreInfoButton); 
    //     const v=itemDetailes();
    //     console.log("v=",v);
    //     console.log("after more-info-call");
            
    // });}
  
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
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', function() {
        
        const searchTerm = searchInput.value.toLowerCase();
        allActivities = allActivities.filter(activity => 
            activity.name.toLowerCase().includes(searchTerm) ||
            activity.briefdescription.toLowerCase().includes(searchTerm)||
            activity.type.toLowerCase().includes(searchTerm) 
        );
        currentPage = 1; 
        updateDisplay();
    });
    const filterSelect = document.querySelector('.form-select');

    filterSelect.addEventListener("change", function() {
        let selectedType = filterSelect.value;
        console.log("filterSelect=",filterSelect.value);
        if (selectedType) {
            allActivities= copyallActivities.filter(activity => activity.type === selectedType);
            console.log("inside the if filterSelect=",filterSelect.value);
        } else {
            allActivities = copyallActivities;  
            console.log("inside the else filterSelect=",filterSelect.value);
            loadData(); 
        }
        currentPage = 1; 
        updateDisplay();
    });
   
    loadData();
});