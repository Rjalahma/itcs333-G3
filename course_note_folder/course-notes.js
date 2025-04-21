class CourseNotes {
    constructor() {
      this.notes = [];
      this.filtered = [];
      this.currentPage = 1;
      this.perPage = 6;
      this.listEl = document.getElementById('notes-list');
      this.searchInput = document.getElementById('searchInput');
      this.deptFilter = document.getElementById('deptFilter');
      this.sortSelect = document.getElementById('sortBy');
      this.prevBtn = document.getElementById('prevBtn');
      this.nextBtn = document.getElementById('nextBtn');
      this.pageInfo = document.getElementById('pageInfo');
      document.addEventListener('DOMContentLoaded', () => this.init());
    }
    async init() {
      this.bindEvents();
      await this.loadNotes();
      this.applyAll();
    }
    bindEvents() {
      this.searchInput.addEventListener('input', () => this.onFilterChange());
      this.deptFilter.addEventListener('change', () => this.onFilterChange());
      this.sortSelect.addEventListener('change', () => this.onFilterChange());
      this.prevBtn.addEventListener('click', () => this.changePage(this.currentPage - 1));
      this.nextBtn.addEventListener('click', () => this.changePage(this.currentPage + 1));
    }
    async loadNotes() {
      try {
        const res = await fetch('notes.json');
        if (!res.ok) throw new Error(res.statusText);
        this.notes = await res.json();
      } catch (e) {
        console.error('Failed to load notes', e);
      }
    }
    onFilterChange() {
      this.currentPage = 1;
      this.applyAll();
    }
    applyAll() {
      this.filtered = this.filterAndSort(this.notes);
      this.renderList();
      this.renderPagination();
    }
    filterAndSort(data) {
      let out = data.filter(n => {
        const term = this.searchInput.value.toLowerCase();
        return n.title.toLowerCase().includes(term) || n.department.toLowerCase().includes(term);
      });
      if (this.deptFilter.value) out = out.filter(n => n.department === this.deptFilter.value);
      if (this.sortSelect.value === 'date_newest') {
        out.sort((a,b)=> new Date(b.publishedDate) - new Date(a.publishedDate));
      } else if (this.sortSelect.value === 'date_oldest') {
        out.sort((a,b)=> new Date(a.publishedDate) - new Date(b.publishedDate));
      }
      return out;
    }
    renderList() {
      this.listEl.innerHTML = '';
      const start = (this.currentPage - 1) * this.perPage;
      const pageItems = this.filtered.slice(start, start + this.perPage);
      pageItems.forEach(n => {
        const col = document.createElement('div'); col.className = 'col-md-4';
        col.innerHTML = `
          <div class="card course-note-card h-100">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${n.title}</h5>
              <p class="card-text">${n.description}</p>
              <h6 class="card-text">Published on: ${new Date(n.publishedDate).toLocaleDateString()}</h6>
              <a href="${n.url}" class="btn btn-primary mt-auto">View Details</a>
            </div>
          </div>`;
        this.listEl.append(col);
      });
    }
    renderPagination() {
      const total = Math.ceil(this.filtered.length / this.perPage);
      this.pageInfo.textContent = `Page ${this.currentPage} of ${total}`;
      this.prevBtn.disabled = this.currentPage === 1;
      this.nextBtn.disabled = this.currentPage === total;
    }
    changePage(page) {
      if (page < 1 || page > Math.ceil(this.filtered.length / this.perPage)) return;
      this.currentPage = page;
      this.applyAll();
    }
  }
  new CourseNotes();