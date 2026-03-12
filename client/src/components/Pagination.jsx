export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="pagination">
      <button className="page-btn" disabled={page === 1} onClick={() => onPageChange(page - 1)}>‹</button>
      {pages.map((p, i) =>
        p === '...'
          ? <span key={i} style={{ padding: '0 4px', color: '#999' }}>…</span>
          : <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => onPageChange(p)}>{p}</button>
      )}
      <button className="page-btn" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>›</button>
    </div>
  );
}
