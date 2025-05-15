// Constants
const API_URL = 'https://add62c0c-c8b3-495c-a225-79ebd85c094b-00-2h8t6ky89z6bv.pike.replit.dev/main.php';
const POST_API_URL = 'https://add62c0c-c8b3-495c-a225-79ebd85c094b-00-2h8t6ky89z6bv.pike.replit.dev/createGroup.php';   
const Join_API_URL ='https://add62c0c-c8b3-495c-a225-79ebd85c094b-00-2h8t6ky89z6bv.pike.replit.dev/joinGroup.php';
const Comment_API_URL ='https://add62c0c-c8b3-495c-a225-79ebd85c094b-00-2h8t6ky89z6bv.pike.replit.dev/comment.php';

const ITEMS_PER_PAGE = 6;

// State management
let studyGroups = [];
let currentPage = 1;
let filteredGroups = [];
let isLoading = false;

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    fetchStudyGroups();
    setupEventListeners();
});

// Event Listeners Setup
function setupEventListeners() {
    // Search and filter
    document.getElementById('searchInput')?.addEventListener('input', handleSearch);
    document.getElementById('yearFilter')?.addEventListener('change', handleFilters);
    document.getElementById('locationFilter')?.addEventListener('change', handleFilters);

    // Sorting
    document.getElementById('sortSelect')?.addEventListener('change', handleSort);

    // Form validation
    const createGroupForm = document.getElementById('createGroupForm');
    if (createGroupForm) {
        createGroupForm.addEventListener('submit', handleFormSubmit);
    }
}

// Data Fetching
async function fetchStudyGroups() {
    try {
        showLoader();
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        studyGroups = await response.json();
        filteredGroups = [...studyGroups];
        renderStudyGroups();
    } catch (error) {
        showError('Failed to fetch study groups');
        console.error('Error:', error);
    } finally {
        hideLoader();
    }
}

// Search and Filter Functions
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    filterGroups();
}

function handleFilters() {
    filterGroups();
}

function filterGroups() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const yearFilter = document.getElementById('yearFilter')?.value || '';
    const locationFilter = document.getElementById('locationFilter')?.value || '';

    filteredGroups = studyGroups.filter(group => {
        const matchesSearch = 
            group.groupName.toLowerCase().includes(searchTerm) ||
            group.subjectCode.toLowerCase().includes(searchTerm) ||
            group.description.toLowerCase().includes(searchTerm);
        const matchesYear = !yearFilter || group.year === yearFilter;
        const matchesLocation = !locationFilter || group.location === locationFilter;

        return matchesSearch && matchesYear && matchesLocation;
    });

    currentPage = 1;
    renderStudyGroups();
}

// Sorting Function
function handleSort(event) {
    const sortBy = event.target.value;
    
    filteredGroups.sort((a, b) => {
        switch(sortBy) {
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'oldest':
                return new Date(a.createdAt) - new Date(b.createdAt);
            case 'alphabetical':
                return a.groupName.localeCompare(b.groupName);
            default:
                return 0;
        }
    });

    renderStudyGroups();
}

// Pagination Functions
function calculatePageCount() {
    return Math.ceil(filteredGroups.length / ITEMS_PER_PAGE);
}

function getPageItems() {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredGroups.slice(startIndex, startIndex + ITEMS_PER_PAGE);
}

function renderPagination() {
    const paginationElement = document.getElementById('pagination');
    if (!paginationElement) return;

    const pageCount = calculatePageCount();
    let paginationHTML = '';

    // Previous button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;" ${currentPage === 1 ? 'tabindex="-1" aria-disabled="true"' : ''}>
                Previous
            </a>
        </li>
    `;

    // Page numbers
    for (let i = 1; i <= pageCount; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
            </li>
        `;
    }

    // Next button
    paginationHTML += `
        <li class="page-item ${currentPage === pageCount ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;" ${currentPage === pageCount ? 'tabindex="-1" aria-disabled="true"' : ''}>
                Next
            </a>
        </li>
    `;

    paginationElement.innerHTML = paginationHTML;
}

function changePage(page) {
    const pageCount = calculatePageCount();
    
    // Validate page number
    if (page < 1 || page > pageCount) {
        return;
    }
    
    currentPage = page;
    renderStudyGroups();
}

// Rendering Functions
function renderStudyGroups() {
    const container = document.getElementById('studyGroupsContainer');
    if (!container) return;

    const pageItems = getPageItems();
    
    if (filteredGroups.length === 0) {
        // Show no results message
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info" role="alert">
                    <h4 class="alert-heading">No Study Groups Found</h4>
                    <p>No study groups match your search criteria. Try adjusting your filters or search terms.</p>
                    <hr>
                    <p class="mb-0">
                        <button class="btn btn-secondary" onclick="resetFilters()">Reset Filters</button>
                    </p>
                </div>
            </div>
        `;
        
        // Hide pagination when no results
        const paginationElement = document.getElementById('pagination');
        if (paginationElement) {
            paginationElement.style.display = 'none';
        }
        return;
    }

    // Show pagination when there are results
    const paginationElement = document.getElementById('pagination');
    if (paginationElement) {
        paginationElement.style.display = 'flex';
    }
    // group cards 
    container.innerHTML = `
        <div class="container_group mt-4">
            <div class="row">
                ${pageItems.map(group => `
                    <div class="col-md-4 mb-4">
                        <div class="group-finder-card h-100">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${group.groupName}</h5>
                                <p class="group-finder-card p">Subject Code: ${group.subjectCode}</p>
                                <p class="group-finder-card p">Location: ${group.location}</p>
                                <p class="group-finder-card p">Members: ${group.members.length}/${group.maxMembers}</p>
                                <p class="group-finder-card p">Status: ${group.members.length >= group.maxMembers ? 'FULL' : 'Open'}</p>
                                <div class="d-flex flex-column mt-auto">
                                    ${group.members.length >= group.maxMembers ? 
                                        `<button class="btn btn-secondary mb-2" disabled>Full</button>` :
                                        `<button class="btn btn-secondary mb-2" onclick="joinGroup('${group.id}')">Join</button>`
                                    }
                                    <button class="btn btn-secondary" onclick="viewGroupDetails('${group.id}')">View Details</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    renderPagination();
}

// Reset Filters Function
function resetFilters() {
    // Reset search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }

    // Reset year filter
    const yearFilter = document.getElementById('yearFilter');
    if (yearFilter) {
        yearFilter.value = '';
    }

    // Reset location filter
    const locationFilter = document.getElementById('locationFilter');
    if (locationFilter) {
        locationFilter.value = '';
    }

    // Reset sort
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.value = '';
    }

    // Reset the filtered groups to show all groups
    filteredGroups = [...studyGroups];
    currentPage = 1;
    renderStudyGroups();
}

// Join Group Function
async function joinGroup(groupId) {
    try {
        const group = studyGroups.find(g => g.createdAt === groupId);
        if (!group) return;

        if (group.members.length >= group.maxMembers) {
            showError('This group is full');
            return;
        }

        const newMember = {
            userEmail: 'current.user@example.com', // In a real app, this would come from user session
            joinedAt: new Date().toISOString()
        };

        const response = await fetch( Join_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMember)
              
        });

        if (!response.ok) {
            throw new Error('Failed to join group');
        }

        // Refresh the groups data
        fetchStudyGroups();

    } catch (error) {
        showError('Failed to join group');
        console.error('Error:', error);
    }
}

// Form Validation
function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    
    // Reset previous errors
    clearFormErrors();
    
    // Validate fields
    let isValid = true;
    const errors = {};

    // Group name validation
    const groupName = formData.get('groupname');
    if (!groupName || groupName.length < 3) {
        errors.groupname = 'Group name must be at least 3 characters long';
        isValid = false;
    }

    // Subject code validation
    const subjectCode = formData.get('subject');
    if (!subjectCode || subjectCode.trim() === '') {
        errors.subject = 'Subject code cannot be empty';
        isValid = false;
    } 

    // Year validation
    const year = formData.get('year');
    if (!year || year.trim() === '') {
        errors.year = 'Please select an academic year';
        isValid = false;
    }

    // Location validation
    const location = formData.get('location');
    if (!location || location.trim() === '') {
        errors.location = 'Please select a location';
        isValid = false;
    }

    // Description validation
    const description = formData.get('description');
    if (!description || description.trim().length === 0) {
        errors.description = 'Description cannot be empty';
        isValid = false;
    }

    // Member count validation
    const maxMembers = parseInt(formData.get('maxMembers'));
    if (isNaN(maxMembers) || maxMembers < 2 || maxMembers > 20) {
        errors.maxMembers = 'Member count must be between 2 and 20';
        isValid = false;
    }

    if (!isValid) {
        displayFormErrors(errors);
        return;
    }

    // If validation passes, create new study group
    createStudyGroup(formData);
}

// Create Study Group
async function createStudyGroup(formData) {
    try {
        showLoader();
        const newGroup = {
            groupName: formData.get('groupname'),
            subjectCode: formData.get('subject'),
            year: formData.get('year'),
            location: formData.get('location'),
            maxMembers: parseInt(formData.get('maxMembers')),
            description: formData.get('description'),
            creatorEmail: 'current.user@example.com', // In a real app, this would come from user session
            members: [],
            comments: [],
        };

        const response = await fetch(POST_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newGroup)
        });

         //  TESTING to see the backend response
    //   const rawResponse = await response.text();  // Get the response as plain text first
    //     console.log('Raw response:', rawResponse);
    //     const result = JSON.parse(rawResponse); // Use JSON.parse directly
    //     console.log('Backend response:', result);

    //     if (!response.ok|| result.error) {
    //         throw new Error('Failed to create study group');
    //     }

        // Show success message
        document.getElementById('successMessage').style.display = 'block';
        
        // Reset form
        document.getElementById('createGroupForm').reset();

        // Redirect to main page after 2 seconds
        setTimeout(() => {
            window.location.href = '../studyGroup-finder/pro.html';
        }, 2000);

    } catch (error) {
        showError('Failed to create study group');
        console.error('Error:', error);
    } finally {
        hideLoader();
    }
}

// UI Feedback Functions
function showLoader() {
    isLoading = true;
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'block';
    }
}

function hideLoader() {
    isLoading = false;
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function displayFormErrors(errors) {
    Object.entries(errors).forEach(([field, message]) => {
        const input = document.querySelector(`[name="${field}"]`);
        if (input) {
            // Add the is-invalid class to show the Bootstrap validation styling
            input.classList.add('is-invalid');
            
            // Find the existing invalid-feedback div or create a new one
            let feedbackDiv = input.nextElementSibling;
            if (!feedbackDiv || !feedbackDiv.classList.contains('invalid-feedback')) {
                feedbackDiv = document.createElement('div');
                feedbackDiv.className = 'invalid-feedback';
                input.parentNode.insertBefore(feedbackDiv, input.nextSibling);
            }
            
            // Set the error message
            feedbackDiv.textContent = message;
        }
    });
}

function clearFormErrors() {
    // Remove is-invalid classes
    const invalidInputs = document.querySelectorAll('.is-invalid');
    invalidInputs.forEach(input => {
        input.classList.remove('is-invalid');
    });
    
    // Clear error messages
    const errorElements = document.querySelectorAll('.invalid-feedback');
    errorElements.forEach(element => {
        element.textContent = '';
    });
}


// View Details Function
function viewGroupDetails(groupId) {
    console.log('beforeeeeeeee',groupId)

    let  group = studyGroups.find(g => g.id.stringify == groupId.stringify);
    for(let i=0;i<studyGroups.length;i++){
        if (studyGroups[i].id==parseInt(groupId)){
                group=studyGroups[i];
        }
    }
    if (!group){return;}
    try{if (group) console.log('group') }catch(error) {
        showError('Failed to fetch study groups');
        console.error('Error:', error);}
    console.log('b55e',groupId)
    // Store group data in sessionStorage for the details page

    sessionStorage.setItem('selectedGroup', JSON.stringify(group));

    console.log('6',groupId)

    
    // Redirect to view page
    window.location.href = `../strudyGroup-view/ViewGroup.html?id=${(groupId)}`;
    console.log('1000e',groupId)
}

// Initialize on page load
window.changePage = changePage; // Make changePage available globally
