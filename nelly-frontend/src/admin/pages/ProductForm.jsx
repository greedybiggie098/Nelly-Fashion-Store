import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/adminApi';
import toast from '../../utils/toast';
import axios from 'axios';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    stock: '',
    image: '',
    sizes: [],
    colors: [],
    is_featured: false,
    discount_percentage: 0,
  });

  const [sizeInput, setSizeInput] = useState('');
  const [colorInput, setColorInput] = useState('');

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/product.php?id=${id}`);
      if (response.data.success) {
        const product = response.data.product;
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          category_id: product.category_id,
          stock: product.stock,
          image: product.image,
          sizes: product.sizes || [],
          colors: product.colors || [],
          is_featured: product.is_featured === 1,
          discount_percentage: product.discount_percentage || 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Failed to load product');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const addSize = () => {
    if (sizeInput && !formData.sizes.includes(sizeInput)) {
      setFormData({ ...formData, sizes: [...formData.sizes, sizeInput] });
      setSizeInput('');
    }
  };

  const removeSize = (size) => {
    setFormData({ ...formData, sizes: formData.sizes.filter((s) => s !== size) });
  };

  const addColor = () => {
    if (colorInput && !formData.colors.includes(colorInput)) {
      setFormData({ ...formData, colors: [...formData.colors, colorInput] });
      setColorInput('');
    }
  };

  const removeColor = (color) => {
    setFormData({ ...formData, colors: formData.colors.filter((c) => c !== color) });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formDataObj = new FormData();
    formDataObj.append('image', file);

    try {
      const response = await productsAPI.uploadImage(formDataObj);
      if (response.data.success) {
        setFormData({ ...formData, image: response.data.imageUrl });
        toast.success('Image uploaded successfully');
      } else {
        toast.error(response.data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Image upload failed');
    } finally {
      setUploadingImage(false);
      // Reset input value so same file can be uploaded again if needed
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        is_featured: formData.is_featured ? 1 : 0,
      };

      if (isEdit) {
        data.product_id = id;
        const response = await productsAPI.update(data);
        if (response.data.success) {
          toast.success('Product updated successfully');
          navigate('/admin/products');
        } else {
          toast.error(response.data.message || 'Failed to update product');
        }
      } else {
        const response = await productsAPI.create(data);
        if (response.data.success) {
          toast.success('Product created successfully');
          navigate('/admin/products');
        } else {
          toast.error(response.data.message || 'Failed to create product');
        }
      }
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <p className="text-muted mb-0">Fill in the product details below</p>
        </div>
        <button onClick={() => navigate('/admin/products')} className="btn btn-outline-dark">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Products
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Basic Information</h5>
                
                <div className="mb-3">
                  <label className="form-label fw-semibold">Product Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Description *</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Price (₦) *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Stock *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Category *</label>
                    <select
                      className="form-select"
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Discount (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="discount_percentage"
                      value={formData.discount_percentage}
                      onChange={handleChange}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Product Image</label>
                  <div className="d-flex gap-2 mb-2">
                    <div className="flex-grow-1">
                      <input
                        type="url"
                        className="form-control"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="Image URL (e.g. https://example.com/image.jpg)"
                      />
                    </div>
                    <div className="position-relative">
                      <input
                        type="file"
                        className="form-control position-absolute opacity-0"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ width: '100%', height: '100%', cursor: 'pointer', zIndex: 2, top: 0, left: 0 }}
                        disabled={uploadingImage}
                      />
                      <button type="button" className="btn btn-outline-dark h-100" disabled={uploadingImage}>
                        {uploadingImage ? (
                          <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                          <><i className="bi bi-upload me-2"></i>Upload Device File</>
                        )}
                      </button>
                    </div>
                  </div>
                  {formData.image && (
                    <div className="mt-2">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="img-thumbnail"
                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Product Variants</h5>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Sizes</label>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      value={sizeInput}
                      onChange={(e) => setSizeInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                      placeholder="e.g., S, M, L, XL"
                    />
                    <button type="button" className="btn btn-dark" onClick={addSize}>
                      Add
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {formData.sizes.map((size) => (
                      <span key={size} className="badge bg-secondary d-flex align-items-center gap-1 py-2 px-3">
                        {size}
                        <i
                          className="bi bi-x-circle cursor-pointer"
                          onClick={() => removeSize(size)}
                          style={{ cursor: 'pointer' }}
                        ></i>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-0">
                  <label className="form-label fw-semibold">Colors</label>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                      placeholder="e.g., Red, Blue, Black"
                    />
                    <button type="button" className="btn btn-dark" onClick={addColor}>
                      Add
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {formData.colors.map((color) => (
                      <span key={color} className="badge bg-secondary d-flex align-items-center gap-1 py-2 px-3">
                        {color}
                        <i
                          className="bi bi-x-circle cursor-pointer"
                          onClick={() => removeColor(color)}
                          style={{ cursor: 'pointer' }}
                        ></i>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Product Status</h5>
                
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="is_featured"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="is_featured">
                    Featured Product
                  </label>
                  <small className="d-block text-muted mt-1">
                    Featured products appear on the homepage
                  </small>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <button
                  type="submit"
                  className="btn btn-dark w-100 mb-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      {isEdit ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      {isEdit ? 'Update Product' : 'Create Product'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100"
                  onClick={() => navigate('/admin/products')}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
