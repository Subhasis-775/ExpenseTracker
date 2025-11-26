/**
 * Email Templates for Expense Tracker Notifications
 */

/**
 * Weekly Summary Email Template
 * @param {string} userName - User's name
 * @param {string} startDate - Start date of the week
 * @param {string} endDate - End date of the week
 * @param {number} totalSpent - Total amount spent
 * @param {Array} categoryBreakdown - Array of {category, amount}
 * @returns {string} HTML email template
 */
export const getWeeklySummaryTemplate = (
  userName,
  startDate,
  endDate,
  totalSpent,
  categoryBreakdown
) => {
  const categoryRows = categoryBreakdown
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.category}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">₹${item.amount.toFixed(2)}</td>
        </tr>
      `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Weekly Expense Summary</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px;">📊 Weekly Expense Summary</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px;">
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #333;">Hi <strong>${userName}</strong>,</p>
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #666;">Here's a summary of your expenses from <strong>${startDate}</strong> to <strong>${endDate}</strong>.</p>
                  <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 25px; border-radius: 8px; margin: 20px 0; text-align: center;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 1px;">Total Spent</p>
                    <p style="margin: 0; font-size: 36px; color: #ffffff; font-weight: bold;">₹${totalSpent.toFixed(2)}</p>
                  </div>
                  <h2 style="margin: 30px 0 15px 0; font-size: 20px; color: #333;">Category Breakdown</h2>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border: 1px solid #eee; border-radius: 4px;">
                    <thead>
                      <tr style="background-color: #f8f9fa;">
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6; color: #495057;">Category</th>
                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6; color: #495057;">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${categoryRows}
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
                  <p style="margin: 0; font-size: 14px; color: #666;">Keep tracking your expenses to stay on budget! 💰</p>
                  <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">© ${new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

/**
 * Monthly Summary Email Template
 * @param {string} userName - User's name
 * @param {string} monthName - Month and year
 * @param {number} totalSpent - Total amount spent
 * @param {Array} topCategories - Top 5 categories with amounts
 * @returns {string} HTML email template
 */
export const getMonthlySummaryTemplate = (
  userName,
  monthName,
  totalSpent,
  topCategories
) => {
  const categoryRows = topCategories
    .map(
      (item, index) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            <span style="display: inline-block; width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; border-radius: 50%; line-height: 24px; margin-right: 8px;">${index + 1}</span>
            ${item.category}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">₹${item.amount.toFixed(2)}</td>
        </tr>
      `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Monthly Expense Report</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <tr>
                <td style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px;">📈 Monthly Expense Report</h1>
                  <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 18px;">${monthName}</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px;">
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #333;">Hi <strong>${userName}</strong>,</p>
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #666;">Here's your complete expense report for <strong>${monthName}</strong>.</p>
                  <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 25px; border-radius: 8px; margin: 20px 0; text-align: center;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 1px;">Total Monthly Spend</p>
                    <p style="margin: 0; font-size: 36px; color: #ffffff; font-weight: bold;">₹${totalSpent.toFixed(2)}</p>
                  </div>
                  <h2 style="margin: 30px 0 15px 0; font-size: 20px; color: #333;">Top 5 Spending Categories</h2>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border: 1px solid #eee; border-radius: 4px;">
                    <thead>
                      <tr style="background-color: #f8f9fa;">
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6; color: #495057;">Rank & Category</th>
                        <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6; color: #495057;">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${categoryRows}
                    </tbody>
                  </table>
                  <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #856404;">💡 Savings Tip</h3>
                    <p style="margin: 0; font-size: 14px; color: #856404;">Review your top spending categories and identify areas where you can cut back to save more!</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
                  <p style="margin: 0; font-size: 14px; color: #666;">Great job tracking your monthly expenses! 🎯</p>
                  <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">© ${new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

/**
 * Recurring Expense Alert Template
 * @param {string} userName - User's name
 * @param {string} expenseTitle - Title of the recurring expense
 * @param {number} amount - Amount of the expense
 * @param {string} dueDate - Due date string
 * @returns {string} HTML email template
 */
export const getRecurringAlertTemplate = (
 userName,
  expenseTitle,
  amount,
  dueDate
) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Upcoming Expense Alert</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <tr>
                <td style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px;">⏰ Upcoming Expense Alert</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px;">
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #333;">Hi <strong>${userName}</strong>,</p>
                  <p style="margin: 0 0 30px 0; font-size: 16px; color: #666;">This is a friendly reminder about an upcoming recurring expense.</p>
                  <div style="border: 2px solid #e74c3c; border-radius: 8px; overflow: hidden; margin: 20px 0;">
                    <div style="background-color: #e74c3c; padding: 15px; text-align: center;">
                      <h2 style="margin: 0; color: #ffffff; font-size: 22px;">${expenseTitle}</h2>
                    </div>
                    <div style="padding: 25px; background-color: #ffffff;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 15px 0;">
                            <p style="margin: 0 0 5px 0; font-size: 14px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Amount Due</p>
                            <p style="margin: 0; font-size: 32px; color: #e74c3c; font-weight: bold;">₹${amount.toFixed(2)}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px 0; border-top: 1px solid #eee;">
                            <p style="margin: 0 0 5px 0; font-size: 14px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Due Date</p>
                            <p style="margin: 0; font-size: 20px; color: #333; font-weight: 600;">${dueDate}</p>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                  <div style="margin-top: 30px; padding: 20px; background-color: #d1ecf1; border-left: 4px solid #17a2b8; border-radius: 4px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #0c5460;">📌 Reminder</h3>
                    <p style="margin: 0; font-size: 14px; color: #0c5460;">This expense is due in 3 days. Make sure you have sufficient funds available!</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
                  <p style="margin: 0; font-size: 14px; color: #666;">Stay on top of your recurring expenses! 🎯</p>
                  <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">© ${new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

/**
 * Budget Alert Email Template
 * @param {string} userName - User's name
 * @param {string} category - Budget category
 * @param {number} budgetAmount - Total budget amount
 * @param {number} spentAmount - Amount spent so far
 * @param {number} percentage - Percentage of budget used
 * @returns {string} HTML email template
 */
export const getBudgetAlertTemplate = (
  userName,
  category,
  budgetAmount,
  spentAmount,
  percentage
) => {
  const isExceeded = percentage >= 100;
  const color = isExceeded ? "#dc3545" : "#ffc107"; // Red for exceeded, Yellow for warning
  const title = isExceeded ? "🚨 Budget Exceeded Alert" : "⚠️ Budget Warning Alert";
  const message = isExceeded 
    ? `You have exceeded your budget for <strong>${category}</strong>.`
    : `You have used <strong>${percentage.toFixed(0)}%</strong> of your budget for <strong>${category}</strong>.`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <tr>
                <td style="background: ${color}; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px;">${title}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px;">
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #333;">Hi <strong>${userName}</strong>,</p>
                  <p style="margin: 0 0 30px 0; font-size: 16px; color: #666;">${message}</p>
                  
                  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom: 10px; color: #666;">Category</td>
                        <td style="padding-bottom: 10px; text-align: right; font-weight: bold;">${category}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px; color: #666;">Budget Limit</td>
                        <td style="padding-bottom: 10px; text-align: right; font-weight: bold;">₹${budgetAmount.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px; color: #666;">Spent So Far</td>
                        <td style="padding-bottom: 10px; text-align: right; font-weight: bold; color: ${color};">₹${spentAmount.toFixed(2)}</td>
                      </tr>
                    </table>
                    
                    <div style="margin-top: 15px; background-color: #e9ecef; height: 10px; border-radius: 5px; overflow: hidden;">
                      <div style="width: ${Math.min(percentage, 100)}%; height: 100%; background-color: ${color};"></div>
                    </div>
                    <p style="text-align: right; font-size: 12px; color: #666; margin-top: 5px;">${percentage.toFixed(1)}% Used</p>
                  </div>

                  <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #856404;">💡 Tip</h3>
                    <p style="margin: 0; font-size: 14px; color: #856404;">Check your dashboard to see detailed spending analysis and adjust your habits if needed.</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
                  <p style="margin: 0; font-size: 14px; color: #666;">Manage your budget wisely! 💰</p>
                  <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">© ${new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
