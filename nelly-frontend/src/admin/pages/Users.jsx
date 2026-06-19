import { useState, useEffect } from 'react';
import { usersAPI } from '../services/adminApi';
import toast from '../../utils/toast';
import { useAuth } from '../../context/AuthContext';

const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ show: false, user: null });
  const [roleModal, setRoleModal] = useState({ show: false, user: null, newRole: '' });

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        search,
        page,
        limit: 20,
      };
      const response = await usersAPI.getAll(params);
      if (response.data.success) {
        setUsers(response.data.users);
        setTotalPages(response.data.pages);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleDeleteUser = async () => {
    if (!deleteModal.user) return;

    try {
      const response = await usersAPI.delete(deleteModal.user.id);
      if (response.data.success) {
        toast.success('User deleted successfully');
        fetchUsers();
        setDeleteModal({ show: false, user: null });
      } else {
        toast.error(response.data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleUpdateRole = async () => {
    if (!roleModal.user || !roleModal.newRole) return;

    try {
      const response = await usersAPI.updateRole(roleModal.user.id, roleModal.newRole);
      if (response.data.success) {
        toast.success('User role updated successfully');
        fetchUsers();
        setRoleModal({ show: false, user: null, newRole: '' });
      } else {
        toast.error(response.data.message || 'Failed to update user role');
      }
    } catch (error) {
      console.error('Failed to update user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="users-page">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Users</h2>
          <p className="text-muted mb-0">Manage user accounts and roles</p>
        </div>
      </div>

      {/* Search */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btn-dark" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Users Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 px-4 py-3">ID</th>
                      <th className="border-0 py-3">Name</th>
                      <th className="border-0 py-3">Email</th>
                      <th className="border-0 py-3">Role</th>
                      <th className="border-0 py-3">Joined</th>
                      <th className="border-0 py-3 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-4 py-3 fw-semibold">#{user.id}</td>
                          <td className="py-3">{user.name}</td>
                          <td className="py-3">{user.email}</td>
                          <td className="py-3">
                            <span
                              className={`badge ${
                                user.role === 'admin' ? 'bg-danger' : 'bg-primary'
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 text-muted">{formatDate(user.created_at)}</td>
                          <td className="py-3 text-end">
                            <button
                              onClick={() =>
                                setRoleModal({
                                  show: true,
                                  user,
                                  newRole: user.role === 'admin' ? 'customer' : 'admin',
                                })
                              }
                              className="btn btn-sm btn-outline-primary me-2"
                              disabled={user.id === currentUser?.id}
                            >
                              <i className="bi bi-arrow-repeat me-1"></i>
                              Change Role
                            </button>
                            <button
                              onClick={() => setDeleteModal({ show: true, user })}
                              className="btn btn-sm btn-outline-danger"
                              disabled={user.id === currentUser?.id || user.role === 'admin'}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-5 text-muted">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center py-3 border-top">
                  <nav>
                    <ul className="pagination mb-0">
                      <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setPage(page - 1)}
                          disabled={page === 1}
                        >
                          Previous
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, i) => (
                        <li key={i + 1} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => setPage(i + 1)}>
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setPage(page + 1)}
                          disabled={page === totalPages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteModal({ show: false, user: null })}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete user <strong>{deleteModal.user?.name}</strong>?
                </p>
                <p className="text-muted mb-0">This action cannot be undone.</p>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeleteModal({ show: false, user: null })}
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteUser}>
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Role Modal */}
      {roleModal.show && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">Change User Role</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setRoleModal({ show: false, user: null, newRole: '' })}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Change role for <strong>{roleModal.user?.name}</strong> from{' '}
                  <span className="badge bg-secondary">{roleModal.user?.role}</span> to{' '}
                  <span className="badge bg-primary">{roleModal.newRole}</span>?
                </p>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setRoleModal({ show: false, user: null, newRole: '' })}
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateRole}>
                  Update Role
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
