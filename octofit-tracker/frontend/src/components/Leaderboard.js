import React, { useEffect, useState } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const codespace = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespace
    ? `https://${codespace}-8000.app.github.dev/api/leaderboard/`
    : 'http://localhost:8000/api/leaderboard/';

  useEffect(() => {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setLeaderboard(results);
      })
      .catch(err => console.error('Error fetching leaderboard:', err));
  }, [apiUrl]);

  const filtered = leaderboard.filter(entry => {
    if (!search.trim()) return true;
    const normalized = search.toLowerCase();
    return (
      String(entry.team).toLowerCase().includes(normalized) ||
      String(entry.points).toLowerCase().includes(normalized)
    );
  });

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h2 className="h4 mb-0">Leaderboard</h2>
        <button className="btn btn-success btn-sm" onClick={() => setShowModal(true)}>
          Add Leaderboard Entry
        </button>
      </div>
      <div className="card-body">
        <form className="row g-2 mb-3" onSubmit={e => e.preventDefault()}>
          <div className="col-md-8">
            <label className="form-label" htmlFor="searchEntry">Filter</label>
            <input
              id="searchEntry"
              className="form-control"
              type="text"
              placeholder="Search team or points"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <button className="btn btn-outline-secondary w-100" onClick={() => setSearch('')}>
              Clear
            </button>
          </div>
        </form>

        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-light">
              <tr>
                <th scope="col">Rank</th>
                <th scope="col">Team</th>
                <th scope="col">Points</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-3">No leaderboard entries found</td>
                </tr>
              ) : (
                filtered
                  .slice()
                  .sort((a, b) => (b.points || 0) - (a.points || 0))
                  .map((entry, idx) => (
                    <tr key={entry._id || idx}>
                      <td>{entry.rank || idx + 1}</td>
                      <td>{entry.team || 'Unknown'}</td>
                      <td>{entry.points ?? 0}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        <p className="mb-0">
          <button type="button" className="btn btn-link p-0" onClick={() => {}}>
            Leaderboard API: {apiUrl}
          </button>
        </p>
      </div>

      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Leaderboard Modal</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">This modal is a UI placeholder. Add entries through API or admin.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
