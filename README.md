Lost and Found Management System
A comprehensive web-based system for managing lost and found items in educational institutions. Built with Laravel backend and React frontend.

🚀 Features
Core Functionality
Item Registration - Log found items with photos, descriptions, and location details

Item Search - Browse and search through available lost items

Claim Process - Secure item claiming with verification

Item Clearing - Automated system for clearing old unclaimed items

History Tracking - Complete audit trail of all item activities

User Management
Role-based Access - Admin and Officer roles with different permissions

PIN Authentication - Secure login system for staff

User Profiles - Manage finder and claimer information

Smart Features
Auto Item Numbers - Sequential numbering starting from 1

Image Compression - Automatic photo optimization for storage

Date Formatting - User-friendly date/time display with AM/PM

Pagination - Efficient browsing of large item lists

Status Management - Track items as Available or Claimed

🛠️ Tech Stack
Backend:

Laravel 11

MySQL Database

RESTful API

Frontend:

React 18

Vite

Modern JavaScript

📋 System Logic
Items to be Cleared
Items appear for clearing when they meet ALL criteria:

✅ Status: Available (unclaimed)

✅ Age: Found 7+ days ago

✅ Value: Non-valuable items only

Item Categories
School Supplies

Gadgets/Electronics

Personal Belongings

Clothing

User Roles
Admin - Full system access, can edit/delete items

Officer - Can register items, process claims, view reports

🚀 Quick Start
Backend Setup
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve

Copy
bash
Frontend Setup
cd my-app
npm install
npm run dev

Copy
bash
📊 Database Structure
Items - Main lost items data

History - Activity tracking

Pins - User authentication

Pending Edits - Approval workflow

Rejection Comments - Feedback system

🔧 Configuration
The system includes:

Environment-based configuration

Automatic database seeding with 12 sample items

Image upload and compression

Responsive design for all devices

📝 API Endpoints
GET /api/items - List available items

POST /api/items - Register new item

POST /api/items/{id}/claim - Claim an item

GET /api/items/to-be-cleared - Items for clearing

GET /api/history - View activity history

🎯 Perfect For
Schools and Universities

Office Buildings

Community Centers

Event Venues

Any organization handling lost items

📄 License
Open source project - feel free to use and modify for your needs.

Built for efficient lost and found management with user-friendly interface and robust tracking capabilities.
