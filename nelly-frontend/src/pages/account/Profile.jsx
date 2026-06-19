import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { accountAPI } from '../../services/accountApi';
import toast from '../../utils/toast';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    date_of_birth: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await accountAPI.getProfile();
      if (response.data.success) {
        setProfile(response.data.user);
        setAvatar(response.data.user.avatar);
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await accountAPI.updateProfile(profile);
      if (response.data.success) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await accountAPI.uploadAvatar(formData);
      if (response.data.success) {
        setAvatar(response.data.avatar);
        toast.success('Avatar uploaded successfully!');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <motion.div 
      className="profile-page"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Page Header */}
      <motion.div className="profile-header" variants={itemVariants}>
        <div className="profile-header-content">
          <div>
            <h1 className="profile-title">My Profile</h1>
            <p className="profile-subtitle">Manage your personal information and preferences</p>
          </div>
          <div className="profile-header-badge">
            <i className="bi bi-shield-check"></i>
            <span>Verified Account</span>
          </div>
        </div>
      </motion.div>

      <div className="profile-grid">
        {/* Avatar Card */}
        <motion.div variants={itemVariants}>
          <div className="profile-avatar-card">
            <div className="avatar-card-header">
              <h3>Profile Picture</h3>
              <p>Upload a professional photo</p>
            </div>
            <div className="avatar-card-body">
              <div className="avatar-upload-container">
                <motion.div 
                  className="avatar-wrapper"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {avatar ? (
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/${avatar}`}
                      alt="Avatar"
                      className="avatar-image"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      <span>{profile.name?.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                  <motion.button
                    className="avatar-upload-btn"
                    onClick={() => fileInputRef.current.click()}
                    disabled={uploading}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {uploading ? (
                      <div className="btn-spinner"></div>
                    ) : (
                      <i className="bi bi-camera-fill"></i>
                    )}
                  </motion.button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="avatar-input"
                    onChange={handleAvatarChange}
                  />
                </motion.div>
                <div className="avatar-info">
                  <p className="avatar-info-title">Upload Guidelines</p>
                  <ul className="avatar-info-list">
                    <li><i className="bi bi-check-circle-fill"></i> JPG, PNG or GIF</li>
                    <li><i className="bi bi-check-circle-fill"></i> Max size: 5MB</li>
                    <li><i className="bi bi-check-circle-fill"></i> Square ratio recommended</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Form */}
        <motion.div variants={itemVariants}>
          <div className="profile-form-card">
            <div className="form-card-header">
              <h3>Personal Information</h3>
              <p>Update your account details</p>
            </div>
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-section">
                <h4 className="form-section-title">Basic Information</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      <i className="bi bi-person"></i>
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="bi bi-envelope"></i>
                      Email Address <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="bi bi-telephone"></i>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      name="phone"
                      value={profile.phone || ''}
                      onChange={handleChange}
                      placeholder="+234 800 000 0000"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="bi bi-gender-ambiguous"></i>
                      Gender
                    </label>
                    <select
                      className="form-select"
                      name="gender"
                      value={profile.gender || ''}
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="bi bi-calendar"></i>
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      name="date_of_birth"
                      value={profile.date_of_birth || ''}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="bi bi-globe"></i>
                      Country
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      name="country"
                      value={profile.country || ''}
                      onChange={handleChange}
                      placeholder="Nigeria"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4 className="form-section-title">Address Details</h4>
                <div className="form-grid">
                  <div className="form-group form-group-full">
                    <label className="form-label">
                      <i className="bi bi-house"></i>
                      Street Address
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      name="address"
                      value={profile.address || ''}
                      onChange={handleChange}
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="bi bi-building"></i>
                      City
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      name="city"
                      value={profile.city || ''}
                      onChange={handleChange}
                      placeholder="Lagos"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="bi bi-map"></i>
                      State/Province
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      name="state"
                      value={profile.state || ''}
                      onChange={handleChange}
                      placeholder="Lagos State"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <i className="bi bi-mailbox"></i>
                      Postal Code
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      name="postal_code"
                      value={profile.postal_code || ''}
                      onChange={handleChange}
                      placeholder="100001"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <motion.button
                  type="submit"
                  className="btn-save"
                  disabled={saving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {saving ? (
                    <>
                      <div className="btn-spinner"></div>
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle-fill"></i>
                      <span>Save Changes</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;
