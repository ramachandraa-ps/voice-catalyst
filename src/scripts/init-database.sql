-- Database initialization script for VoiceCatalyst / say2sale
-- Execute this script to create the database and its tables

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS voicecatalyst_db;
USE voicecatalyst_db;

-- Registration Table
CREATE TABLE IF NOT EXISTS registration_table (
  registration_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  mobile_number VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  location VARCHAR(100) NULL,
  preferred_language VARCHAR(10) DEFAULT 'en' NULL,
  user_role VARCHAR(50) NOT NULL,
  shop_name VARCHAR(100) NULL,
  shop_address VARCHAR(255) NULL,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- User Table
CREATE TABLE IF NOT EXISTS user_table (
  user_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  mobile_number VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  location VARCHAR(100) NULL,
  preferred_language VARCHAR(10) DEFAULT 'en' NULL,
  user_role VARCHAR(50) NOT NULL,
  shop_name VARCHAR(100) NULL,
  shop_address VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Login Table
CREATE TABLE IF NOT EXISTS login_table (
  login_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user_table(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Product Catalog Table
CREATE TABLE IF NOT EXISTS product_catalog (
  product_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  quantity VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description_en TEXT NULL,
  description_local TEXT NULL,
  language_used VARCHAR(10) DEFAULT 'en' NULL,
  added_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_table(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add indexes for better performance
CREATE INDEX idx_registration_email ON registration_table(email);
CREATE INDEX idx_user_email ON user_table(email);
CREATE INDEX idx_product_user ON product_catalog(user_id);

-- Add some demo data if needed (uncomment to use)
/*
-- Demo users (password is hashed 'password123')
INSERT INTO user_table (full_name, email, mobile_number, password, location, preferred_language, user_role, shop_name, shop_address)
VALUES 
('Raj Kumar', 'raj@example.com', '9876543210', '$2a$10$tNO/nQy5elUJaYFWFCzUCOu9tOmmB./oEZ5yBXLh1mqu4RZc5mXIm', 'Chennai', 'ta', 'Farmer', 'Raj Farms', '123 Farm Road, Chennai'),
('Meena Kumari', 'meena@example.com', '8765432109', '$2a$10$tNO/nQy5elUJaYFWFCzUCOu9tOmmB./oEZ5yBXLh1mqu4RZc5mXIm', 'Delhi', 'hi', 'Artisan', 'Meena Crafts', '456 Craft Street, Delhi'),
('Venkat Rao', 'venkat@example.com', '7654321098', '$2a$10$tNO/nQy5elUJaYFWFCzUCOu9tOmmB./oEZ5yBXLh1mqu4RZc5mXIm', 'Bangalore', 'kn', 'Kirana Shop Owner', 'Venkat Kirana', '789 Market Road, Bangalore');

-- Copy the same data to registration table
INSERT INTO registration_table (full_name, email, mobile_number, password, location, preferred_language, user_role, shop_name, shop_address)
SELECT full_name, email, mobile_number, password, location, preferred_language, user_role, shop_name, shop_address FROM user_table;

-- Create login records for users
INSERT INTO login_table (email, password, user_id)
SELECT email, password, user_id FROM user_table;

-- Add some products
INSERT INTO product_catalog (user_id, product_name, quantity, price, description_en, description_local, language_used)
VALUES 
(1, 'Organic Rice', '25 kg', 1200.00, 'Fresh organic rice grown without pesticides', 'பூச்சிக்கொல்லிகள் இல்லாமல் வளர்க்கப்பட்ட புதிய கரிம அரிசி', 'ta'),
(1, 'Fresh Tomatoes', '5 kg', 150.00, 'Farm fresh tomatoes', 'பண்ணையில் இருந்து புதிய தக்காளிகள்', 'ta'),
(2, 'Handmade Pottery', '10 pieces', 2500.00, 'Beautiful handcrafted pottery made with traditional techniques', 'पारंपरिक तकनीकों से बनाई गई सुंदर हस्तशिल्प मिट्टी के बर्तन', 'hi'),
(3, 'Toor Dal', '2 kg', 220.00, 'Premium quality toor dal', 'ಅತ್ಯುತ್ತಮ ಗುಣಮಟ್ಟದ ತೊಗರಿ ಬೇಳೆ', 'kn');
*/ 