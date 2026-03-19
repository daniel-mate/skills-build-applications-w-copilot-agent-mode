import React, { useEffect, useState } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const codespace = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespace
    ? `https://${codespace}-8000.app.github.dev/api/activities/`
    : 'http://localhost:8000/api/activities/';

  useEffect(() => {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setActivities(results);
      })
      .catch(err => console.error('Error fetching activities:', err));
  }, [apiUrl]);

  const filtered = activities.filter(activity => {
    if (!search.trim()) return true;
    const normalized = search.toLowerCase();
    return (
      String(activity.user).toLowerCase().includes(normalized) ||
      String(activity.type).toLowerCase().includes(normalized) ||
      String(activity.duration).toLowerCase().includes(normalized)
    );
  });

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h2 className="h4 mb-0">Activities</h2>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => setShowModal(true)}
        >
          Add Activity
        </button>
      </div>
      <div className="card-body">
        <form className="row g-2 mb-3" onSubmit={e => e.preventDefault()}>
          <div className="col-md-8">
            <label className="form-label" htmlFor="searchActivity">Search activities</label>
            <input
              id="searchActivity"
              className="form-control"
              type="text"
              placeholder="Enter user, type, or duration"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={() => setSearch('')}
            >
              Clear Filter
            </button>
          </div>
        </form>

        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-light">
              <tr>
                <th scope="col">User</th>
                <th scope="col">Type</th>
                <th scope="col">Duration (min)</th>
                <th scope="col">Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-3">No activities found</td>
                </tr>
              ) : (
                filtered.map((activity, idx) => (
                  <tr key={activity._id || idx}>
                    <td>{activity.user || 'Unknown'}</td>
                    <td>{activity.type || 'Unknown'}</td>
                    <td>{activity.duration || '-'}</td>
                    <td>{activity.created_at || activity.timestamp || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="mb-0">
          <button type="button" className="btn btn-link p-0" onClick={() => {}}>
            Activity API: {apiUrl}
          </button>
        </p>
      </div>

      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add new activity</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">Use API or admin panel to add a new activity entry.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
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

export default Activities;
