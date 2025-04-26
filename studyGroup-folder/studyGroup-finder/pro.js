// Constants
const API_URL = 'https://680bd98c2ea307e081d28408.mockapi.io/studyGroups';
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
            case 'name':
                return a.groupName.localeCompare(b.groupName);
            case 'subject':
                return a.subjectCode.localeCompare(b.subjectCode);
            case 'members':
                return a.members.length - b.members.length;
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

    for (let i = 1; i <= pageCount; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
            </li>
        `;
    }

    paginationElement.innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    renderStudyGroups();
}

// Rendering Functions
function renderStudyGroups() {
    const container = document.getElementById('studyGroupsContainer');
    if (!container) return;

    const pageItems = getPageItems();
    
    container.innerHTML = pageItems.map(group => `
        <div class="col-md-4 mb-4">
            <div class="group-finder-card">
                <div class="card-body">
                    <h5>${group.groupName}</h5>
                    <p>Subject: ${group.subjectCode}</p>
                    <p>Location: ${group.location}</p>
                    <p>Members: ${group.members.length}/${group.maxMembers}</p>
                    <p>Year: ${group.year}</p>
                    <button class="btn btn-secondary" onclick="viewGroupDetails('${group.createdAt}')">View Details</button>
                </div>
            </div>
        </div>
    `).join('');

    renderPagination();
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
        errors.groupName = 'Group name must be at least 3 characters long';
        isValid = false;
    }

    // Subject code validation
    const subjectCode = formData.get('subject');
    if (!subjectCode || !/^[A-Z]{4}\d{3}$/.test(subjectCode)) {
        errors.subjectCode = 'Invalid subject code format (e.g., ITCS333)';
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
            createdAt: new Date().toISOString()
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newGroup)
        });

        if (!response.ok) {
            throw new Error('Failed to create study group');
        }

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

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => element.remove());
}

function displayFormErrors(errors) {
    Object.entries(errors).forEach(([field, message]) => {
        const input = document.querySelector(`[name="${field}"]`);
        if (input) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = 'red';
            errorDiv.textContent = message;
            input.parentNode.insertBefore(errorDiv, input.nextSibling);
        }
    });
}

// View Details Function
function viewGroupDetails(groupId) {
    const group = studyGroups.find(g => g.createdAt === groupId);
    if (!group) return;

    // Store group data in sessionStorage for the details page
    sessionStorage.setItem('selectedGroup', JSON.stringify(group));
    
    // Redirect to view page
    window.location.href = `../strudyGroup-view/ViewGroup.html?id=${encodeURIComponent(groupId)}`;
}

// Initialize on page load
window.changePage = changePage; // Make changePage available globally
