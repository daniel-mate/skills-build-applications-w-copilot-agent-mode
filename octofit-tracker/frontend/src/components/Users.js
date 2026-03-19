import React, { useEffect, useState } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const codespace = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespace
    ? `https://${codespace}-8000.app.github.dev/api/users/`
    : 'http://localhost:8000/api/users/';

  useEffect(() => {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setUsers(results);
      })
      .catch(err => console.error('Error fetching users:', err));
  }, [apiUrl]);

  const filtered = users.filter(user => {
    if (!search.trim()) return true;
    const normalized = search.toLowerCase();
    return (
      String(user.name).toLowerCase().includes(normalized) ||
      String(user.email).toLowerCase().includes(normalized) ||
      String(user.team).toLowerCase().includes(normalized)
    );
  });

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h2 className="h4 mb-0">Users</h2>
        <button className="btn btn-warning btn-sm" onClick={() => setShowModal(true)}>
          Add User
        </button>
      </div>
      <div className="card-body">
        <form className="row g-2 mb-3" onSubmit={e => e.preventDefault()}>
          <div className="col-md-8">
            <label className="form-label" htmlFor="searchUser">Search users</label>
            <input
              id="searchUser"
              className="form-control"
              type="text"
              placeholder="Name, email, or team"
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
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Team</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-3">No users available</td>
                </tr>
              ) : (
                filtered.map((user, idx) => (
                  <tr key={user._id || idx}>
                    <td>{user.name || 'Unknown'}</td>
                    <td>{user.email || '-'}</td>
                    <td>{user.team || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="mb-0">
          <button type="button" className="btn btn-link p-0" onClick={() => {}}>
            Users API: {apiUrl}
          </button>
        </p>
      </div>

      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Modal</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">Create users through backend endpoints and refresh results here.</p>
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

export default Users;
