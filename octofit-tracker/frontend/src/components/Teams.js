import React, { useEffect, useState } from 'react';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const codespace = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespace
    ? `https://${codespace}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/';

  useEffect(() => {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setTeams(results);
      })
      .catch(err => console.error('Error fetching teams:', err));
  }, [apiUrl]);

  const filtered = teams.filter(team => {
    if (!search.trim()) return true;
    const normalized = search.toLowerCase();
    return String(team.name).toLowerCase().includes(normalized);
  });

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h2 className="h4 mb-0">Teams</h2>
        <button className="btn btn-info btn-sm" onClick={() => setShowModal(true)}>
          Create Team
        </button>
      </div>
      <div className="card-body">
        <form className="row g-2 mb-3" onSubmit={e => e.preventDefault()}>
          <div className="col-md-8">
            <label className="form-label" htmlFor="searchTeam">Search teams</label>
            <input
              id="searchTeam"
              className="form-control"
              type="text"
              placeholder="Enter team name"
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
                <th scope="col">Team Name</th>
                <th scope="col">Members</th>
                <th scope="col">Created At</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-3">No teams available</td>
                </tr>
              ) : (
                filtered.map((team, idx) => (
                  <tr key={team._id || idx}>
                    <td>{team.name || 'Unnamed team'}</td>
                    <td>{team.members?.length ?? team.member_count ?? '-'}</td>
                    <td>{team.created_at || team.created || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="mb-0">
          <button type="button" className="btn btn-link p-0" onClick={() => {}}>
            Teams API: {apiUrl}
          </button>
        </p>
      </div>

      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Team Modal</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">Create a team through back-end endpoints to see it here.</p>
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

export default Teams;
