(async function() {
  function getId() {
    const params = new URLSearchParams(location.search);
    return params.get('id');
  }
  function formatDate(d) {
    return new Date(d).toLocaleDateString();
  }
  const id = getId();
  console.log('Detail script loaded, id=', id);
  if (!id) return;
  try {
    const res = await fetch('notes.json');
    if (!res.ok) throw new Error(res.statusText);
    const notes = await res.json();
    const note = notes.find(n => String(n.id) === id);
    if (!note) {
      console.error('Note not found for id', id);
      return;
    }
    document.getElementById('detailTitle').textContent = note.title;
    document.getElementById('detailCourse').textContent = note.course || '';
    document.getElementById('detailDept').textContent = note.department;
    document.getElementById('detailDate').textContent = formatDate(note.publishedDate);
    document.getElementById('detailDesc').textContent = note.description;
    document.getElementById('detailDownload').href = note.url;
  } catch (e) {
    console.error('Failed to load note details', e);
  }
  document.getElementById('commentForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('commentName').value;
    const text = document.getElementById('commentInput').value;
    const box = document.createElement('div');
    box.className = 'comment-box';
    box.innerHTML = `<h6>${name} <small class="text-muted">on ${new Date().toLocaleDateString()}</small></h6><p>${text}</p>`;
    document.getElementById('commentsContainer').prepend(box);
    e.target.reset();
  });
})();