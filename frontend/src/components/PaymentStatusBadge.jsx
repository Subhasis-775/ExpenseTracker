const PaymentStatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-700 dark:text-green-400',
          border: 'border-green-300 dark:border-green-700',
          icon: '✓',
          label: 'Success',
        };
      case 'failed':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-700 dark:text-red-400',
          border: 'border-red-300 dark:border-red-700',
          icon: '✗',
          label: 'Failed',
        };
      case 'pending':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/30',
          text: 'text-yellow-700 dark:text-yellow-400',
          border: 'border-yellow-300 dark:border-yellow-700',
          icon: '⏳',
          label: 'Pending',
        };
      case 'created':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-700 dark:text-blue-400',
          border: 'border-blue-300 dark:border-blue-700',
          icon: '◐',
          label: 'Created',
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-800',
          text: 'text-gray-700 dark:text-gray-400',
          border: 'border-gray-300 dark:border-gray-600',
          icon: '?',
          label: 'Unknown',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};

export default PaymentStatusBadge;
