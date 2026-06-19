import { useState } from 'react';
import { contactAPI } from '../services/api';
import toast from '../utils/toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const subjects = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'order', label: 'Order Status' },
    { value: 'return', label: 'Returns & Exchanges' },
    { value: 'product', label: 'Product Information' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'other', label: 'Other' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await contactAPI.send(formData);
      if (response.data.success) {
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        toast.error(response.data.message || 'Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Contact error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="bg-primary text-white py-5">
        <div className="container text-center">
          <h1 className="display-3 fw-bold mb-4">Get in Touch</h1>
          <p className="lead mb-0">
            We'd love to hear from you. Whether you have a question, feedback, or just want to say hello.
          </p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="bi bi-geo-alt fs-1 text-primary mb-3 d-block"></i>
                  <h5 className="fw-bold mb-3">Visit Our Store</h5>
                  <p className="mb-2"><strong>NELLY Fashion</strong></p>
                  <p className="mb-0">123 Fashion Avenue<br />Victoria Island, Lagos<br />Nigeria</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="bi bi-telephone fs-1 text-primary mb-3 d-block"></i>
                  <h5 className="fw-bold mb-3">Call Us</h5>
                  <p className="mb-2"><strong>Customer Service</strong></p>
                  <p className="mb-0">+234 801 234 5678<br />Available 24/7</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="bi bi-envelope fs-1 text-primary mb-3 d-block"></i>
                  <h5 className="fw-bold mb-3">Email Us</h5>
                  <p className="mb-2"><strong>General Inquiries</strong></p>
                  <p className="mb-0">hello@nelly.ng<br />support@nelly.ng</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6 mx-auto">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-5">
                  <h2 className="fw-bold mb-4">Send us a Message</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="text-uppercase-tracking mb-1 d-block small fw-bold">Name</label>
                      <input
                        type="text"
                        className="form-control input-premium"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="text-uppercase-tracking mb-1 d-block small fw-bold">Email</label>
                      <input
                        type="email"
                        className="form-control input-premium"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="text-uppercase-tracking mb-1 d-block small fw-bold">Phone</label>
                      <input
                        type="tel"
                        className="form-control input-premium"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-4 position-relative">
                      <label className="text-uppercase-tracking mb-1 d-block small fw-bold">Subject</label>
                      <div 
                        className="form-control input-premium d-flex justify-content-between align-items-center cursor-pointer"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        <span className={formData.subject ? "text-dark" : "text-muted"}>
                          {subjects.find(s => s.value === formData.subject)?.label || 'Select a subject'}
                        </span>
                        <i className={`bi bi-chevron-${isDropdownOpen ? 'up' : 'down'}`}></i>
                      </div>
                      
                      {isDropdownOpen && (
                        <div className="position-absolute w-100 bg-white shadow border-0" style={{ zIndex: 1000, top: '100%' }}>
                          {subjects.map((subj, index) => (
                            <div 
                              key={index}
                              className="p-3 border-bottom cursor-pointer text-dark"
                              style={{ transition: 'background-color 0.2s' }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                              onClick={() => {
                                setFormData({...formData, subject: subj.value});
                                setIsDropdownOpen(false);
                              }}
                            >
                              {subj.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mb-5">
                      <label className="text-uppercase-tracking mb-1 d-block small fw-bold">Message</label>
                      <textarea
                        className="form-control input-premium"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-premium w-100 py-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
