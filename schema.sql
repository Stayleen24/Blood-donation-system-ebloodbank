CREATE DATABASE IF NOT EXISTS lifedrop;
USE lifedrop;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blood_banks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  state VARCHAR(100),
  district VARCHAR(100),
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(100),
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blood_camps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  organizer VARCHAR(255),
  description TEXT,
  camp_date DATE,
  start_time VARCHAR(20),
  end_time VARCHAR(20),
  state VARCHAR(100),
  district VARCHAR(100),
  max_donors INT DEFAULT 0,
  contact_phone VARCHAR(50),
  status ENUM('upcoming', 'completed') DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS donors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  full_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  age INT,
  blood_group VARCHAR(10),
  state VARCHAR(100),
  district VARCHAR(100),
  address TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS camp_registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  camp_id INT,
  user_id INT,
  full_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  age INT,
  blood_group VARCHAR(10),
  certificate_id VARCHAR(100),
  has_donated BOOLEAN DEFAULT FALSE,
  donated_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (camp_id) REFERENCES blood_camps(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
