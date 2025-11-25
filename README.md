# ExpenseTracker

🚀 **Smart Expense Tracker with AI & Payment Gateway Integration**

A full-stack web application to manage personal finances smarter, built with React, Node.js, Express, and MongoDB.

---

## 🔥 Overview

A comprehensive expense management solution featuring:

✅ **AI-powered insights** — Smart spending analysis with Gemini AI
✅ **Razorpay Payment Gateway** — Secure bill payments with automatic expense tracking
✅ **Recurring expense automation** — Set it and forget it with node-cron
✅ **Interactive analytics** — Beautiful charts and PDF reports
✅ **Dark mode** — Fully responsive UI with Tailwind CSS

---

## 🛠️ Features

### Core Features

- **Secure Authentication:** JWT-based login ensures private user data
- **CRUD Expenses:** Add, edit, delete, and view expenses with real-time updates
- **Filters & Sorting:** Filter by category, date range, or amount; multiple sort options
- **Recurring Expenses:** Automatic daily, weekly, or monthly expense tracking
- **🆕 Payment Gateway:** Razorpay integration for bill payments with automatic expense creation

### AI-Powered

- **Smart Insights:** AI-powered spending analysis and recommendations
- **Spending Trends:** Highlights patterns and anomalies for better financial decisions
- **Chat Interface:** Interactive AI chatbot for finance queries

### Analytics & Reporting

- **Interactive Charts:** Category-wise pie charts and monthly bar chart trends
- **PDF Reports:** Generate and download monthly expense summaries
- **Payment History:** Track all payment transactions with status badges

### UI/UX

- **Responsive Design:** Works seamlessly across all devices
- **Dark Mode Toggle:** Complete dark mode support with Tailwind CSS
- **Smooth Interactions:** Loading states, error handling, and toast notifications
- **Modern Design:** Gradients, glassmorphism, and smooth animations

---

## ⚙️ Tech Stack

| **Frontend** | **Backend** | **Database** | **Payment** | **Other** |
|--------------|-------------|--------------|-------------|-----------|
| React | Node.js | MongoDB | Razorpay | JWT Auth |
| Tailwind CSS | Express.js | Mongoose | | node-cron |
| Recharts | pdfkit | | | Gemini AI |
| React Router | crypto | | | |

---

## 🚀 Installation (Run Locally)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 4. Run the Application

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 💳 Razorpay Payment Integration

### Features
- **Secure Payments:** Industry-standard encryption and signature verification
- **Auto Expense Creation:** Successful payments automatically create expense entries
- **Payment History:** Track all transactions with status badges
- **Test Mode:** Test with Razorpay test cards before going live

### Test Cards

Use these test cards in Razorpay test mode:

**Success:**
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failure:**
- Card: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

---

## 📸 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)
*Main dashboard with expense summary, analytics, and quick actions*

### Payment Gateway
![Payments](screenshots/payments.png)
*Razorpay payment integration with history tracking*

### Charts & Analytics
![Analytics](screenshots/analytics.png)
*Interactive charts showing spending trends*

### AI Chat
![AI Chat](screenshots/ai-chat.png)
*AI-powered financial insights and recommendations*

---

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Razorpay signature verification
- Secure environment variable management
- Protected API routes
- User-specific data isolation

---

## 📱 Key Pages

- **Dashboard:** Overview with summary cards, charts, and recent expenses
- **Payments:** Make payments and view payment history
- **Recurring Manager:** Set up and manage recurring expenses
- **Profile:** User profile and settings

---

## 🎯 Upcoming Features

- [ ] Advanced analytics with weekly trends
- [ ] Email notifications for expenses and payments
- [ ] Role-based access (Admin panel)
- [ ] Expense categories customization
- [ ] Multi-currency support
- [ ] Expense sharing between users

---

## 📄 License

This project is MIT licensed.

---

## 👨‍💻 Author

Built with ❤️ by Subhasis

---

## 🙏 Acknowledgments

- Razorpay for payment gateway
- Google Gemini for AI capabilities
- Recharts for beautiful visualizations
- Tailwind CSS for styling
