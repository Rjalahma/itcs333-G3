(async function() {
  function getId() {
    return new URLSearchParams(location.search).get('id');
  }
  function formatDate(d) {
    return new Date(d).toLocaleDateString();
  }

  const id = getId();
  if (!id) return;
  let note;
  try {
    const res = await fetch('notes.json');
    if (!res.ok) throw new Error(res.statusText);
    const notes = await res.json();
    note = notes.find(n => String(n.id) === id);
    if (!note) throw new Error('Note not found');
  } catch (e) {
    console.error(e);
    return;
  }

  // Elements
  const viewMode   = document.getElementById('viewMode');
  const editForm   = document.getElementById('editMode');
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

  // Populate view
  function populateView() {
    fieldsView.title.textContent  = note.title;
    fieldsView.course.textContent = note.course;
    fieldsView.dept.textContent   = note.department;
    fieldsView.date.textContent   = formatDate(note.publishedDate);
    fieldsView.desc.textContent   = note.description;
    fieldsView.dl.href            = note.url;
  }
  // Populate form
  function populateForm() {
    fieldsEdit.title.value  = note.title;
    fieldsEdit.course.value = note.course;
    fieldsEdit.dept.value   = note.department;
    fieldsEdit.date.value   = note.publishedDate;
    fieldsEdit.desc.value   = note.description;
  }

  populateView();

  // Edit button
  document.getElementById('editBtn').addEventListener('click', () => {
    viewMode.style.display = 'none';
    editForm.style.display = 'block';
    populateForm();
  });

  // Cancel
  document.getElementById('cancelBtn').addEventListener('click', () => {
    editForm.style.display = 'none';
    viewMode.style.display = 'block';
  });

  // Save
  editForm.addEventListener('submit', e => {
    e.preventDefault();
    note.title          = fieldsEdit.title.value.trim();
    note.course         = fieldsEdit.course.value.trim();
    note.department     = fieldsEdit.dept.value;
    note.publishedDate  = fieldsEdit.date.value;
    note.description    = fieldsEdit.desc.value.trim();
    populateView();
    editForm.style.display = 'none';
    viewMode.style.display = 'block';
    alert('Note updated!');
  });

  // Delete
  document.getElementById('deleteBtn').addEventListener('click', () => {
    if (confirm('Delete this note?')) {
      alert('Note deleted.');
      window.location.href = 'course-note-main.html';
    }
  });

  document.getElementById('commentForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('commentName').value;
    const text = document.getElementById('commentInput').value;
    const box  = document.createElement('div');
    box.className = 'comment-box';
    box.innerHTML = `<h6>${name} <small class="text-muted">on ${formatDate(Date.now())}</small></h6><p>${text}</p>`;
    document.getElementById('commentsContainer').prepend(box);
    e.target.reset();
  });
})();
