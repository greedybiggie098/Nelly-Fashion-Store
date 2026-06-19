import { useState, useEffect } from 'react';
import { contactsAPI } from '../services/adminApi';
import toast from '../../utils/toast';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, [page, statusFilter]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = {
        status: statusFilter,
        page,
        limit: 20,
      };
      const response = await contactsAPI.getAll(params);
      if (response.data.success) {
        setContacts(response.data.contacts);
        setTotalPages(response.data.pages);
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const viewContact = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
    if (contact.status === 'new') {
      updateContactStatus(contact.id, 'read', false);
    }
  };

  const updateContactStatus = async (contactId, newStatus, showToast = true) => {
    try {
      const response = await contactsAPI.updateStatus(contactId, newStatus);
      if (response.data.success) {
        if (showToast) {
          toast.success('Contact status updated');
        }
        fetchContacts();
        if (selectedContact && selectedContact.id === contactId) {
          setSelectedContact({ ...selectedContact, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Failed to update contact status:', error);
      if (showToast) {
        toast.error('Failed to update contact status');
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      new: 'primary',
      read: 'info',
      replied: 'success',
    };
    return badges[status] || 'secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="contacts-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Contact Messages</h2>
          <p className="text-muted mb-0">View and manage customer inquiries</p>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-auto">
              <label className="fw-semibold me-2">Filter by Status:</label>
            </div>
            <div className="col-auto">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All Messages</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>
            </div>
          </div>
        </div>
      </div>

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
                      <th className="border-0 py-3">Subject</th>
                      <th className="border-0 py-3">Status</th>
                      <th className="border-0 py-3">Date</th>
                      <th className="border-0 py-3 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.length > 0 ? (
                      contacts.map((contact) => (
                        <tr key={contact.id}>
                          <td className="px-4 py-3 fw-semibold">#{contact.id}</td>
                          <td className="py-3">{contact.name}</td>
                          <td className="py-3">{contact.email}</td>
                          <td className="py-3">{contact.subject || '-'}</td>
                          <td className="py-3">
                            <span className={`badge bg-${getStatusBadge(contact.status)}`}>
                              {contact.status}
                            </span>
                          </td>
                          <td className="py-3 text-muted">{formatDate(contact.created_at)}</td>
                          <td className="py-3 text-end">
                            <button
                              onClick={() => viewContact(contact)}
                              className="btn btn-sm btn-outline-primary"
                            >
                              <i className="bi bi-eye me-1"></i>
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-5 text-muted">
                          No contacts found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

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

      {showModal && selectedContact && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <div>
                  <h5 className="modal-title fw-bold">Contact Message #{selectedContact.id}</h5>
                  <small className="text-muted">{formatDate(selectedContact.created_at)}</small>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <strong>From:</strong> {selectedContact.name} ({selectedContact.email})
                </div>
                {selectedContact.phone && (
                  <div className="mb-3">
                    <strong>Phone:</strong> {selectedContact.phone}
                  </div>
                )}
                {selectedContact.subject && (
                  <div className="mb-3">
                    <strong>Subject:</strong> {selectedContact.subject}
                  </div>
                )}
                <div className="mb-3">
                  <strong>Message:</strong>
                  <p className="mt-2 p-3 bg-light rounded">{selectedContact.message}</p>
                </div>
                <div className="mb-3">
                  <strong>Status:</strong>{' '}
                  <span className={`badge bg-${getStatusBadge(selectedContact.status)}`}>
                    {selectedContact.status}
                  </span>
                </div>
                <div>
                  <strong>Update Status:</strong>
                  <div className="d-flex gap-2 mt-2">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => updateContactStatus(selectedContact.id, 'read')}
                      disabled={selectedContact.status === 'read'}
                    >
                      Mark as Read
                    </button>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => updateContactStatus(selectedContact.id, 'replied')}
                      disabled={selectedContact.status === 'replied'}
                    >
                      Mark as Replied
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
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

export default Contacts;
