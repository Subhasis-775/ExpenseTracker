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
    });

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // PDF headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=report-${month}-${year}.pdf`
    );
    doc.pipe(res);

    // ---- HEADER ----
    doc
      .fillColor("#1f4e78")
      .fontSize(24)
      .text("Monthly Expense Report", { align: "center" })
      .moveDown(0.5);

    doc
      .fillColor("#333")
      .fontSize(12)
      .text(`Month: ${month} | Year: ${year}`, { align: "center" })
      .text(`User: ${req.user.name}`, { align: "center" })
      .moveDown(1);

    if (expenses.length === 0) {
      doc
        .fillColor("red")
        .fontSize(16)
        .text("No expenses found for this period.", { align: "center" });
      doc.end();
      return;
    }

    // ---- TABLE HEADER ----
    const tableTop = doc.y;
    const itemX = 50;
    const categoryX = 250;
    const amountX = 380;
    const dateX = 460;

    doc
      .fontSize(12)
      .fillColor("#000")
      .text("#", itemX, tableTop)
      .text("Title", itemX + 20, tableTop)
      .text("Category", categoryX, tableTop)
      .text("Amount (Rs.)", amountX, tableTop, { width: 80, align: "right" })
      .text("Date", dateX, tableTop, { width: 80, align: "right" });

    doc.moveDown(0.5);

    // ---- TABLE CONTENT ----
    let total = 0;
    const categoryTotals = {};

    expenses.forEach((exp, idx) => {
      const y = doc.y;

      doc
        .fontSize(12)
        .fillColor("#333")
        .text(idx + 1, itemX, y)
        .text(exp.title, itemX + 20, y)
        .text(exp.category, categoryX, y)
        .text(exp.amount.toFixed(2), amountX, y, { width: 80, align: "right" })
        .text(new Date(exp.date).toLocaleDateString(), dateX, y, { width: 80, align: "right" });

      total += exp.amount;
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
      doc.moveDown(0.5);
    });

    // ---- SUMMARY ----
    doc
      .moveDown(1)
      .fillColor("#1f4e78")
      .fontSize(16)
      .text("Summary", { underline: true, align: 'left' })
      .moveDown(0.5);

    const startX = doc.page.margins.left;
    const gapX = 150; 
    let startY = doc.y;
    let i = 0;

    for (const [cat, amt] of Object.entries(categoryTotals)) {
      const x = startX + (i % 3) * gapX; // 3 categories per row
      const y = startY + Math.floor(i / 3) * 20; // vertical spacing per row
      doc.fontSize(12).fillColor("#333").text(`${cat}: Rs. ${amt.toFixed(2)}`, x, y);
      i++;
    }

    doc.moveDown(Math.ceil(i / 3) + 0.5);

    doc
      .fontSize(14)
      .fillColor("#000")
      .text(`Total Expenses: Rs. ${total.toFixed(2)}`, doc.page.margins.left, doc.y);

    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(10)
        .fillColor("#888")
        .text(`Generated on: ${new Date().toLocaleString()}`, 50, 780, { align: "left" })
        .text(`Page ${i + 1} of ${range.count}`, 50, 780, { align: "right" });
    }

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating report" });
  }
};
