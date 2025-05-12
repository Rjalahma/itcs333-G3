(async function() {
  // Replace this with your Replit URL
  const API_BASE_URL = 'https://86192ebf-d466-4541-a066-8b98fc7e6e91-00-2h3krvsw2dynb.pike.replit.dev';
  
  // Helper functions
  function getId() {
    return new URLSearchParams(location.search).get('id');
  }
  
  function formatDate(d) {
    return new Date(d).toLocaleDateString();
  }
  
  function formatDateTime(d) {
    return new Date(d).toLocaleString();
  }
  
  function showLoader() {
    // You could add a loading indicator here
    console.log('Loading...');
  }
  
  function hideLoader() {
    // Hide loading indicator
    console.log('Loading complete');
  }
  
  function showError(message) {
    alert(message || 'An error occurred');
  }
  
  // Get note ID from URL
  const noteId = getId();
  if (!noteId) {
    showError('Note ID not provided');
    window.location.href = 'course-note-main.html';
    return;
  }
  
  let note;
  
  // Elements
  const viewMode = document.getElementById('viewMode');
  const editForm = document.getElementById('editMode');
  const fieldsView = {
    title:  document.getElementById('detailTitle'),
    course: document.getElementById('detailCourse'),
    dept:   document.getElementById('detailDept'),
    date:   document.getElementById('detailDate'),
    desc:   document.getElementById('detailDesc'),
    dl:     document.getElementById('detailDownload'),
  };
  const fieldsEdit = {
    title:  document.getElementById('editTitle'),
    course: document.getElementById('editCourse'),
    dept:   document.getElementById('editDept'),
    date:   document.getElementById('editDate'),
    desc:   document.getElementById('editDesc'),
  };
  const commentsContainer = document.getElementById('commentsContainer');
  const commentForm = document.getElementById('commentForm');
  
  // Fetch the note details
  async function fetchNote() {
    showLoader();
    try {
      const response = await fetch(`${API_BASE_URL}/get_note.php?id=${noteId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to load note');
      }
      note = await response.json();
      populateView();
      hideLoader();
    } catch (error) {
      hideLoader();
      showError(error.message);
      console.error(error);
    }
  }
  
  // Fetch comments for the note
  async function fetchComments() {
    showLoader();
    try {
      const response = await fetch(`${API_BASE_URL}/get_comments.php?note_id=${noteId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to load comments');
      }
      const comments = await response.json();
      
      // Clear comments container
      commentsContainer.innerHTML = '';
      
      if (comments.length === 0) {
        commentsContainer.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
        return;
      }
      
      // Add comments to the container
      comments.forEach(comment => {
        const commentBox = document.createElement('div');
        commentBox.className = 'comment-box';
        commentBox.dataset.id = comment.id;
        commentBox.innerHTML = `
          <div class="d-flex justify-content-between">
            <h6>${comment.name} <small class="text-muted">on ${formatDateTime(comment.created_at)}</small></h6>
            <button class="btn btn-sm btn-outline-danger delete-comment">×</button>
          </div>
          <p>${comment.comment}</p>
        `;
        commentsContainer.appendChild(commentBox);
      });
      
      // Add event listeners to delete buttons
      document.querySelectorAll('.delete-comment').forEach(button => {
        button.addEventListener('click', deleteComment);
      });
      
      hideLoader();
    } catch (error) {
      hideLoader();
      console.error(error);
    }
  }
  
  // Populate view with note data
  function populateView() {
    fieldsView.title.textContent = note.title;
    fieldsView.course.textContent = note.course;
    fieldsView.dept.textContent = note.department;
    fieldsView.date.textContent = formatDate(note.publishedDate);
    fieldsView.desc.textContent = note.description;
    fieldsView.dl.href = note.url;
  }
  
  
  // Populate form with note data
  function populateForm() {
    fieldsEdit.title.value = note.title;
    fieldsEdit.course.value = note.course;
    fieldsEdit.dept.value = note.department;
    fieldsEdit.date.value = note.publishedDate;
    fieldsEdit.desc.value = note.description;
  }
  
  // Update note in the database
  async function updateNote(updatedNote) {
    showLoader();
    try {
      const response = await fetch(`${API_BASE_URL}/update_note.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNote)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update note');
      }
      
      note = await response.json();
      populateView();
      hideLoader();
      alert('Note updated successfully!');
    } catch (error) {
      hideLoader();
      showError(error.message);
      console.error(error);
    }
  }
  
  // Delete note from the database
  async function deleteNoteFromDB() {
    showLoader();
    try {
      const response = await fetch(`${API_BASE_URL}/delete_note.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: noteId })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete note');
      }
      
      hideLoader();
      alert('Note deleted successfully!');
      window.location.href = 'course-note-main.html';
    } catch (error) {
      hideLoader();
      showError(error.message);
      console.error(error);
    }
  }
  
  // Add a comment
  async function addComment(e) {
    e.preventDefault();
    
    const name = document.getElementById('commentName').value.trim();
    const comment = document.getElementById('commentInput').value.trim();
    
    if (!name || !comment) {
      showError('Please enter your name and comment');
      return;
    }
    
    showLoader();
    try {
      const response = await fetch(`${API_BASE_URL}/create_comment.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          note_id: noteId,
          name: name,
          comment: comment
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add comment');
      }
      
      // Clear form
      e.target.reset();
      
      // Refresh comments
      fetchComments();
      hideLoader();
    } catch (error) {
      hideLoader();
      showError(error.message);
      console.error(error);
    }
  }
  
  // Delete a comment
  async function deleteComment(e) {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    const commentBox = e.target.closest('.comment-box');
    const commentId = commentBox.dataset.id;
    
    showLoader();
    try {
      const response = await fetch(`${API_BASE_URL}/delete_comment.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: commentId })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete comment');
      }
      
      commentBox.remove();
      hideLoader();
    } catch (error) {
      hideLoader();
      showError(error.message);
      console.error(error);
    }
  }
  
  // Initialize
  fetchNote();
  fetchComments();
  
  // Event Listeners
  document.getElementById('editBtn').addEventListener('click', () => {
    viewMode.style.display = 'none';
    editForm.style.display = 'block';
    populateForm();
  });
  
  document.getElementById('cancelBtn').addEventListener('click', () => {
    editForm.style.display = 'none';
    viewMode.style.display = 'block';
  });
  
  editForm.addEventListener('submit', e => {
    e.preventDefault();
    
    const updatedNote = {
      id: noteId,
      title: fieldsEdit.title.value.trim(),
      description: fieldsEdit.desc.value.trim(),
      department: fieldsEdit.dept.value,
      course: fieldsEdit.course.value.trim(),
      publishedDate: fieldsEdit.date.value
    };
    
    updateNote(updatedNote);
    editForm.style.display = 'none';
    viewMode.style.display = 'block';
  });
  
  document.getElementById('deleteBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      deleteNoteFromDB();
    }
  });
  
  commentForm.addEventListener('submit', addComment);
})();
