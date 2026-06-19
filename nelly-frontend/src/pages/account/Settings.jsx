import { useState, useEffect } from 'react';
import { accountAPI } from '../../services/accountApi';
import toast from '../../utils/toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    email_notifications: true,
    order_updates: true,
    promotional_emails: true,
    sms_notifications: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await accountAPI.getSettings();
      if (response.data.success) {
        setSettings({
          email_notifications: response.data.settings.email_notifications === 1,
          order_updates: response.data.settings.order_updates === 1,
          promotional_emails: response.data.settings.promotional_emails === 1,
          sms_notifications: response.data.settings.sms_notifications === 1,
        });
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await accountAPI.updateSettings(settings);
      if (response.data.success) {
        toast.success('Settings updated successfully!');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
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
      <h2 className="mb-4">Account Settings</h2>

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Email Notifications */}
            <div className="mb-4">
              <h5 className="mb-3">
                <i className="bi bi-envelope me-2"></i>
                Email Notifications
              </h5>
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="email_notifications"
                  name="email_notifications"
                  checked={settings.email_notifications}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="email_notifications">
                  <strong>Email Notifications</strong>
                  <p className="text-muted small mb-0">
                    Receive general email notifications about your account
                  </p>
                </label>
              </div>

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="order_updates"
                  name="order_updates"
                  checked={settings.order_updates}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="order_updates">
                  <strong>Order Updates</strong>
                  <p className="text-muted small mb-0">
                    Get notified about order status changes and shipping updates
                  </p>
                </label>
              </div>

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="promotional_emails"
                  name="promotional_emails"
                  checked={settings.promotional_emails}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="promotional_emails">
                  <strong>Promotional Emails</strong>
                  <p className="text-muted small mb-0">
                    Receive emails about special offers, new products, and sales
                  </p>
                </label>
              </div>
            </div>

            {/* SMS Notifications */}
            <div className="mb-4 pb-4 border-bottom">
              <h5 className="mb-3">
                <i className="bi bi-phone me-2"></i>
                SMS Notifications
              </h5>
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="sms_notifications"
                  name="sms_notifications"
                  checked={settings.sms_notifications}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="sms_notifications">
                  <strong>SMS Notifications</strong>
                  <p className="text-muted small mb-0">
                    Receive text messages for important order updates
                  </p>
                </label>
              </div>
            </div>

            {/* Privacy */}
            <div className="mb-4">
              <h5 className="mb-3">
                <i className="bi bi-shield-check me-2"></i>
                Privacy
              </h5>
              <p className="text-muted small">
                Your privacy is important to us. We will never share your personal information
                with third parties without your consent. Read our{' '}
                <a href="#" className="text-decoration-none">Privacy Policy</a> for more details.
              </p>
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Saving...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Save Settings
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
