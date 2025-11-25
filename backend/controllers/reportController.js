import PDFDocument from 'pdfkit';
import Expense from '../models/expenseModel.js';

export const generateReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = req.user.id;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    const expenses = await Expense.find({
      userId,
      date: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      },
    }).sort({ date: 1 });

    const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });

    // PDF headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Expense_Report_${month}_${year}.pdf`
    );
    doc.pipe(res);

    // --- COLORS ---
    const primaryColor = "#2563eb"; // Blue-600
    const secondaryColor = "#1e40af"; // Blue-800
    const accentColor = "#f3f4f6"; // Gray-100
    const textColor = "#1f2937"; // Gray-800
    const lightText = "#6b7280"; // Gray-500
    const tableHeaderBg = "#eff6ff"; // Blue-50

    // --- HEADER SECTION ---
    // Blue top bar
    doc.rect(0, 0, doc.page.width, 100).fill(primaryColor);
    
    // App Title
    doc.fontSize(24).fillColor("#ffffff").font('Helvetica-Bold')
       .text("Expense Tracker", 50, 35);
    
    doc.fontSize(10).fillColor("#bfdbfe").font('Helvetica')
       .text("Smart Finance Management", 50, 65);

    // Report Details (Right aligned in header)
    doc.fontSize(20).fillColor("#ffffff").font('Helvetica-Bold')
       .text("Monthly Report", 0, 35, { align: "right", width: doc.page.width - 50 });
    
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
    doc.fontSize(12).fillColor("#bfdbfe").font('Helvetica')
       .text(`${monthName} ${year}`, 0, 65, { align: "right", width: doc.page.width - 50 });

    doc.moveDown(4);

    // --- USER INFO ---
    doc.fillColor(textColor).fontSize(12).font('Helvetica-Bold').text(`Prepared for:`, 50, 120);
    doc.font('Helvetica').text(req.user.name, 50, 135);
    doc.fillColor(lightText).fontSize(10).text(req.user.email, 50, 150);

    doc.fillColor(textColor).fontSize(12).font('Helvetica-Bold').text(`Generated on:`, 350, 120);
    doc.font('Helvetica').text(new Date().toLocaleDateString(), 350, 135);

    // --- SUMMARY SECTION ---
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categoryTotals = {};
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    // Draw Summary Box
    const summaryY = 180;
    doc.roundedRect(50, summaryY, 500, 70, 8).fill(accentColor);
    
    // Total Expenses
    doc.fillColor(secondaryColor).fontSize(10).font('Helvetica-Bold')
       .text("TOTAL EXPENSES", 70, summaryY + 20);
    doc.fillColor(primaryColor).fontSize(18)
       .text(`Rs. ${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 70, summaryY + 35);

    // Transaction Count
    doc.fillColor(secondaryColor).fontSize(10).font('Helvetica-Bold')
       .text("TRANSACTIONS", 250, summaryY + 20);
    doc.fillColor(textColor).fontSize(18)
       .text(expenses.length.toString(), 250, summaryY + 35);

    // Top Category
    let topCategory = "N/A";
    let topAmount = 0;
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt > topAmount) {
        topAmount = amt;
        topCategory = cat;
      }
    });

    doc.fillColor(secondaryColor).fontSize(10).font('Helvetica-Bold')
       .text("TOP CATEGORY", 400, summaryY + 20);
    doc.fillColor(textColor).fontSize(18)
       .text(topCategory, 400, summaryY + 35);

    doc.moveDown(4);

    if (expenses.length === 0) {
      doc.moveDown(2);
      doc.fillColor(lightText).fontSize(14).text("No expenses recorded for this month.", { align: "center" });
    } else {
      // --- EXPENSE TABLE ---
      const tableTop = 280;
      const itemX = 50;
      const categoryX = 220;
      const dateX = 350;
      const amountX = 450;

      // Table Header
      doc.rect(50, tableTop, 500, 25).fill(tableHeaderBg);
      doc.fillColor(secondaryColor).fontSize(10).font('Helvetica-Bold');
      doc.text("DESCRIPTION", itemX + 10, tableTop + 8);
      doc.text("CATEGORY", categoryX, tableTop + 8);
      doc.text("DATE", dateX, tableTop + 8);
      doc.text("AMOUNT", amountX, tableTop + 8, { width: 90, align: "right" });

      let y = tableTop + 35;

      // Table Rows
      expenses.forEach((exp, i) => {
        // Zebra striping
        if (i % 2 === 0) {
          doc.rect(50, y - 5, 500, 20).fill("#f9fafb"); // Very light gray
        }

        doc.fillColor(textColor).fontSize(10).font('Helvetica');
        
        // Truncate title if too long
        let title = exp.title;
        if (title.length > 30) title = title.substring(0, 27) + "...";

        doc.text(title, itemX + 10, y);
        doc.text(exp.category, categoryX, y);
        doc.text(new Date(exp.date).toLocaleDateString(), dateX, y);
        doc.font('Helvetica-Bold').text(`Rs. ${exp.amount.toFixed(2)}`, amountX, y, { width: 90, align: "right" });

        y += 20;

        // New page check
        if (y > doc.page.height - 100) {
          doc.addPage();
          y = 50; // Reset y for new page
          
          // Redraw header on new page (optional, but good for industry standard)
          doc.rect(50, y, 500, 25).fill(tableHeaderBg);
          doc.fillColor(secondaryColor).fontSize(10).font('Helvetica-Bold');
          doc.text("DESCRIPTION", itemX + 10, y + 8);
          doc.text("CATEGORY", categoryX, y + 8);
          doc.text("DATE", dateX, y + 8);
          doc.text("AMOUNT", amountX, y + 8, { width: 90, align: "right" });
          y += 35;
        }
      });

      // --- CATEGORY BREAKDOWN (Mini Table) ---
      if (y + 150 < doc.page.height) {
        y += 40;
        doc.fontSize(12).fillColor(secondaryColor).font('Helvetica-Bold').text("Category Breakdown", 50, y);
        y += 20;

        // Simple breakdown list
        Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).forEach(([cat, amt]) => {
            doc.rect(50, y, 200, 5).fill("#e5e7eb"); // Background bar
            const percentage = (amt / totalAmount);
            doc.rect(50, y, 200 * percentage, 5).fill(primaryColor); // Progress bar
            
            doc.fillColor(textColor).fontSize(10).font('Helvetica').text(cat, 260, y - 2);
            doc.text(`${(percentage * 100).toFixed(1)}%`, 350, y - 2);
            doc.font('Helvetica-Bold').text(`Rs. ${amt.toFixed(2)}`, 450, y - 2, { align: "right", width: 90 });
            
            y += 20;
            if (y > doc.page.height - 50) {
                doc.addPage();
                y = 50;
            }
        });
      }
    }

    // --- FOOTER ---
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(i);
      
      // Footer Line
      doc.moveTo(50, doc.page.height - 50).lineTo(550, doc.page.height - 50).strokeColor("#e5e7eb").stroke();
      
      doc.fontSize(8).fillColor(lightText).font('Helvetica');
      doc.text("© Expense Tracker - Generated Report", 50, doc.page.height - 40);
      doc.text(`Page ${i + 1} of ${range.count}`, 500, doc.page.height - 40, { align: "right", width: 50 });
    }

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating report" });
  }
};
