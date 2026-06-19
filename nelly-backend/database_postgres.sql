-- ============================================
-- NELLY Fashion Store - Complete Master Schema
-- ============================================
-- This file contains the fully updated database schema 
-- and initial sample data.

-- Database creation removed for Supabase
-- USE removed for Supabase

-- ============================================
-- TABLE SCHEMAS
-- ============================================

-- Users Table
CREATE TABLE IF NOT EXISTS users (

    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar VARCHAR(255),
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    date_of_birth DATE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (

    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    email_notifications BOOLEAN DEFAULT true,
    order_updates BOOLEAN DEFAULT true,
    promotional_emails BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_settings UNIQUE (user_id)
);

-- Addresses Table
CREATE TABLE IF NOT EXISTS addresses (

    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    address_type VARCHAR(10) DEFAULT 'home' CHECK (address_type IN ('home', 'work', 'other')),
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'Nigeria',
    postal_code VARCHAR(20) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Admin Logs Table
CREATE TABLE IF NOT EXISTS admin_logs (

    id SERIAL PRIMARY KEY,
    admin_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (

    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (

    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INT NOT NULL,
    image VARCHAR(255),
    stock INT DEFAULT 0,
    sizes JSON,
    colors JSON,
    is_featured BOOLEAN DEFAULT false,
    discount_percentage INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Cart Table
CREATE TABLE IF NOT EXISTS cart (

    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_cart UNIQUE (user_id)
);

-- Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (

    id SERIAL PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    size VARCHAR(10),
    color VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT unique_cart_product UNIQUE (cart_id, product_id, size, color)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (

    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL,
    shipping DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_reference VARCHAR(255) DEFAULT NULL,
    payment_method VARCHAR(50) DEFAULT 'paystack',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (

    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    size VARCHAR(10),
    color VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Contacts Table
CREATE TABLE IF NOT EXISTS contacts (

    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- Wishlist Table
CREATE TABLE IF NOT EXISTS wishlist (

    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_wishlist UNIQUE (user_id)
);

-- Wishlist Items Table
CREATE TABLE IF NOT EXISTS wishlist_items (

    id SERIAL PRIMARY KEY,
    wishlist_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wishlist_id) REFERENCES wishlist(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT unique_wishlist_product UNIQUE (wishlist_id, product_id)
);


-- ============================================
-- INITIAL SAMPLE DATA
-- ============================================

-- Insert Categories
INSERT INTO categories (name, slug, description) VALUES
('Women', 'women', 'Women''s fashion collection'),
('Men', 'men', 'Men''s fashion collection'),
('Kids', 'kids', 'Kids fashion collection'),
('Accessories', 'accessories', 'Fashion accessories'),
('Sale', 'sale', 'Sale items');

-- Insert Admin User (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@nelly.ng', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert Women's Products
INSERT INTO products (name, slug, description, price, category_id, image, stock, sizes, colors, is_featured, discount_percentage) VALUES
('Floral Summer Dress', 'floral-summer-dress', 'Beautiful floral print dress perfect for summer occasions', 89.99, 1, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', 50, '["S", "M", "L", "XL"]', '["Pink", "Blue", "White"]', true, 30),
('Professional Blazer', 'professional-blazer', 'Elegant blazer for professional settings', 129.99, 1, 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800', 30, '["S", "M", "L", "XL"]', '["Black", "Navy", "Gray"]', true, 20),
('Elegant Evening Gown', 'elegant-evening-gown', 'Stunning evening gown for special occasions', 199.99, 1, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 20, '["S", "M", "L", "XL"]', '["Red", "Black", "Gold"]', true, 0),
('Casual Maxi Dress', 'casual-maxi-dress', 'Comfortable maxi dress for everyday wear', 79.99, 1, 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800', 40, '["S", "M", "L", "XL"]', '["Floral", "Solid"]', false, 15);

-- Insert Men's Products
INSERT INTO products (name, slug, description, price, category_id, image, stock, sizes, colors, is_featured, discount_percentage) VALUES
('Classic Oxford Shirt', 'classic-oxford-shirt', 'Timeless oxford shirt for any occasion', 59.99, 2, 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800', 60, '["S", "M", "L", "XL", "XXL"]', '["White", "Blue", "Black"]', true, 25),
('Slim Fit Jeans', 'slim-fit-jeans', 'Modern slim fit jeans with stretch comfort', 89.99, 2, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800', 45, '["30", "32", "34", "36", "38"]', '["Blue", "Black", "Gray"]', true, 0),
('Business Suit Jacket', 'business-suit-jacket', 'Professional suit jacket for business meetings', 199.99, 2, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800', 25, '["S", "M", "L", "XL", "XXL"]', '["Black", "Navy", "Charcoal"]', false, 10),
('Casual Polo Shirt', 'casual-polo-shirt', 'Comfortable polo shirt for casual wear', 45.99, 2, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800', 70, '["S", "M", "L", "XL", "XXL"]', '["White", "Navy", "Red"]', false, 0);

-- Insert Kids' Products
INSERT INTO products (name, slug, description, price, category_id, image, stock, sizes, colors, is_featured, discount_percentage) VALUES
('Kids Graphic T-Shirt', 'kids-graphic-tshirt', 'Fun graphic t-shirt for active kids', 24.99, 3, 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800', 80, '["2T", "3T", "4T", "5T", "6"]', '["Red", "Blue", "Green"]', true, 0),
('Kids Denim Shorts', 'kids-denim-shorts', 'Comfortable denim shorts for playtime', 29.99, 3, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800', 60, '["2T", "3T", "4T", "5T", "6"]', '["Blue", "Black"]', false, 0),
('Girls Party Dress', 'girls-party-dress', 'Beautiful dress for special occasions', 49.99, 3, 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800', 35, '["2T", "3T", "4T", "5T", "6"]', '["Pink", "Purple", "White"]', true, 20),
('Boys Hoodie', 'boys-hoodie', 'Warm and cozy hoodie for cool days', 39.99, 3, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800', 50, '["2T", "3T", "4T", "5T", "6"]', '["Gray", "Navy", "Black"]', false, 0);

-- Insert Accessories
INSERT INTO products (name, slug, description, price, category_id, image, stock, sizes, colors, is_featured, discount_percentage) VALUES
('Designer Handbag', 'designer-handbag', 'Luxury handbag with premium leather', 249.99, 4, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800', 15, '["One Size"]', '["Black", "Brown", "Tan"]', true, 30),
('Fashion Sunglasses', 'fashion-sunglasses', 'Trendy sunglasses with UV protection', 49.99, 4, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800', 40, '["One Size"]', '["Black", "Tortoise", "Gold"]', false, 0),
('Leather Belt', 'leather-belt', 'Classic leather belt for any outfit', 39.99, 4, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', 50, '["S", "M", "L", "XL"]', '["Black", "Brown"]', false, 0),
('Classic Watch', 'classic-watch', 'Elegant timepiece for everyday wear', 149.99, 4, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800', 20, '["One Size"]', '["Silver", "Gold", "Black"]', true, 0);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_email_users ON users (email);
CREATE INDEX IF NOT EXISTS idx_role_users ON users (role);
CREATE INDEX IF NOT EXISTS idx_user_addresses ON addresses (user_id);
CREATE INDEX IF NOT EXISTS idx_default_addresses ON addresses (is_default);
CREATE INDEX IF NOT EXISTS idx_admin_admin_logs ON admin_logs (admin_id);
CREATE INDEX IF NOT EXISTS idx_created_admin_logs ON admin_logs (created_at);
CREATE INDEX IF NOT EXISTS idx_slug_categories ON categories (slug);
CREATE INDEX IF NOT EXISTS idx_category_products ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_slug_products ON products (slug);
CREATE INDEX IF NOT EXISTS idx_featured_products ON products (is_featured);
CREATE INDEX IF NOT EXISTS idx_user_orders ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_status_orders ON orders (status);
CREATE INDEX IF NOT EXISTS idx_payment_status_orders ON orders (payment_status);
CREATE INDEX IF NOT EXISTS idx_payment_reference_orders ON orders (payment_reference);
CREATE INDEX IF NOT EXISTS idx_status_contacts ON contacts (status);
CREATE INDEX IF NOT EXISTS idx_created_contacts ON contacts (created_at);
CREATE INDEX IF NOT EXISTS idx_user_wishlist ON wishlist (user_id);
