# 💰 ExpenseTracker Pro - AI-Powered Finance Manager

<div align="center">

![ExpenseTracker Banner](https://img.shields.io/badge/ExpenseTracker-Pro-2563eb?style=for-the-badge&logo=wallet&logoColor=white)

**A production-grade personal finance application built with the MERN stack, featuring AI insights, secure payments, gamification, and automated reporting.**

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

**ExpenseTracker Pro** is a comprehensive full-stack application designed to modernize personal finance management. Unlike traditional trackers, it leverages **Google Gemini 2.0 AI** to provide smart spending insights, integrates **Razorpay** for direct bill payments and premium subscriptions, and uses **Nodemailer** for automated weekly/monthly email reports.

The application features a stunning **Glassmorphism UI** with dark mode support, ensuring a premium user experience across all devices.

---

## ✨ Features

### 💎 Core Features
- **Smart Expense Tracking** - Add, edit, and categorize expenses with auto-categorization using AI
- **AI Auto-Categorization** - Gemini AI automatically suggests categories based on expense titles
- **Recurring Manager** - Automate fixed expenses like subscriptions and rent
- **Budget Management** - Set category-wise budgets with real-time tracking
- **Smart Budget Alerts** - Get notified when approaching or exceeding budgets with predictions
- **Split Bills** - Create groups for shared expenses with automatic balance calculation
- **Settle Up** - Integrated Razorpay payment for settling group debts
- **Secure Payments** - Razorpay gateway for real-time bill payments
- **AI Financial Advisor** - Chat with Gemini 2.0 AI for personalized financial advice
- **Automated Reports** - PDF generation and email summaries via Nodemailer

### 🎨 UI/UX Features
- **Glassmorphism Design** - Modern, translucent aesthetics with vibrant gradients
- **Dark/Light Mode** - Seamless theme switching with persistent state
- **Interactive Charts** - Visual analytics using Recharts (Pie, Bar, Line, Stacked charts)
- **Responsive Layout** - Mobile-first design using Tailwind CSS
- **Micro-interactions** - Smooth animations for buttons, cards, and transitions
- **Toast Notifications** - Real-time feedback for all user actions
- **This Month Summary Card** - Enhanced dashboard with month-over-month comparisons
- **Upcoming Expenses** - Visual timeline of scheduled payments
- **Receipt Scanner** - Upload and manage receipt images

### 🚀 Advanced Features

#### **Premium Subscription** 👑
- Razorpay-powered subscription system
- Unlock Pro features (unlimited groups, advanced AI reports)
- ₹499/month pricing
- Instant status updates
- Test mode support

#### **Gamification** 🏆
- **Achievement Badges** - Unlock badges for financial milestones
  - Budget Master (stayed under budget for 3 months)
  - Savings Star (saved ₹5000 this month)
  - Early Bird (added expense before 9 AM)
- Dynamic badge earning based on user activity
- Visual badge showcase on profile

#### **Split Bills & Groups** 👥
- Create expense sharing groups
- Add members and track balances
- Automatic split calculation
- "Settle Up" feature with Razorpay payment
- Real-time balance updates
- Group expense history

#### **Smart Dashboard Insights** 📊
- **This Month Summary** showing:
  - Total spent this month
  - Month-over-month comparison (↑↓ percentage)
  - Top spending category
  - Daily average spending
  - AI-powered insights
- **Budget Alerts** with:
  - Real-time usage percentage
  - Days and amount remaining
  - Predictive analytics ("Will exceed in 3 days")
  - Color-coded warnings (green/yellow/red)

### 🤖 AI-Powered Features
- **Auto-Categorization** - Uses Gemini 2.0 Flash to classify expenses
- **Fallback System** - Keyword-based categorization when AI is unavailable
- **Intelligent Chat** - Ask questions about spending patterns
- **Personalized Insights** - Get advice based on your financial data
- **Predictive Analytics** - Budget forecasting and trend analysis

### 🔐 Security Features
- JWT token-based authentication
- Password hashing with bcrypt (10 rounds)
- Protected API routes with authMiddleware
- Secure environment variable management
- Razorpay signature verification for payments
- Input validation and sanitization
- Rate limiting on sensitive endpoints

### 📧 Notification Features
- Email notifications for budget alerts (80%, 100%)
- Weekly expense summaries
- Monthly spending reports
- Payment confirmations
- Achievement unlocks

---

## 🎬 Demo

### Key Pages

#### Dashboard (Dark Mode)
![Dashboard](https://github.com/user-attachments/assets/placeholder-dashboard-dark)

#### AI Chat Interface
![AI Chat](https://github.com/user-attachments/assets/placeholder-ai-chat)

#### Payment Gateway
![Payments](https://github.com/user-attachments/assets/placeholder-payments)

### Live Demo
🔗 [Live Demo Link](https://expense-tracker-pro-demo.vercel.app/)

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library with Hooks and Context API
- **Vite** - Next-generation build tool for faster development
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Composable charting library
- **Lucide React** - Beautiful & consistent icons (200+ icons)
- **Axios** - HTTP client with interceptors
- **React Hot Toast** - Elegant notifications
- **React Router DOM v6** - Client-side routing

### Backend
- **Node.js (v16+)** - JavaScript runtime environment
- **Express.js** - Minimal web framework
- **MongoDB** - NoSQL Database for flexible data storage
- **Mongoose** - Elegant ODM for MongoDB
- **JWT** - Secure token-based authentication
- **Bcrypt** - Industry-standard password hashing
- **Nodemailer** - Email service for notifications
- **Node-cron** - Task scheduling for automated jobs
- **PDFKit** - Professional PDF report generation

### Integrations
- **Google Gemini 2.0** - Advanced AI for categorization and insights
- **Razorpay** - Secure payment gateway (₹499 subscriptions, bill pays, settlements)

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
  │ Gemini 2.0  │  │ Razorpay │  │ Gmail  │  │  PDFKit  │
  │     AI      │  │ Payments │  │  SMTP  │  │  Engine  │
  └─────────────┘  └──────────┘  └────────┘  └──────────┘
```

### Data Flow Examples

#### 1. **User Authentication**
```
User → Login Form → POST /api/auth/login → Verify credentials → Issue JWT → Store in localStorage
```

#### 2. **Auto-Categorization**
```
User enters title → onBlur → POST /api/ai/categorize → Gemini 2.0 → Returns category → Auto-fill form
```

#### 3. **Payment Processing**
```
User pays bill → POST /api/payments/create-order → Razorpay → Verify signature → Create expense → Update DB
```

#### 4. **Budget Alerts**
```
Add expense → Update budget usage → Check threshold → Send email alert → Show dashboard notification
```

#### 5. **Split Bill Settlement**
```
Click "Settle Up" → Create Razorpay order → Process payment → Verify → Add settlement expense → Update balances
```

---

## 📦 Installation

### Prerequisites
- **Node.js** (v16+)
- **MongoDB Atlas** Account (or local MongoDB)
- **Razorpay** Account (Test/Live mode)
- **Google Gemini API** Key
- **Gmail Account** with App Password enabled

### Clone Repository
```bash
git clone https://github.com/Subhasis-775/ExpenseTracker.git
cd ExpenseTracker
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
JWT_SECRET=your_jwt_secret_key_min_32_chars
GEMINI_API_KEY=your_gemini_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

Start backend server:
```bash
npm run dev
# Server runs on http://localhost:5000
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
# App runs on http://localhost:5173
```

### Testing Payment Features
**Razorpay Test Credentials:**
- Card Number: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits
- OTP: `123456`

---

## 🔐 Environment Variables

### Backend (.env)
| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `5000` | Yes |
| `MONGO_URL` | MongoDB connection string | `mongodb+srv://...` | Yes |
| `JWT_SECRET` | Secret for token signing | `my-super-secret-key-32-chars-min` | Yes |
| `GEMINI_API_KEY` | Google Gemini AI API Key | `AIzaSy...` | Yes |
| `RAZORPAY_KEY_ID` | Payment Gateway ID | `rzp_test_...` | Yes |
| `RAZORPAY_KEY_SECRET` | Payment Gateway Secret | `abc123...` | Yes |
| `EMAIL_USER` | Gmail address for alerts | `user@gmail.com` | Yes |
| `EMAIL_PASSWORD` | Gmail App Password | `abcd efgh ijkl mnop` | Yes |

### Frontend (.env)
| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` | Yes |
| `VITE_RAZORPAY_KEY_ID` | Razorpay Public Key | `rzp_test_...` | Yes |

**Note:** Never commit `.env` files to version control. Use `.env.example` for templates.

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}

Response: 201 Created
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "name": "John Doe", "isPremium": false }
}
```

#### Upgrade to Premium
```http
POST /api/auth/upgrade
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Successfully upgraded to premium!",
  "user": { "isPremium": true }
}
```

### Expense Endpoints

#### Get All Expenses (with filters)
```http
GET /api/expenses?category=Food&sort=newest&limit=10&page=1
Authorization: Bearer <token>

Response: 200 OK
{
  "expenses": [...],
  "total": 50,
  "pages": 5
}
```

#### Add Expense
```http
POST /api/expenses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Grocery Shopping",
  "amount": 1500,
  "category": "Food",
  "date": "2025-11-26",
  "notes": "Bought vegetables and fruits"
}

Response: 201 Created
{
  "expense": { "id": "...", "title": "Grocery Shopping", ... }
}
```

#### Update Expense
```http
PUT /api/expenses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1600,
  "notes": "Updated amount"
}
```

#### Delete Expense
```http
DELETE /api/expenses/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Expense deleted successfully"
}
```

### Budget Endpoints

#### Get Budgets
```http
GET /api/budgets?month=11&year=2025
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "category": "Food",
      "amount": 10000,
      "month": 11,
      "year": 2025,
      "spent": 7500
    }
  ]
}
```

#### Set Budget
```http
POST /api/budgets
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "Food",
  "amount": 10000,
  "month": 11,
  "year": 2025
}
```

### AI Endpoints

#### Auto-Categorize Expense
```http
POST /api/ai/categorize
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Uber to office",
  "description": "Morning commute"
}

Response: 200 OK
{
  "category": "Travel",
  "confidence": "high",
  "method": "ai"
}
```

#### Chat with AI
```http
POST /api/ai/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "How can I reduce my food expenses?"
}

Response: 200 OK
{
  "answer": "Based on your spending, you spent ₹8,500 on Food this month...",
  "method": "ai"
}
```

### Payment Endpoints

#### Create Payment Order
```http
POST /api/payments/create-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 499,
  "description": "Premium Subscription",
  "category": "Subscription"
}

Response: 200 OK
{
  "orderId": "order_...",
  "amount": 49900,
  "currency": "INR"
}
```

#### Verify Payment
```http
POST /api/payments/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "razorpay_order_id": "order_...",
  "razorpay_payment_id": "pay_...",
  "razorpay_signature": "abc123..."
}

Response: 200 OK
{
  "success": true,
  "message": "Payment verified successfully"
}
```

### Group Endpoints

#### Get All Groups
```http
GET /api/groups
Authorization: Bearer <token>

Response: 200 OK
{
  "groups": [...]
}
```

#### Create Group
```http
POST /api/groups
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Roommates",
  "members": ["Alice", "Bob", "Charlie"]
}
```

#### Add Group Expense
```http
POST /api/groups/:id/expenses
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Electricity Bill",
  "amount": 1500,
  "paidBy": "Alice",
  "splitBetween": ["Alice", "Bob", "Charlie"]
}
```

---

## 📁 Project Structure

```
ExpenseTracker/
├── backend/
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   ├── emailConfig.js           # Nodemailer setup
│   │   └── razorpayConfig.js        # Payment gateway
│   ├── controllers/
│   │   ├── aiController.js          # Gemini AI logic
│   │   ├── analyticsController.js   # Data aggregation
│   │   ├── authControllers.js       # Auth & Premium upgrade
│   │   ├── budgetController.js      # Budget CRUD
│   │   ├── expenseController.js     # Expense CRUD
│   │   ├── groupController.js       # Split bills logic
│   │   ├── notificationController.js # Alerts
│   │   ├── paymentController.js     # Razorpay integration
│   │   ├── recurringControl.js      # Automated expenses
│   │   └── reportController.js      # PDF generation
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT verification
│   ├── models/
│   │   ├── budgetModel.js           # Budget schema
│   │   ├── expenseModel.js          # Expense schema
│   │   ├── groupModel.js            # Group schema
│   │   ├── paymentModel.js          # Payment schema
│   │   ├── recurringModel.js        # Recurring schema
│   │   ├── splitExpenseModel.js     # Split expense schema
│   │   └── user.js                  # User schema (isPremium)
│   ├── routes/
│   │   ├── aiRoutes.js              # /api/ai/*
│   │   ├── analyticsRoutes.js       # /api/analytics/*
│   │   ├── authRoutes.js            # /api/auth/*
│   │   ├── budgetRoutes.js          # /api/budgets/*
│   │   ├── expenseRoutes.js         # /api/expenses/*
│   │   ├── groupRoutes.js           # /api/groups/*
│   │   ├── paymentRoutes.js         # /api/payments/*
│   │   ├── recurringRoutes.js       # /api/recurring/*
│   │   └── reportsRoute.js          # /api/reports/*
│   ├── utils/
│   │   ├── authEmailTemplates.js    # Email HTML templates
│   │   └── emailTemplates.js        # Notification templates
│   ├── .env                         # Environment variables
│   ├── index.js                     # Server entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html               # Razorpay script loaded
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/
│   │   │   │   ├── CategoryPieChart.jsx
│   │   │   │   ├── MonthlyBarChart.jsx
│   │   │   │   ├── WeeklyLineChart.jsx
│   │   │   │   └── CategoryStackedBarChart.jsx
│   │   │   ├── AIChatBox.jsx        # AI chat interface
│   │   │   ├── BudgetAlerts.jsx     # Smart budget alerts 🆕
│   │   │   ├── ExpenseFilter.jsx    # Filter controls
│   │   │   ├── ExpenseList.jsx      # Expense table
│   │   │   ├── Layout.jsx           # Sidebar + Header
│   │   │   ├── NotificationBell.jsx # Alerts dropdown
│   │   │   ├── ReceiptScanner.jsx   # Upload receipts
│   │   │   └── UpcomingExpenses.jsx # Timeline view
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Auth state
│   │   │   ├── AuthProvider.jsx     # Auth provider (with setUser)
│   │   │   ├── DarkModeContext.jsx  # Theme state
│   │   │   └── DarkModeProvider.jsx # Theme provider
│   │   ├── pages/
│   │   │   ├── BudgetPage.jsx       # Budget manager
│   │   │   ├── Dashboard.jsx        # Main dashboard 🆕 Enhanced
│   │   │   ├── GroupDetailsPage.jsx # Split bill details
│   │   │   ├── Groups.jsx           # Group list
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── PaymentPage.jsx      # Payment gateway
│   │   │   ├── Profile.jsx          # User profile + badges 🆕
│   │   │   ├── RecurringManager.jsx # Recurring expenses
│   │   │   ├── Signup.jsx           # Registration
│   │   │   └── SubscriptionPage.jsx # Premium upgrade 🆕
│   │   ├── services/
│   │   │   ├── api.js               # Axios instance
│   │   │   ├── budget.js            # Budget API calls
│   │   │   ├── expenses.js          # Expense API calls
│   │   │   ├── payment.js           # Payment API calls 🆕
│   │   │   └── report.js            # PDF download
│   │   ├── App.jsx                  # Route definitions
│   │   ├── index.css                # Tailwind + Custom animations
│   │   └── main.jsx                 # React entry point
│   ├── .env                         # Frontend env vars
│   ├── vite.config.js
│   └── package.json
│
└── README.md                        # This file!
```

---

## 🎯 Key Highlights

### 1. **AI-Driven Insights with Gemini 2.0**
- **Auto-Categorization**: Automatically classifies expenses ("Uber to office" → Travel)
- **Smart Fallback**: Keyword-based system when AI is offline
- **Intelligent Chat**: Ask natural questions ("Where am I overspending?")
- **Predictive Analytics**: Budget forecasting and trend detection

### 2. **Automated Financial Management**
- **Recurring Manager**: Auto-create expenses for subscriptions
- **Email Reports**: Weekly/monthly summaries sent to inbox
- **Budget Alerts**: Proactive notifications at 80% and 100% usage
- **Smart Predictions**: "You'll exceed budget in 3 days at current rate"

### 3. **Seamless Payment Integration**
- **Full Razorpay Integration**: Pay bills without leaving the app
- **Premium Subscriptions**: ₹499/month Pro plan
- **Split Bill Settlements**: Direct payment to settle group debts
- **Automatic Logging**: Transactions auto-recorded as expenses
- **Signature Verification**: Secure payment confirmation

### 4. **Gamification & Engagement**
- **Achievement System**: Unlock badges for financial milestones
- **Visual Rewards**: See badges on profile page
- **Dynamic Earning**: Real-time badge unlock based on activity
- **Motivation**: Encourages consistent expense tracking

### 5. **Visual Analytics Dashboard**
- **This Month Summary**: Month-over-month comparisons with insights
- **Budget Alerts**: Real-time usage tracking with predictions
- **Interactive Charts**: Pie, Bar, Line, and Stacked charts
- **Quick Stats**: Total spent, top category, daily average

### 6. **Social Expense Sharing**
- **Group Management**: Create groups for roommates/trips
- **Split Bills**: Automatic equal/custom splits
- **Balance Tracking**: Who owes whom
- **Easy Settlement**: Razorpay-powered "Settle Up" button

---

## 🚀 Future Enhancements

### Planned Features
- [x] **Budget Alerts** - Smart notifications ✅ **COMPLETED**
- [x] **Premium Subscription** - Razorpay integration ✅ **COMPLETED**
- [x] **Gamification** - Achievement badges ✅ **COMPLETED**
- [x] **Split Bills** - Group expense sharing ✅ **COMPLETED**
- [x] **This Month Summary** - Enhanced dashboard card ✅ **COMPLETED**
- [ ] **Multi-currency** - Support for USD, EUR, GBP
- [ ] **Receipt OCR** - Extract data from bill photos
- [ ] **Export to Excel** - CSV/Excel data export with charts
- [ ] **Social Login** - Google/GitHub OAuth integration
- [ ] **PWA Support** - Installable mobile app
- [ ] **Voice Input** - Add expenses via voice commands
- [ ] **Income Tracking** - Track multiple income sources
- [ ] **Financial Goals** - Set and track savings goals
- [ ] **Bank Integration** - Auto-import transactions (Plaid/Yodlee)
- [ ] **Advanced Search** - Filter by amount range, date, multiple categories

### Enhancement Ideas
- Dark theme variations (Nord, Dracula, etc.)
- Customizable dashboard widgets
- Expense templates for quick entry
- Category icons for better visualization
- Offline mode with sync
- Bulk actions (delete, categorize multiple expenses)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Coding Standards
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic
- Update README for new features
- Test payment flows in test mode before production

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Subhasis Rout**
- GitHub: [@Subhasis-775](https://github.com/Subhasis-775)
- LinkedIn: [Subhasis Rout](https://linkedin.com/in/subhasis-rout)
- Email: subhasisrout00@gmail.com

---

## 🙏 Acknowledgments

- **Google Gemini AI** for intelligent categorization
- **Razorpay** for seamless payment integration
- **Recharts** for beautiful data visualizations
- **Lucide React** for consistent iconography
- **Tailwind CSS** for rapid UI development

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [Subhasis](https://github.com/Subhasis-775)

**Happy Tracking! 💰**

</div>
