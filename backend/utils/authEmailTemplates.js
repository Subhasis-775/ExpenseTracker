/**
 * Authentication Email Templates
 */

/**
 * Welcome Email Template (Registration)
 * @param {string} userName - User's name
 * @param {string} email - User's email
 * @returns {string} HTML email template
 */
export const getWelcomeEmailTemplate = (userName, email) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Expense Tracker</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 8px 8px 0 0; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px;">🎉 Welcome to Expense Tracker!</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px 0; font-size: 24px; color: #333;">Hi ${userName}! 👋</h2>
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #666; line-height: 1.6;">
                    Thank you for joining <strong>Expense Tracker</strong>! We're excited to help you take control of your finances and reach your financial goals.
                  </p>
                  
                  <!-- Account Info Box -->
                  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
                    <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #333;">Your Account Details</h3>
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">
                      <strong>Email:</strong> ${email}
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #666;">
                      <strong>Account Created:</strong> ${new Date().toLocaleDateString()}
                    </p>
                  </div>
                  
                  <!-- Features -->
                  <h3 style="margin: 30px 0 20px 0; font-size: 20px; color: #333;">What You Can Do:</h3>
                  <div style="margin-bottom: 15px;">
                    <strong style="color: #667eea;">📊 Track Expenses</strong>
                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Log and categorize all your expenses in one place</p>
                  </div>
                  <div style="margin-bottom: 15px;">
                    <strong style="color: #11998e;">📈 View Analytics</strong>
                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Get insights with beautiful charts and reports</p>
                  </div>
                  <div style="margin-bottom: 15px;">
                    <strong style="color: #fa709a;">🔔 Recurring Expenses</strong>
                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Never miss a bill with automated reminders</p>
                  </div>
                  <div style="margin-bottom: 15px;">
                    <strong style="color: #4facfe;">🤖 AI Insights</strong>
                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Get personalized financial advice from AI</p>
                  </div>
                  
                  <!-- Support -->
                  <div style="margin-top: 30px; padding: 20px; background-color: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #1976d2;">💬 Need Help?</h3>
                    <p style="margin: 0; font-size: 14px; color: #1976d2;">If you have any questions or need assistance, we're here to help!</p>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
                  <p style="margin: 0; font-size: 14px; color: #666;">Happy tracking! We're glad to have you on board! 🚀</p>
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
 * Login Notification Email Template
 * @param {string} userName - User's name
 * @param {string} loginTime - Time of login
 * @param {string} ipAddress - IP address (optional)
 * @returns {string} HTML email template
 */
export const getLoginNotificationTemplate = (userName, loginTime, ipAddress = 'Unknown') => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Login Alert</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px;">🔐 New Login Detected</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 30px;">
                  <p style="margin: 0 0 20px 0; font-size: 16px; color: #333;">Hi <strong>${userName}</strong>,</p>
                  <p style="margin: 0 0 30px 0; font-size: 16px; color: #666;">
                    We detected a new login to your Expense Tracker account.
                  </p>
                  
                  <!-- Login Details -->
                  <div style="border: 2px solid #2196f3; border-radius: 8px; overflow: hidden; margin: 20px 0;">
                    <div style="background-color: #2196f3; padding: 15px; text-align: center;">
                      <h2 style="margin: 0; color: #ffffff; font-size: 20px;">Login Details</h2>
                    </div>
                   <div style="padding: 25px; background-color: #ffffff;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 15px 0; border-bottom: 1px solid #eee;">
                            <p style="margin: 0 0 5px 0; font-size: 14px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Time</p>
                            <p style="margin: 0; font-size: 18px; color: #333; font-weight: 600;">${loginTime}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px 0;">
                            <p style="margin: 0 0 5px 0; font-size: 14px; color: #999; text-transform: uppercase; letter-spacing: 1px;">IP Address</p>
                            <p style="margin: 0; font-size: 18px; color: #333; font-weight: 600;">${ipAddress}</p>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                  
                  <!-- Was This You? -->
                  <div style="margin-top: 30px; padding: 20px; background-color: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #2e7d32;">✅ Was This You?</h3>
                    <p style="margin: 0; font-size: 14px; color: #2e7d32;">If you just logged in, you can safely ignore this email. Your account is secure.</p>
                  </div>
                  
                  <!-- Security Alert -->
                  <div style="margin-top: 20px; padding: 20px; background-color: #ffebee; border-left: 4px solid #f44336; border-radius: 4px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #c62828;">⚠️ Wasn't You?</h3>
                    <p style="margin: 0 0 15px 0; font-size: 14px; color: #c62828;">If you didn't log in, please secure your account immediately:</p>
                    <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #c62828;">
                      <li style="margin-bottom: 8px;">Change your password</li>
                      <li style="margin-bottom: 8px;">Review your account activity</li>
                      <li>Contact support if needed</li>
                    </ul>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
                  <p style="margin: 0; font-size: 14px; color: #666;">This is an automated security notification.</p>
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
