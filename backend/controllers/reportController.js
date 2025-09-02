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
        $lte: new Date(year, month, 1),
      }
    });

    // ✅ Handle empty data gracefully
    if (expenses.length === 0) {
      const doc = new PDFDocument({ margin: 50 });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=report-${month}-${year}.pdf`
      );
      doc.pipe(res);

      doc.fontSize(20).text("Monthly Expense Report", { align: "center" });
      doc.moveDown();
      doc.fontSize(14).text(`Month: ${month}, Year: ${year}`);
      doc.text(`User: ${req.user.name}`);
      doc.moveDown();
      doc.fontSize(16).fillColor("red").text("No expenses found for this period.", { align: "center" });

      doc.end();
      return;
    }

    // ✅ Normal flow if data exists
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=report-${month}-${year}.pdf`
    );
    doc.pipe(res);

    doc.fontSize(20).text("Monthly Expense Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Month: ${month}, Year: ${year}`);
    doc.text(`User: ${req.user.name}`);
    doc.moveDown();

    doc.fontSize(16).text("Expenses:", { underline: true });
    doc.moveDown();

    let total = 0;
    const categoryTotals = {};

    expenses.forEach((exp, idx) => {
      doc.fontSize(12).text(
        `${idx + 1}. ${exp.title} - Rs. ${exp.amount} [${exp.category}] (${new Date(exp.date).toLocaleDateString()})`
      );

      total += exp.amount;
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    doc.moveDown();
    doc.fontSize(16).text("Summary:", { underline: true });
    doc.moveDown();
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      doc.fontSize(12).text(`${cat}: Rs. ${amt}`);
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total: Rs. ${total}`);

    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating report" });
  }
};
