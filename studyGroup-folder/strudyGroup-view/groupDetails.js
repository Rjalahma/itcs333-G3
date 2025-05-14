document.addEventListener('DOMContentLoaded', function () {
    const groupId = new URLSearchParams(window.location.search).get('group_id');  // Get the group_id from URL

    if (groupId) {
        // Show loader while fetching data
        document.getElementById('loader').style.display = 'block';

        // Fetch group details from PHP file
        fetch(`groupDetails.php?group_id=${groupId}`)
            .then(response => response.json())
            .then(data => {
                // Hide loader
                document.getElementById('loader').style.display = 'none';

                if (data.error) {
                    document.getElementById('errorMessage').textContent = data.error;
                    document.getElementById('errorMessage').style.display = 'block';
                } else {
                    // Populate group details
                    document.getElementById('groupName').textContent = data.group_name;
                    document.getElementById('description').textContent = data.description;
                    document.getElementById('subjectCode').textContent = data.subject_code;
                    document.getElementById('year').textContent = data.year;
                    document.getElementById('location').textContent = data.location;
                    document.getElementById('members').textContent = `${data.members.length}/${data.max_members}`;
                    document.getElementById('creator').textContent = data.creator_email;

                    // Display comments
                    const commentsContainer = document.getElementById('commentsContainer');
                    commentsContainer.innerHTML = data.comments.map(comment => `
                        <p class="comment-card p">
                            <strong>${comment.user_name}:</strong> ${comment.message}
                            <small class="text-muted d-block">${new Date(comment.posted_at).toLocaleString()}</small>
                        </p>
                    `).join('');
                }
            })
            .catch(error => {
                document.getElementById('loader').style.display = 'none';
                document.getElementById('errorMessage').textContent = 'Failed to fetch group details.';
                document.getElementById('errorMessage').style.display = 'block';
            });
    } else {
        document.getElementById('errorMessage').textContent = 'No group ID provided.';
        document.getElementById('errorMessage').style.display = 'block';
    }
});
