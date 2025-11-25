import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, PieChart, Shield, Zap, TrendingUp, DollarSign, Bell } from "lucide-react";
import DarkModeToggle from "../components/DarkModeToggle";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-300">
      {/* Navigation Bar */}
      <nav className="glass sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/30">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                ExpenseTracker
              </span>
            </div>
            <div className="flex items-center gap-4">
              <DarkModeToggle />
              <Link
                to="/login"
                className="hidden sm:block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="btn-primary py-2 px-4 text-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl float-delayed"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 mb-8 fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-sm font-medium">New: AI-Powered Insights</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 fade-in slide-up">
            Master Your Money <br />
            <span className="gradient-text">With Confidence</span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-10 fade-in slide-up" style={{ animationDelay: "0.1s" }}>
            Track expenses, manage recurring bills, and gain intelligent insights into your spending habits. The smart way to financial freedom.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 fade-in slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/signup" className="btn-primary flex items-center justify-center gap-2 group text-lg px-8 py-4">
              Start Tracking Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="btn-secondary flex items-center justify-center gap-2 text-lg px-8 py-4">
              Log In
            </Link>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 relative fade-in slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-transparent to-transparent z-10 h-full w-full pointer-events-none"></div>
            <div className="glass-card p-2 rounded-2xl max-w-5xl mx-auto transform hover:scale-[1.01] transition-transform duration-500">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                  alt="Dashboard Preview" 
                  className="w-full h-auto opacity-90 dark:opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-white dark:bg-gray-900/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Everything you need to grow</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Powerful features to help you take control of your finances.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<PieChart className="w-6 h-6 text-blue-500" />}
              title="Visual Analytics"
              description="Visualize your spending patterns with interactive charts and graphs. Understand where your money goes at a glance."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-yellow-500" />}
              title="AI Categorization"
              description="Our smart AI automatically categorizes your expenses, saving you time and ensuring accurate tracking."
            />
            <FeatureCard 
              icon={<Bell className="w-6 h-6 text-red-500" />}
              title="Smart Alerts"
              description="Get notified about recurring bills and unusual spending patterns. Never miss a payment again."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-green-500" />}
              title="Bank-Grade Security"
              description="Your financial data is encrypted and secure. We prioritize your privacy and data protection."
            />
            <FeatureCard 
              icon={<TrendingUp className="w-6 h-6 text-purple-500" />}
              title="Goal Tracking"
              description="Set financial goals and track your progress. Stay motivated as you save for what matters."
            />
            <FeatureCard 
              icon={<DollarSign className="w-6 h-6 text-indigo-500" />}
              title="Recurring Manager"
              description="Easily manage subscriptions and recurring payments in one place. Cancel unwanted services effortlessly."
            />
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-blue-50/50 to-transparent dark:via-blue-900/10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Loved by thousands</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">See what our users have to say about ExpenseTracker.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Sarah Johnson"
              role="Freelancer"
              image="https://randomuser.me/api/portraits/women/44.jpg"
              content="This app completely changed how I manage my finances. The AI categorization is a game-changer!"
              delay="0s"
            />
            <TestimonialCard 
              name="Michael Chen"
              role="Small Business Owner"
              image="https://randomuser.me/api/portraits/men/32.jpg"
              content="I love the recurring expense manager. It saved me over $500 in unwanted subscriptions in the first month."
              delay="0.2s"
            />
            <TestimonialCard 
              name="Emily Davis"
              role="Student"
              image="https://randomuser.me/api/portraits/women/68.jpg"
              content="The visual analytics make it so easy to see where my money is going. Highly recommend for students!"
              delay="0.4s"
            />
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 bg-white dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Everything you need to know about ExpenseTracker.</p>
          </div>

          <div className="space-y-6">
            <FAQItem 
              question="Is ExpenseTracker really free?"
              answer="Yes! We offer a generous free plan that includes all core features. We also have premium features for power users."
            />
            <FAQItem 
              question="How secure is my data?"
              answer="We use bank-grade encryption to protect your data. We never sell your personal information to third parties."
            />
            <FAQItem 
              question="Can I export my data?"
              answer="Absolutely. You can export your expense reports to PDF or CSV formats at any time."
            />
            <FAQItem 
              question="Does it work on mobile?"
              answer="Yes, ExpenseTracker is fully responsive and works great on all devices, including smartphones and tablets."
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card p-12 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 z-0"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">Ready to take control?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Join thousands of users who are mastering their finances with ExpenseTracker.
              </p>
              <Link to="/signup" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2 group">
                Create Free Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">No credit card required • Free forever plan available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">ExpenseTracker</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © 2025 ExpenseTracker. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">Terms</a>
            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="glass-card p-6 rounded-2xl hover:shadow-xl transition-all duration-300 group">
    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-gray-100 dark:border-gray-700">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
  </div>
);

const TestimonialCard = ({ name, role, image, content, delay }) => (
  <div className="glass-card p-6 rounded-2xl hover:shadow-xl transition-all duration-300 fade-in slide-up" style={{ animationDelay: delay }}>
    <div className="flex items-center gap-4 mb-4">
      <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover border-2 border-blue-500" />
      <div>
        <h4 className="font-bold text-gray-900 dark:text-white">{name}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
      </div>
    </div>
    <p className="text-gray-600 dark:text-gray-300 italic">"{content}"</p>
    <div className="flex gap-1 mt-4 text-yellow-500">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  </div>
);

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="glass-card rounded-xl overflow-hidden transition-all duration-300">
      <button 
        className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-gray-900 dark:text-white text-lg">{question}</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div 
        className={`px-6 text-gray-600 dark:text-gray-300 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-40 py-4 border-t border-gray-100 dark:border-gray-700' : 'max-h-0'
        }`}
      >
        {answer}
      </div>
    </div>
  );
};

export default HomePage;
