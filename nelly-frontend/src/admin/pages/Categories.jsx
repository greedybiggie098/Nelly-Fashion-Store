import { useState, useEffect } from 'react';
import { categoriesAPI } from '../services/adminApi';
import toast from '../../utils/toast';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
  });
  const [deleteModal, setDeleteModal] = useState({ show: false, category: null });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditMode(true);
      setFormData({
        id: category.id,
        name: category.name,
        description: category.description || '',
      });
    } else {
      setEditMode(false);
      setFormData({
        id: null,
        name: '',
        description: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ id: null, name: '', description: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        const response = await categoriesAPI.update({
          category_id: formData.id,
          name: formData.name,
          description: formData.description,
        });
        if (response.data.success) {
          toast.success('Category updated successfully');
          fetchCategories();
          handleCloseModal();
        } else {
          toast.error(response.data.message || 'Failed to update category');
        }
      } else {
        const response = await categoriesAPI.create({
          name: formData.name,
          description: formData.description,
        });
        if (response.data.success) {
          toast.success('Category created successfully');
          fetchCategories();
          handleCloseModal();
        } else {
          toast.error(response.data.message || 'Failed to create category');
        }
      }
    } catch (error) {
      console.error('Failed to save category:', error);
      toast.error(error.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.category) return;

    try {
      const response = await categoriesAPI.delete(deleteModal.category.id);
      if (response.data.success) {
        toast.success('Category deleted successfully');
        fetchCategories();
        setDeleteModal({ show: false, category: null });
      } else {
        toast.error(response.data.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="categories-page">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Categories</h2>
          <p className="text-muted mb-0">Manage product categories</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-dark">
          <i className="bi bi-plus-circle me-2"></i>
          Add Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 px-4 py-3">ID</th>
                    <th className="border-0 py-3">Name</th>
                    <th className="border-0 py-3">Slug</th>
                    <th className="border-0 py-3">Description</th>
                    <th className="border-0 py-3">Products</th>
                    <th className="border-0 py-3 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <tr key={category.id}>
                        <td className="px-4 py-3 fw-semibold">#{category.id}</td>
                        <td className="py-3 fw-semibold">{category.name}</td>
                        <td className="py-3">
                          <code className="text-muted">{category.slug}</code>
                        </td>
                        <td className="py-3">
                          {category.description || <span className="text-muted">-</span>}
                        </td>
                        <td className="py-3">
                          <span className="badge bg-primary">{category.product_count} products</span>
                        </td>
                        <td className="py-3 text-end">
                          <button
                            onClick={() => handleOpenModal(category)}
                            className="btn btn-sm btn-outline-primary me-2"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            onClick={() => setDeleteModal({ show: true, category })}
                            className="btn btn-sm btn-outline-danger"
                            disabled={category.product_count > 0}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        No categories found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header border-0">
                  <h5 className="modal-title">{editMode ? 'Edit Category' : 'Add New Category'}</h5>
                  <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Category Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-dark">
                    {editMode ? 'Update Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
                  onClick={() => setDeleteModal({ show: false, category: null })}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete category{' '}
                  <strong>{deleteModal.category?.name}</strong>?
                </p>
                <p className="text-muted mb-0">This action cannot be undone.</p>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeleteModal({ show: false, category: null })}
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  Delete Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
