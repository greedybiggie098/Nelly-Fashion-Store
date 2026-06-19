import { useState, useEffect } from 'react';
import { accountAPI } from '../../services/accountApi';
import toast from '../../utils/toast';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    address_type: 'home',
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: 'Nigeria',
    postal_code: '',
    is_default: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await accountAPI.getAddresses();
      if (response.data.success) {
        setAddresses(response.data.addresses);
      }
    } catch (error) {
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let response;
      if (editingId) {
        response = await accountAPI.updateAddress({ ...formData, id: editingId });
      } else {
        response = await accountAPI.createAddress(formData);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        fetchAddresses();
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (address) => {
    setFormData({
      address_type: address.address_type,
      full_name: address.full_name,
      phone: address.phone,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      city: address.city,
      state: address.state,
      country: address.country,
      postal_code: address.postal_code,
      is_default: address.is_default === 1,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const response = await accountAPI.deleteAddress(id);
      if (response.data.success) {
        toast.success('Address deleted successfully');
        fetchAddresses();
      }
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const response = await accountAPI.setDefaultAddress(id);
      if (response.data.success) {
        toast.success('Default address updated');
        fetchAddresses();
      }
    } catch (error) {
      toast.error('Failed to set default address');
    }
  };

  const resetForm = () => {
    setFormData({
      address_type: 'home',
      full_name: '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      country: 'Nigeria',
      postal_code: '',
      is_default: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">My Addresses</h2>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <i className="bi bi-plus-circle me-2"></i>
            Add New Address
          </button>
        )}
      </div>

      {/* Address Form */}
      {showForm && (
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">{editingId ? 'Edit Address' : 'Add New Address'}</h5>
            <button className="btn btn-sm btn-outline-secondary" onClick={resetForm}>
              Cancel
            </button>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Address Type *</label>
                  <select
                    className="form-select"
                    name="address_type"
                    value={formData.address_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Phone *</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Country *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Address Line 1 *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address_line1"
                    value={formData.address_line1}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Address Line 2</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">State *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Postal Code *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="is_default"
                      name="is_default"
                      checked={formData.is_default}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="is_default">
                      Set as default address
                    </label>
                  </div>
                </div>

                <div className="col-12">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        {editingId ? 'Update Address' : 'Save Address'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-geo-alt fs-1 text-muted mb-3"></i>
            <h5>No addresses saved</h5>
            <p className="text-muted">Add your first delivery address</p>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {addresses.map((address) => (
            <div key={address.id} className="col-md-6">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <span className="badge bg-primary me-2">
                        {address.address_type.toUpperCase()}
                      </span>
                      {address.is_default === 1 && (
                        <span className="badge bg-success">DEFAULT</span>
                      )}
                    </div>
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => handleEdit(address)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleDelete(address.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                  <h6>{address.full_name}</h6>
                  <p className="mb-1 small">{address.address_line1}</p>
                  {address.address_line2 && (
                    <p className="mb-1 small">{address.address_line2}</p>
                  )}
                  <p className="mb-1 small">
                    {address.city}, {address.state} {address.postal_code}
                  </p>
                  <p className="mb-2 small">{address.country}</p>
                  <p className="mb-0 small">
                    <i className="bi bi-telephone me-2"></i>
                    {address.phone}
                  </p>
                  {address.is_default !== 1 && (
                    <button
                      className="btn btn-sm btn-outline-success mt-3"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Addresses;
