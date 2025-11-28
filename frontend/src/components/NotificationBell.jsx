import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { Bell } from 'lucide-react';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/api/recurring');
      console.log('📋 Recurring expenses:', response.data);
      
      // Filter for expenses due in the next 3 days
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const threeDaysLater = new Date();
      threeDaysLater.setDate(today.getDate() + 3);
      threeDaysLater.setHours(23, 59, 59, 999);

      console.log('📅 Date range:', { today, threeDaysLater });

      const alerts = response.data
        .filter(item => {
          const dueDate = new Date(item.nextDue);
          dueDate.setHours(0, 0, 0, 0);
          const isInRange = dueDate >= today && dueDate <= threeDaysLater;
          console.log(`💡 ${item.title}: ${dueDate.toLocaleDateString()} - In range: ${isInRange}`);
          return isInRange;
        })
        .map(item => ({
          id: item._id,
          title: 'Upcoming Expense',
          message: `${item.title} of ₹${item.amount} is due on ${new Date(item.nextDue).toLocaleDateString()}`,
          type: 'warning',
          date: new Date(item.nextDue)
        }));

      console.log('🔔 Notifications:', alerts);
      setNotifications(alerts);
      setHasUnread(alerts.length > 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      setHasUnread(false); // Mark as read when opened
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleBellClick}
        className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      >
        <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        {hasUnread && (
          <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse"></span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-fade-in-down">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Notifications</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">{notifications.length} New</span>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <p>No new notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700/50 last:border-0"
                >
                  <div className="flex items-start">
                    <div className="w-2 h-2 mt-2 rounded-full bg-amber-500 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
