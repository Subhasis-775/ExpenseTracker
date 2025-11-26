import { useState } from 'react';
import Tesseract from 'tesseract.js';
import { Camera, Upload, X, Check, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ReceiptScanner = ({ onScanComplete }) => {
  const [image, setImage] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      scanReceipt(file);
    }
  };

  const scanReceipt = async (file) => {
    setScanning(true);
    try {
      const result = await Tesseract.recognize(
        file,
        'eng',
        { logger: m => console.log(m) }
      );

      const text = result.data.text;
      console.log("Extracted Text:", text);

      // Simple Regex for extraction (can be improved)
      const extractedData = parseReceiptText(text);
      
      onScanComplete(extractedData);
      toast.success("Receipt scanned successfully! 🧾");
      setShowScanner(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to scan receipt");
    } finally {
      setScanning(false);
    }
  };

  const parseReceiptText = (text) => {
    const lines = text.split('\n');
    let title = "";
    let amount = "";
    let date = "";

    // 1. Try to find Total Amount
    // Look for patterns like "Total: 500.00", "Amount 500", "500.00"
    const amountRegex = /(\d+\.\d{2})/;
    const totalLines = lines.filter(line => line.toLowerCase().includes('total') || line.toLowerCase().includes('amount'));
    
    if (totalLines.length > 0) {
        const match = totalLines[0].match(amountRegex);
        if (match) amount = match[0];
    } else {
        // Fallback: find the largest number that looks like a price
        const allNumbers = text.match(/(\d+\.\d{2})/g);
        if (allNumbers) {
            amount = allNumbers.sort((a, b) => parseFloat(b) - parseFloat(a))[0];
        }
    }

    // 2. Try to find Date
    // DD/MM/YYYY or YYYY-MM-DD
    const dateRegex = /(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})|(\d{4}[/-]\d{1,2}[/-]\d{1,2})/;
    const dateMatch = text.match(dateRegex);
    if (dateMatch) date = dateMatch[0];

    // 3. Try to find Merchant Name (usually the first non-empty line)
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.length > 3 && !line.includes('Welcome') && !line.includes('Receipt')) {
            title = line;
            break;
        }
    }

    return { title, amount, date };
  };

  if (!showScanner) {
    return (
      <button
        type="button"
        onClick={() => setShowScanner(true)}
        className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4"
      >
        <Camera size={16} /> Scan Receipt (Beta)
      </button>
    );
  }

  return (
    <div className="mb-6 p-4 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-xl bg-blue-50 dark:bg-blue-900/10 relative animate-fade-in">
      <button
        onClick={() => setShowScanner(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
      >
        <X size={18} />
      </button>

      {scanning ? (
        <div className="flex flex-col items-center justify-center py-4">
          <Loader className="w-8 h-8 text-blue-500 animate-spin mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-300">Scanning receipt... Please wait</p>
        </div>
      ) : (
        <div className="text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="receipt-upload"
          />
          <label
            htmlFor="receipt-upload"
            className="cursor-pointer flex flex-col items-center justify-center gap-2"
          >
            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm">
              <Upload className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Click to upload receipt image
            </p>
            <p className="text-xs text-gray-500">Supports JPG, PNG</p>
          </label>
        </div>
      )}
    </div>
  );
};

export default ReceiptScanner;
