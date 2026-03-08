-- Railway note:
-- This script is intended to run against the database selected by your connection.
-- Do not hardcode CREATE DATABASE/USE for managed Railway MySQL instances.
--
-- Local-only optional lines (uncomment if needed):
-- CREATE DATABASE IF NOT EXISTS worldwide_crm;
-- USE worldwide_crm;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role ENUM('admin', 'sales', 'manager') DEFAULT 'sales',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS travel_deals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  destination VARCHAR(255) NOT NULL,
  travelStartDate DATE NOT NULL,
  travelEndDate DATE NOT NULL,
  numberOfTravelers INT NOT NULL DEFAULT 1,
  budget DECIMAL(12,2) DEFAULT 0.00,
  notes TEXT,
  stage ENUM(
    'Inquiry Received', 'Requirements Gathering', 'Itinerary Sent', 
    'Quote Sent', 'Negotiation / Questions', 'Booking Confirmed', 
    'Payment Received', 'Trip Completed', 'Post-Trip Follow-Up'
  ) NOT NULL DEFAULT 'Inquiry Received',
  assigned_to INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_stage (stage),
  INDEX idx_destination (destination),
  INDEX idx_email (email)
);


ALTER TABLE travel_deals 
ADD CONSTRAINT fk_assigned_to 
FOREIGN KEY (assigned_to) REFERENCES users(id);

-- Insert sample data
INSERT IGNORE INTO users (name, email, role) VALUES
('John Doe', 'john@worldwidesolutions.com', 'sales'),
('Jane Smith', 'jane@worldwidesolutions.com', 'manager'),
('Admin User', 'admin@worldwidesolutions.com', 'admin');

DELETE FROM travel_deals;
INSERT INTO travel_deals (name, email, phone, destination, travelStartDate, travelEndDate, numberOfTravelers, budget, notes, stage, assigned_to) VALUES
('TechCorp Team', 'sarah@techcorp.com', '555-0123', 'Tokyo, Japan', '2026-07-15', '2026-07-22', 12, 45000.00, 'Corporate team building', 'Inquiry Received', 1),
('Global Marketing LLC', 'mike@globalmarketing.com', '555-0456', 'Paris, France', '2026-08-10', '2026-08-15', 6, 18000.00, 'Q3 conference', 'Quote Sent', 2),
('Acme Corp', 'david@acmecorp.com', '555-0789', 'Cancun, Mexico', '2026-06-20', '2026-06-27', 4, 12000.00, 'Family vacation', 'Payment Received', 1);
