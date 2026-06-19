import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { ToastProvider } from './components/ui/Toast'
import ProtectedRoute from './components/common/ProtectedRoute'

// Import Design System
import './styles/design-system.css'

// Layout
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import AccountLayout from './components/account/AccountLayout'

// Pages
import Home from './pages/Home'
import Collections from './pages/Collections'
import Women from './pages/Women'
import Men from './pages/Men'
import Kids from './pages/Kids'
import Sale from './pages/Sale'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import About from './pages/About'
import Contact from './pages/Contact'
import Orders from './pages/Orders'

// Account Pages
import AccountDashboard from './pages/account/Dashboard'
import Profile from './pages/account/Profile'
import AccountOrders from './pages/account/AccountOrders'
import OrderDetail from './pages/account/OrderDetail'
import Addresses from './pages/account/Addresses'
import Wishlist from './pages/account/Wishlist'
import Settings from './pages/account/Settings'
import ChangePassword from './pages/account/ChangePassword'

// Admin
import AdminLayout from './admin/layouts/AdminLayout'
import ProtectedAdminRoute from './admin/components/ProtectedAdminRoute'
import { AdminAuthProvider } from './admin/context/AdminAuthContext'
import Dashboard from './admin/pages/Dashboard'
import Products from './admin/pages/Products'
import ProductForm from './admin/pages/ProductForm'
import AdminOrders from './admin/pages/Orders'
import Users from './admin/pages/Users'
import Categories from './admin/pages/Categories'
import Contacts from './admin/pages/Contacts'

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
            <Routes>
              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedAdminRoute>
                    <AdminAuthProvider>
                      <AdminLayout />
                    </AdminAuthProvider>
                  </ProtectedAdminRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="products/create" element={<ProductForm />} />
                <Route path="products/edit/:id" element={<ProductForm />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<Users />} />
                <Route path="categories" element={<Categories />} />
                <Route path="contacts" element={<Contacts />} />
              </Route>

              {/* Account Routes - No Navbar/Footer */}
              <Route path="/account/*" element={
                <ProtectedRoute>
                  <AccountLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AccountDashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="orders" element={<AccountOrders />} />
                <Route path="order/:id" element={<OrderDetail />} />
                <Route path="addresses" element={<Addresses />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="settings" element={<Settings />} />
                <Route path="change-password" element={<ChangePassword />} />
              </Route>

              {/* Auth Routes - No Navbar/Footer */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Customer Routes - With Navbar/Footer */}
              <Route path="/*" element={
                <div className="d-flex flex-column min-vh-100">
                  <Navbar />
                  <main className="flex-grow-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/collections" element={<Collections />} />
                      <Route path="/women" element={<Women />} />
                      <Route path="/men" element={<Men />} />
                      <Route path="/kids" element={<Kids />} />
                      <Route path="/sale" element={<Sale />} />
                      <Route path="/product/:slug" element={<ProductDetail />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      
                      {/* Protected Routes */}
                      <Route path="/cart" element={
                        <ProtectedRoute>
                          <Cart />
                        </ProtectedRoute>
                      } />
                      <Route path="/orders" element={
                        <ProtectedRoute>
                          <Orders />
                        </ProtectedRoute>
                      } />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              } />
            </Routes>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  )
}

export default App
