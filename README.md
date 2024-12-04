# 📋 Invoice Management System

## 🌐 Project Overview

The Invoice Management System is a robust web application designed to streamline invoice tracking and management. Built with modern web technologies, this system provides a comprehensive solution for businesses to create, manage, and track invoices efficiently.

## ✨ Key Features

- **Invoice Creation**: Easily generate new invoices with detailed information
- **Comprehensive Management**: View, edit, and track invoice details
- **User-Friendly Interface**: Intuitive design powered by Material-UI
- **Efficient API**: RESTful endpoints for seamless integration

## 🛠 Technology Stack

| Technology | Description |
|-----------|-------------|
| **Frontend** | React |
| **Backend** | Django |
| **UI Library** | Material-UI |
| **Architecture** | RESTful API |

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- 🐍 Python (latest stable version)
- 🟢 Node.js (latest LTS version)
- 📦 npm (Node Package Manager)

## 🚀 Installation and Setup

### Backend Setup (Django)

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd [project-directory]
   ```

2. Create and activate a virtual environment:
   ```bash
   # Create virtual environment
   python -m venv venv

   # Activate (Unix/macOS)
   source venv/bin/activate

   # Activate (Windows)
   venv\Scripts\activate
   ```

3. Install Django dependencies:
   ```bash
   pip install mysqlclient django-cors-headers
   ```

### Frontend Setup (React)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

## 🖥 Running the Application

### Start Django Backend

```bash
# Ensure you're in the project root
# Activate virtual environment if not already active
python manage.py runserver
```

### Start React Frontend

```bash
# Navigate to frontend directory
cd frontend
npm run dev
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/invoices` | Retrieve all invoices |
| `POST` | `/api/invoices` | Create a new invoice |
| `GET` | `/api/invoices/{id}` | Retrieve specific invoice |
| `PUT` | `/api/invoices/{id}` | Update an existing invoice |
| `DELETE` | `/api/invoices/{id}` | Delete a specific invoice |

## 📦 Data Models

### Invoice Model
- Tracks core invoice information
- Includes fields for:
  - Invoice number
  - Client details
  - Total amount
  - Status

### Invoice Details Model
- Provides granular invoice tracking
- Supports detailed line-item information

## 🤝 Contributing

Interested in contributing? Follow these steps:

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request



## 📞 Contact

**Project Maintainer**: Shrey Varad Dwivedi
**Email**: 22je0919@iitism.ac.in
**GitHub**: linkali2004

---

**Note**: This project is actively maintained. Please report any issues or suggestions through GitHub Issues.
