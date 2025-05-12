(() => {
  const API_BASE_URL = 'https://86192ebf-d466-4541-a066-8b98fc7e6e91-00-2h3krvsw2dynb.pike.replit.dev';
  let currentPage = 1;
  const notesPerPage = 3;

  // DOM refs
  let notesList, searchInput, deptFilter, sortSelect, noteForm;
  let prevBtn, nextBtn, pageInfo;
  let allNotes = [];

  function formatDate(d) {
    return new Date(d).toLocaleDateString();
  }

  function showLoader() {
    notesList.innerHTML =
      '<div class="text-center"><div class="spinner-border" role="status"></div></div>';
  }

  function showError(msg) {
    notesList.innerHTML = `<div class="alert alert-danger">${msg}</div>`;
  }

  async function fetchNotes() {
    showLoader();
    try {
      const res  = await fetch(`${API_BASE_URL}/create_note.php`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      showError('Server returned invalid data. Check console.');
      console.error(err);
      return [];
    }
  }

  function renderNotes(notes) {
    if (!notes.length) {
      notesList.innerHTML = '<div class="alert alert-info">No notes found</div>';
      return;
    }
    notesList.innerHTML = '';
    notes.forEach(n => {
      const card = document.createElement('div');
      card.className = 'col-md-4';
      card.innerHTML = `
        <div class="card course-note-card h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${n.title}</h5>
            
            <h6 class="card-subtitle mb-2 text-muted">
              ${n.course} – ${n.department}
            </h6>
            <p class="card-text flex-grow-1">
              ${n.description.slice(0, 100)}${n.description.length > 100 ? '…' : ''}
            </p>
            <p class="card-text">
              <small class="text-muted">Published on ${formatDate(n.publishedDate)}</small>
            </p>
           
              <a href="course-note-details.html?id=${n.id}" 
                 class="btn btn-primary mt-auto">
                View Details
              </a>
           
          </div>
        </div>
      `;
      notesList.appendChild(card);
    });
  }

  function filterAndSort(notes) {
    let filtered = [...notes];
    const term   = searchInput.value.toLowerCase();
    const dept   = deptFilter.value;
    const sortBy = sortSelect.value;

    if (term) {
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(term) ||
        n.description.toLowerCase().includes(term) ||
        n.course.toLowerCase().includes(term)
      );
    }
    if (dept) {
      filtered = filtered.filter(n => n.department === dept);
    }
    if (sortBy === 'date_newest') {
      filtered.sort((a, b) =>
        new Date(b.publishedDate) - new Date(a.publishedDate)
      );
    } else if (sortBy === 'date_oldest') {
      filtered.sort((a, b) =>
        new Date(a.publishedDate) - new Date(b.publishedDate)
      );
    }
    return filtered;
  }

  function renderPagination(notes) {
    const totalPages = Math.max(Math.ceil(notes.length / notesPerPage), 1);
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * notesPerPage;
    renderNotes(notes.slice(start, start + notesPerPage));
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  async function createNote(formData) {
    try {
      const res = await fetch(`${API_BASE_URL}/create_note.php`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create note');
      }
      return await res.json();
    } catch (e) {
      showError(e.message);
      console.error(e);
      return null;
    }
  }

  async function init() {
    // grab elements
    notesList   = document.getElementById('notes-list');
    searchInput = document.getElementById('searchInput');
    deptFilter  = document.getElementById('deptFilter');
    sortSelect  = document.getElementById('sortBy');
    noteForm    = document.getElementById('noteForm');
    prevBtn     = document.getElementById('prevBtn');
    nextBtn     = document.getElementById('nextBtn');
    pageInfo    = document.getElementById('pageInfo');

    allNotes = await fetchNotes();

    // populate department filter
    const uniqDepts = [...new Set(allNotes.map(n => n.department))];
    uniqDepts.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d;
      deptFilter.appendChild(opt);
    });

    renderPagination(allNotes);

    // filter/sort listeners
    const updateDisplay = () => {
      currentPage = 1;
      renderPagination(filterAndSort(allNotes));
    };
    searchInput.addEventListener('input', updateDisplay);
    deptFilter.addEventListener('change', updateDisplay);
    sortSelect.addEventListener('change', updateDisplay);

    // pagination buttons
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderPagination(filterAndSort(allNotes));
      }
    });
    nextBtn.addEventListener('click', () => {
      const filtered = filterAndSort(allNotes);
      const totalPages = Math.ceil(filtered.length / notesPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderPagination(filtered);
      }
    });

    // remove-file button
    document
      .querySelector('#createNoteModal .btn-outline-danger')
      .addEventListener('click', () => {
        document.getElementById('noteFile').value = '';
      });

    // form submit
    noteForm.addEventListener('submit', async e => {
      e.preventDefault();
      const formData = new FormData(noteForm);

      if (!formData.get('noteTitle').trim() ||
          !formData.get('noteCourse').trim() ||
          !formData.get('department')) {
        return alert('Please fill out all required fields.');
      }

      showLoader();
      const newNote = await createNote(formData);
      if (newNote) {
        allNotes.push(newNote);
        const filtered = filterAndSort(allNotes);
        currentPage = Math.ceil(filtered.length / notesPerPage);
        renderPagination(filtered);
        noteForm.reset();
        bootstrap.Modal.getInstance(
          document.getElementById('createNoteModal')
        )?.hide();
        alert('Note added successfully!');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
