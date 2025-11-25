# 💰 ExpenseTracker Pro - AI-Powered Finance Manager

<div align="center">

![ExpenseTracker Banner](https://img.shields.io/badge/ExpenseTracker-Pro-2563eb?style=for-the-badge&logo=wallet&logoColor=white)

**A production-grade personal finance application built with the MERN stack, featuring AI insights, secure payments, and automated reporting.**

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=flat&logo=google&logoColor=white)](https://ai.google.dev/)
[![Razorpay](https://img.shields.io/badge/Razorpay-0C2444?style=flat&logo=razorpay&logoColor=white)](https://razorpay.com/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture) • [API Documentation](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Key Highlights](#-key-highlights)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**ExpenseTracker Pro** is a comprehensive full-stack application designed to modernize personal finance management. Unlike traditional trackers, it leverages **Google Gemini AI** to provide smart spending insights, integrates **Razorpay** for direct bill payments, and uses **Nodemailer** for automated weekly/monthly email reports.

The application features a stunning **Glassmorphism UI** with dark mode support, ensuring a premium user experience across all devices.

---

## ✨ Features

### � Core Features
- **Smart Expense Tracking** - Add, edit, and categorize expenses with ease
- **Recurring Manager** - Automate fixed expenses like subscriptions and rent
- **Secure Payments** - Integrated Razorpay gateway for real-time bill payments
- **AI Financial Advisor** - Chat with Gemini AI for personalized financial advice
- **Automated Reports** - PDF generation and email summaries via Nodemailer

### 🎨 UI/UX Features
- **Glassmorphism Design** - Modern, translucent aesthetics with vibrant gradients
- **Dark/Light Mode** - Seamless theme switching with persistent state
- **Interactive Charts** - Visual analytics using Recharts (Pie, Bar, Line charts)
- **Responsive Layout** - Mobile-first design using Tailwind CSS
- **Micro-interactions** - Smooth animations for buttons, cards, and transitions
- **Toast Notifications** - Real-time feedback for all user actions

### � Security Features
- JWT token-based authentication
- Password hashing with bcrypt
- Protected API routes
- Secure environment variable management
- Razorpay signature verification

---

## 🎬 Demo

### Screenshots

#### Dashboard (Dark Mode)
<img width="1889" height="865" alt="image" src="https://github.com/user-attachments/assets/2ff3c8a9-d0ac-467e-bc8c-bba12b5b0b56" />
<img width="1856" height="841" alt="image" src="https://github.com/user-attachments/assets/086e9c51-83d6-4c40-ace2-f37a0e68ab32" />
<img width="1738" height="744" alt="image" src="https://github.com/user-attachments/assets/253847ce-e41c-44da-8c4a-37cf0018db6d" />
<img width="1719" height="783" alt="image" src="https://github.com/user-attachments/assets/7d30583b-6899-4345-9951-5ba354919120" />

#### AI Chat Interface
<img width="494" height="691" alt="image" src="https://github.com/user-attachments/assets/0735079e-3105-49ef-b888-31993180e186" />

#### Recurring Expense Page
<img width="1845" height="770" alt="image" src="https://github.com/user-attachments/assets/83eb2e36-30eb-4c6d-9612-c191def95363" />
<img width="1483" height="839" alt="image" src="https://github.com/user-attachments/assets/c6612199-6379-411b-a6a5-5b77224e6561" />

#### Payment Gateway
<img width="966" height="750" alt="image" src="https://github.com/user-attachments/assets/9dc56d38-9ffd-4904-b982-93d6573fe0c4" />
<img width="1409" height="823" alt="image" src="https://github.com/user-attachments/assets/c4ea2bc9-1f68-4ec8-a880-2a8946aa3a09" />

#### Email Service
![WhatsApp Image 2025-11-25 at 5 21 18 PM](https://github.com/user-attachments/assets/b72182fe-35e0-49d2-bb94-6d4268fb9f55)


#### PDF Report
![Screenshot_2025-11-25-17-38-13-55_e2d5b3f32b79de1d45acd1fad96fbb0f](https://github.com/user-attachments/assets/e13c7d0b-1f7d-44eb-ae26-9626fe227a01)

#### Profile
<img width="1891" height="862" alt="image" src="https://github.com/user-attachments/assets/b08cc275-6c6d-4e52-92f4-73f654d2dd76" />

### Live Demo
🔗 https://expense-tracker-flame-gamma-90.vercel.app/

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library with Hooks
- **Vite** - Next-generation build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Composable charting library
- **Lucide React** - Beautiful & consistent icons
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email services
- **Node-cron** - Task scheduling
- **PDFKit** - PDF generation

### Integrations
- **Google Gemini AI** - Intelligent financial insights
- **Razorpay** - Payment gateway

---

## 🏗 Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Client   │◄───────►│  Express Server │◄───────►│    MongoDB      │
│  (Frontend)     │         │   (Backend)     │         │   (Database)    │
│                 │         │                 │         │                 │
└────────┬────────┘         └────────┬────────┘         └─────────────────┘
         │                           │
         │ REST API                  │
         │                           │
         │                  ┌────────▼────────┐
         │                  │   Third Party   │
         │                  │    Services     │
         │                  └────────┬────────┘
         │                           │
         │              ┌────────────┼────────────┐
         │              │            │            │
  ┌──────▼──────┐  ┌────▼─────┐  ┌───▼────┐  ┌────▼─────┐
  │   Gemini    │  │ Razorpay │  │ Gmail  │  │  PDFKit  │
  │     AI      │  │ Payments │  │  SMTP  │  │  Engine  │
  └─────────────┘  └──────────┘  └────────┘  └──────────┘
```

### Data Flow
1. **User Auth** - Secure login/signup with JWT issuance.
2. **Expense Entry** - User adds expense -> Stored in MongoDB.
3. **AI Analysis** - User asks question -> Backend queries Gemini -> Returns insight.
4. **Payment Processing** - User initiates pay -> Razorpay Order -> Verification -> Expense Created.
5. **Reporting** - Cron job triggers -> Aggregates data -> Generates PDF -> Sends Email.

---

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas Account
- Razorpay Account
- Google Gemini API Key
- Gmail Account (App Password)

### Clone Repository
```bash
git clone https://github.com/yourusername/expense-tracker-pro.git
cd expense-tracker-pro
```

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

Start backend server:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file in frontend directory:
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Start frontend:
```bash
npm run dev
```

---

## 🔐 Environment Variables

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for token signing | `mysecretkey123` |
| `GEMINI_API_KEY` | Google AI API Key | `AIzaSy...` |
| `RAZORPAY_KEY_ID` | Payment Gateway ID | `rzp_test_...` |
| `EMAIL_USER` | Gmail address for alerts | `user@gmail.com` |
| `EMAIL_PASSWORD` | Gmail App Password | `abcd efgh ijkl mnop` |

---

## 📚 API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Expenses

#### Get All Expenses
```http
GET /api/expenses?category=Food&sort=date
Authorization: Bearer <token>
```

#### Add Expense
```http
POST /api/expenses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Grocery",
  "amount": 500,
  "category": "Food",
  "date": "2023-10-25"
}
```

### Analytics & AI

#### Get Weekly Trends
```http
GET /api/analytics/weekly
Authorization: Bearer <token>
```

#### Chat with AI
```http
POST /api/ai/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "How can I save more on food?"
}
```

---

## 📁 Project Structure

```
expense-tracker-pro/
├── backend/
│   ├── config/           # DB & Service configs
│   ├── controllers/      # Logic for Auth, Expenses, AI
│   ├── middleware/       # Auth verification
│   ├── models/           # Mongoose Schemas
│   ├── routes/           # API Endpoints
│   ├── utils/            # Email templates, PDF generator
│   └── index.js          # Server entry
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Global state (Auth, Theme)
│   │   ├── pages/        # Dashboard, Login, Payments
│   │   ├── services/     # Axios API calls
│   │   └── index.css     # Tailwind & Custom styles
│   └── vite.config.js
│
└── README.md
```

---

## 🎯 Key Highlights

### 1. **AI-Driven Insights**
- Integrated Google Gemini to analyze spending patterns.
- Provides actionable advice (e.g., "You spent 20% more on dining out this week").

### 2. **Automated Financials**
- **Recurring Manager**: Automatically creates expenses for subscriptions.
- **Email Reports**: Weekly summaries sent directly to your inbox.

### 3. **Seamless Payments**
- Full Razorpay integration allowing users to pay bills without leaving the app.
- Automatic transaction logging upon payment success.

### 4. **Visual Analytics**
- Comprehensive dashboard with real-time charts.
- Compare monthly spending and track category-wise distribution.

---

## 🚀 Future Enhancements

- [ ] **Budget Goals** - Set monthly limits for categories
- [ ] **Multi-currency** - Support for USD, EUR, etc.
- [ ] **Receipt Scanning** - OCR to extract data from bills
- [ ] **Export to Excel** - CSV/Excel data export
- [ ] **Social Login** - Google/GitHub authentication
- [ ] **PWA Support** - Installable mobile app

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Subhasis Rout**
- GitHub: [Subhasis-775](https://github.com/Subhasis-775)
- LinkedIn: [Subhasis Rout](https://linkedin.com/in/subhasis-rout)
- Email: subhasisrout00@gmail.com

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [Subhasis](https://github.com/Subhasis-775)

</div>
