import React, { useEffect, useState } from 'react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const codespace = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespace
    ? `https://${codespace}-8000.app.github.dev/api/workouts/`
    : 'http://localhost:8000/api/workouts/';

  useEffect(() => {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setWorkouts(results);
      })
      .catch(err => console.error('Error fetching workouts:', err));
  }, [apiUrl]);

  const filtered = workouts.filter(workout => {
    if (!search.trim()) return true;
    const normalized = search.toLowerCase();
    return (
      String(workout.name).toLowerCase().includes(normalized) ||
      String(workout.description).toLowerCase().includes(normalized) ||
      String(workout.difficulty).toLowerCase().includes(normalized)
    );
  });

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h2 className="h4 mb-0">Workouts</h2>
        <button className="btn btn-secondary btn-sm" onClick={() => setShowModal(true)}>
          Add Workout
        </button>
      </div>
      <div className="card-body">
        <form className="row g-2 mb-3" onSubmit={e => e.preventDefault()}>
          <div className="col-md-8">
            <label className="form-label" htmlFor="searchWorkout">Search workouts</label>
            <input
              id="searchWorkout"
              className="form-control"
              type="text"
              placeholder="Name, description, difficulty"
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
                <th scope="col">Description</th>
                <th scope="col">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-3">No workouts found</td>
                </tr>
              ) : (
                filtered.map((workout, idx) => (
                  <tr key={workout._id || idx}>
                    <td>{workout.name || 'Unnamed'}</td>
                    <td>{workout.description || '-'}</td>
                    <td>{workout.difficulty || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="mb-0">
          <button type="button" className="btn btn-link p-0" onClick={() => {}}>
            Workouts API: {apiUrl}
          </button>
        </p>
      </div>

      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Workout Modal</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">Create workouts through backend endpoints and refresh data.</p>
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

export default Workouts;
