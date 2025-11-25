# 💰 ExpenseTracker Pro

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D%2016.0.0-brightgreen)
![React](https://img.shields.io/badge/react-%5E18.2.0-blue)
![MongoDB](https://img.shields.io/badge/mongodb-atlas-green)

**A production-grade, full-stack personal finance management application featuring AI-powered insights, secure payments, and advanced analytics.**

---

## 🌟 Overview

ExpenseTracker Pro is not just another expense logger. It's a comprehensive financial companion designed to help users take control of their money. Built with a modern tech stack (MERN), it leverages **Google Gemini AI** for smart financial advice, **Razorpay** for seamless bill payments, and **Nodemailer** for automated email reports.

The application features a stunning **Glassmorphism UI**, fully responsive design, and a robust backend ensuring security and scalability.

---

## ✨ Key Features

### 🎨 Modern UI/UX
- **Glassmorphism Design:** Premium aesthetic with translucent cards and vibrant gradients.
- **Dark Mode:** Fully integrated dark theme for comfortable night usage.
- **Responsive Layout:** Seamless experience across Desktop, Tablet, and Mobile.
- **Interactive Animations:** Smooth transitions and micro-interactions using CSS animations.

### 🤖 AI-Powered Intelligence
- **Smart Categorization:** AI automatically suggests categories for your expenses.
- **Financial Advisor Chat:** Chat with our AI assistant to get personalized financial advice.
- **Spending Insights:** AI analyzes your spending patterns to identify savings opportunities.

### 📊 Advanced Analytics
- **Interactive Charts:** Visualize spending with Pie Charts, Bar Graphs, and Line Charts (Recharts).
- **Weekly Trends:** Track your spending habits week-over-week.
- **Category Breakdown:** Deep dive into where your money goes.
- **PDF Reports:** Generate professional monthly expense reports with a single click.

### 💳 Payments & Recurring
- **Razorpay Integration:** Securely pay bills directly from the dashboard.
- **Recurring Manager:** Automate fixed expenses like Rent, Netflix, and Gym memberships.
- **Payment History:** Keep a detailed log of all your transactions.

### 📧 Notifications
- **Email Alerts:** Get notified about successful payments and recurring expense reminders.
- **Monthly Summaries:** Automated email summaries of your financial health.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS, Custom CSS (Glassmorphism)
- **State Management:** React Context API
- **Routing:** React Router DOM
- **Charts:** Recharts
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens) & Bcrypt
- **AI Engine:** Google Gemini API
- **Payments:** Razorpay API
- **Email:** Nodemailer (Gmail SMTP)
- **Scheduling:** Node-cron
- **PDF Generation:** PDFKit

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas Account
- Razorpay Account
- Google Gemini API Key
- Gmail Account (for App Password)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/expense-tracker-pro.git
cd expense-tracker-pro
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key

# AI Configuration
GEMINI_API_KEY=your_google_gemini_api_key

# Payment Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Start the frontend development server:
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## � API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Expenses
- `GET /api/expenses` - Get all expenses (supports filtering)
- `POST /api/expenses` - Add a new expense
- `DELETE /api/expenses/:id` - Delete an expense

### Analytics
- `GET /api/analytics/weekly` - Get weekly spending trends
- `GET /api/analytics/category-comparison` - Compare spending across categories
- `GET /api/analytics/monthly-comparison` - Monthly spending comparison

### Reports
- `GET /api/reports` - Generate PDF report

### AI
- `POST /api/ai/chat` - Chat with AI financial assistant

---

## � Project Structure

```
expense-tracker-pro/
├── backend/
│   ├── config/         # DB, Email, Payment configs
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Auth, Error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── utils/          # Helper functions (Email templates)
│   └── index.js        # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/ # Reusable components (Cards, Charts)
    │   ├── context/    # Global state (Auth, DarkMode)
    │   ├── pages/      # Main pages (Dashboard, Login)
    │   ├── services/   # API calls
    │   └── index.css   # Global styles & Tailwind
    └── vite.config.js
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Subhasis**

- [GitHub](https://github.com/yourusername)
- [LinkedIn](https://linkedin.com/in/yourusername)

---

*Built with ❤️ for better financial health.*
