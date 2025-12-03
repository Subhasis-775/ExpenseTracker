// Enhanced Summary Card with Trend Indicators
const EnhancedSummaryCard = ({ title, value, trend, trendUp, icon, gradient, delay }) => (
  <div 
    className="group glass-card p-6 rounded-3xl animate-slide-up hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl" 
    style={{ animationDelay: delay }}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
        {icon}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full ${
          trendUp === false 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : trendUp === true
            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
        }`}>
          {trendUp === true && '↑'}
          {trendUp === false && '↓'}
          <span>{trend}</span>
        </div>
      )}
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
    </div>
  </div>
);

// Metric Card Component for This Month Summary
const MetricCard = ({ label, value, valueColor, subtitle }) => (
  <div className="bg-white/80 dark:bg-gray-700/50 p-5 rounded-2xl border border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg hover:scale-105 transition-all duration-200">
    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">{label}</p>
    <p className={`text-2xl md:text-3xl font-bold ${valueColor} mb-1`}>{value}</p>
    {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
  </div>
);

export { EnhancedSummaryCard, MetricCard };
