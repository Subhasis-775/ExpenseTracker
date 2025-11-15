# ExpenseTracker
🚀 A full-stack placement tracker project built with React, Node.js, Express, and MongoDB. Features include authentication (JWT), user dashboard, resume upload, application status tracking, and analytics. Designed to help students manage and monitor placement activities efficiently.


Smart Expense Tracker with AI
🔥 Overview

A full-stack web application to manage personal finances smarter, featuring:

AI-powered insights — smart category suggestions & spending trends

Recurring expense automation using node-cron

Interactive charts and PDF reports

Responsive UI with Tailwind CSS + Dark Mode


(Replace with your GIF or screenshots)

🛠️ Features
Core Features

Secure Authentication: JWT-based login ensures private user data

CRUD Expenses: Add, edit, delete, and view expenses

Filters & Sorting: Filter by category, date range, or amount; sort by date or amount

Recurring Expenses: Automatic daily, weekly, or monthly expense tracking

AI-Powered

Smart Categorization: Suggests categories for new expenses

Spending Insights: Highlights trends and anomalies for better financial decisions

Analytics & Reporting

Interactive Charts: Category-wise and monthly spending trends

PDF Reports: Generate downloadable monthly summaries

UI/UX

Responsive Design: Works across devices

Dark Mode Toggle: Tailwind CSS theme integration

Smooth UX: Loading states, error handling, and user-friendly interactions

⚙️ Tech Stack
Frontend	Backend	Database	Other
React	Node.js	MongoDB	JWT Auth
Tailwind CSS	Express.js	Mongoose	node-cron
Recharts	pdfkit / jspdf		AI categorization
🚀 Installation (Run Locally)
# Clone the repository
git clone https://github.com/yourusername/smart-expense-tracker.git
cd smart-expense-tracker

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install


Create a .env file in backend:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000


Run the app:

# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm start



📈 Screenshots / GIFs


Dashboard:

Charts & Analytics:

AI Insights:



📄 License

This project is MIT licensed.
