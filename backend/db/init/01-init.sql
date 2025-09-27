-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) CHECK (user_type IN ('painter', 'customer')) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create availability_slots table
CREATE TABLE IF NOT EXISTS availability_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "painterId" UUID REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "customerId" UUID REFERENCES users(id) ON DELETE CASCADE,
    "painterId" UUID REFERENCES users(id) ON DELETE CASCADE,
    "availabilitySlotId" UUID REFERENCES availability_slots(id),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_availability_slots_painter_id ON availability_slots("painterId");
CREATE INDEX IF NOT EXISTS idx_availability_slots_time_range ON availability_slots(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_availability_slots_is_booked ON availability_slots(is_booked);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings("customerId");
CREATE INDEX IF NOT EXISTS idx_bookings_painter_id ON bookings("painterId");
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_time_range ON bookings(start_time, end_time);

-- Insert sample data
INSERT INTO users (email, password_hash, user_type, first_name, last_name, phone_number) VALUES
('john.painter@example.com', '$2b$12$oiy0ceShY59czE2oOotwIu46eAk89m.qZgpiLft19xQpAmBsUcHrG', 'painter', 'John', 'Painter', '+1234567890'),
('jane.painter@example.com', '$2b$12$oiy0ceShY59czE2oOotwIu46eAk89m.qZgpiLft19xQpAmBsUcHrG', 'painter', 'Jane', 'Brush', '+1234567891'),
('bob.customer@example.com', '$2b$12$oiy0ceShY59czE2oOotwIu46eAk89m.qZgpiLft19xQpAmBsUcHrG', 'customer', 'Bob', 'Customer', '+1234567892'),
('alice.customer@example.com', '$2b$12$oiy0ceShY59czE2oOotwIu46eAk89m.qZgpiLft19xQpAmBsUcHrG', 'customer', 'Alice', 'Smith', '+1234567893')
ON CONFLICT (email) DO NOTHING;

-- Insert sample availability slots for painters
INSERT INTO availability_slots ("painterId", start_time, end_time, is_booked) 
SELECT 
    u.id,
    '2025-05-18 10:00:00+00',
    '2025-05-18 14:00:00+00',
    false
FROM users u WHERE u.email = 'john.painter@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO availability_slots ("painterId", start_time, end_time, is_booked) 
SELECT 
    u.id,
    '2025-05-18 15:00:00+00',
    '2025-05-18 18:00:00+00',
    false
FROM users u WHERE u.email = 'john.painter@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO availability_slots ("painterId", start_time, end_time, is_booked) 
SELECT 
    u.id,
    '2025-05-19 09:00:00+00',
    '2025-05-19 13:00:00+00',
    false
FROM users u WHERE u.email = 'jane.painter@example.com'
ON CONFLICT DO NOTHING;
