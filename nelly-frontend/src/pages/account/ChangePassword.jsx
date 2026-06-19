import { useState } from 'react';
import { accountAPI } from '../../services/accountApi';
import toast from '../../utils/toast';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const togglePassword = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.current_password) {
      newErrors.current_password = 'Current password is required';
    }

    if (!formData.new_password) {
      newErrors.new_password = 'New password is required';
    } else if (formData.new_password.length < 6) {
      newErrors.new_password = 'Password must be at least 6 characters';
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password';
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    if (formData.current_password === formData.new_password) {
      newErrors.new_password = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await accountAPI.changePassword({
        current_password: formData.current_password,
        new_password: formData.new_password,
      });

      if (response.data.success) {
        toast.success('Password changed successfully!');
        setFormData({
          current_password: '',
          new_password: '',
          confirm_password: '',
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Change Password</h2>

      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Current Password */}
                <div className="mb-4">
                  <label className="form-label">Current Password *</label>
                  <div className="input-group">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      className={`form-control ${errors.current_password ? 'is-invalid' : ''}`}
                      name="current_password"
                      value={formData.current_password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => togglePassword('current')}
                    >
                      <i className={`bi bi-eye${showPasswords.current ? '-slash' : ''}`}></i>
                    </button>
                    {errors.current_password && (
                      <div className="invalid-feedback">{errors.current_password}</div>
                    )}
                  </div>
                </div>

                {/* New Password */}
                <div className="mb-4">
                  <label className="form-label">New Password *</label>
                  <div className="input-group">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      className={`form-control ${errors.new_password ? 'is-invalid' : ''}`}
                      name="new_password"
                      value={formData.new_password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => togglePassword('new')}
                    >
                      <i className={`bi bi-eye${showPasswords.new ? '-slash' : ''}`}></i>
                    </button>
                    {errors.new_password && (
                      <div className="invalid-feedback">{errors.new_password}</div>
                    )}
                  </div>
                  <small className="text-muted">Password must be at least 6 characters</small>
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label className="form-label">Confirm New Password *</label>
                  <div className="input-group">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      className={`form-control ${errors.confirm_password ? 'is-invalid' : ''}`}
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => togglePassword('confirm')}
                    >
                      <i className={`bi bi-eye${showPasswords.confirm ? '-slash' : ''}`}></i>
                    </button>
                    {errors.confirm_password && (
                      <div className="invalid-feedback">{errors.confirm_password}</div>
                    )}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-check me-2"></i>
                      Change Password
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm bg-light">
            <div className="card-body">
              <h6 className="mb-3">
                <i className="bi bi-info-circle me-2"></i>
                Password Tips
              </h6>
              <ul className="small mb-0">
                <li className="mb-2">Use at least 6 characters</li>
                <li className="mb-2">Mix uppercase and lowercase letters</li>
                <li className="mb-2">Include numbers and special characters</li>
                <li className="mb-2">Avoid common words or patterns</li>
                <li className="mb-0">Don't reuse passwords from other sites</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
