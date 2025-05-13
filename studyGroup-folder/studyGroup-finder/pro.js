let allGroups = [];

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("studyGroupsContainer");
    const loader = document.getElementById("loader");
    const errorMessage = document.getElementById("errorMessage");

    loader.style.display = "block";

    fetch("get_groups.php")
        .then(response => response.json())
        .then(groups => {
            loader.style.display = "none";

            if (!Array.isArray(groups)) {
                errorMessage.textContent = "Failed to load study groups.";
                errorMessage.style.display = "block";
                return;
            }

            allGroups = groups;
            renderGroups(allGroups);
        })
        .catch(error => {
            loader.style.display = "none";
            errorMessage.textContent = "An error occurred while loading groups.";
            errorMessage.style.display = "block";
            console.error("Fetch error:", error);
        });

    // Event listeners for search, filter, and sort
    document.getElementById("searchInput").addEventListener("input", applyFilters);
    document.getElementById("yearFilter").addEventListener("change", applyFilters);
    document.getElementById("locationFilter").addEventListener("change", applyFilters);
    document.getElementById("sortSelect").addEventListener("change", applyFilters);
});

function applyFilters() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const yearFilter = document.getElementById("yearFilter").value;
    const locationFilter = document.getElementById("locationFilter").value;
    const sortOption = document.getElementById("sortSelect").value;

    let filteredGroups = allGroups.filter(group => {
        const matchesSearch = group.group_name.toLowerCase().includes(searchInput) ||
                              group.subject_code.toLowerCase().includes(searchInput);
        const matchesYear = !yearFilter || group.year === yearFilter;
        const matchesLocation = !locationFilter || group.location === locationFilter;
        return matchesSearch && matchesYear && matchesLocation;
    });

    // Sorting
    if (sortOption === "newest") {
        filteredGroups.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortOption === "oldest") {
        filteredGroups.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortOption === "alphabetical") {
        filteredGroups.sort((a, b) => a.group_name.localeCompare(b.group_name));
    }

    renderGroups(filteredGroups);
}

function renderGroups(groups) {
    const container = document.getElementById("studyGroupsContainer");

    if (groups.length === 0) {
        container.innerHTML = "<p>No study groups match your criteria.</p>";
        return;
    }

    container.innerHTML = groups.map(group => `
        <div class="col-md-4 mb-4">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">${group.group_name}</h5>
                    <p class="card-text"><strong>Subject:</strong> ${group.subject_code}</p>
                    <p class="card-text"><strong>Year:</strong> ${group.year}</p>
                    <p class="card-text"><strong>Location:</strong> ${group.location}</p>
                    <p class="card-text"><strong>Members:</strong> ${group.memberCount}/${group.max_members}</p>
                    <a href="viewgroup.html?id=${group.id}" class="btn btn-primary">View Details</a>
                </div>
            </div>
        </div>
    `).join('');
}

function resetFilters() {
    document.getElementById("searchInput").value = "";
    document.getElementById("yearFilter").value = "";
    document.getElementById("locationFilter").value = "";
    document.getElementById("sortSelect").value = "";
    applyFilters();
}
