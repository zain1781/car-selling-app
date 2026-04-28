import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  FaCcVisa,
  FaCcMastercard,
  FaSearch,
  FaFileInvoice,
  FaShippingFast,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaMoneyBillWave,
  FaFilter,
  FaDownload,
  FaSpinner,
  FaTimes,
  FaEdit,
  FaClipboardList,
  FaInfoCircle,
  FaTag
} from 'react-icons/fa';
import { jsPDF } from "jspdf";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img from "../../assets/img/card.png";

export default function InvoiceAndShipment() {
  const { id } = useParams();
  const [estimation, setEstimation] = useState(null);
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterEstimationId, setFilterEstimationId] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [logo, setLogo] = useState(null);
  const invoiceRef = useRef(null);
  const api = import.meta.env.VITE_API_URL;

  // Load logo
  useEffect(() => {
    const loadLogo = async () => {
      try {
        // Use a simpler approach to load the logo
        const logoImg = new Image();
        logoImg.src = '/src/assets/img/logo.png'; // Adjust path if needed
        logoImg.onload = () => {
          setLogo(logoImg);
        };
        logoImg.onerror = (error) => {
          console.error("Failed to load logo:", error);
          setLogo(null);
        };
      } catch (error) {
        console.error("Failed to load logo:", error);
        setLogo(null);
      }
    };
    loadLogo();
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        toast.info("Loading data...");

        const estRes = await fetch(`${api}estimation/${id}`);
        if (!estRes.ok) throw new Error("Failed to fetch estimation data");
        const estData = await estRes.json();
        setEstimation(estData);

        const orderRes = await fetch(`${api}order/${estData.orderId}`);
        if (!orderRes.ok) throw new Error("Failed to fetch order data");
        const orderData = await orderRes.json();
        setOrder(orderData.order);

        const userRes = await fetch(`${api}users/${estData.userId}`);
        if (!userRes.ok) throw new Error("Failed to fetch user data");
        const userData = await userRes.json();
        setUser(userData);

        const shipmentRes = await fetch(`${api}shipment`);
        if (!shipmentRes.ok) throw new Error("Failed to fetch shipment data");
        const shipmentData = await shipmentRes.json();
        setShipments(shipmentData);

        // Initialize filtered shipments with all shipments
        setFilteredShipments(shipmentData);

        // Set initial filter to current estimation ID
        setFilterEstimationId(id);

        setLoading(false);
        toast.success("Data loaded successfully");
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error(error.message || "Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, [id, api]);

  // Filter shipments when filter changes
  useEffect(() => {
    if (filterEstimationId) {
      const filtered = shipments.filter(shipment =>
        shipment.EstimationId && shipment.EstimationId.includes(filterEstimationId)
      );
      setFilteredShipments(filtered);
    } else {
      setFilteredShipments(shipments);
    }
  }, [filterEstimationId, shipments]);

  // Generate PDF invoice
  const generatePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      toast.info("Generating professional invoice...");

      // Create PDF document with better quality settings
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
        putOnlyUsedFonts: true,
        floatPrecision: 16 // Use higher precision for better rendering
      });

      // Set document properties
      try {
        doc.setProperties({
          title: `Invoice #${estimation._id || 'Unknown'}`,
          subject: 'Vehicle Invoice',
          author: 'American Car Auction',
          keywords: 'invoice, vehicle, car auction',
          creator: 'Invoice Generator'
        });
      } catch (error) {
        console.error("Error setting document properties:", error);
        // Continue without properties
      }

      // Document constants
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);

      // Color scheme
      const primaryColor = [0, 83, 156]; // Dark blue
      const secondaryColor = [41, 128, 185]; // Medium blue
      const accentColor = [52, 152, 219]; // Light blue
      const textColor = [44, 62, 80]; // Dark gray
      const lightGray = [236, 240, 241]; // Light gray background

      // ===== HEADER SECTION =====

      // Skip logo for now to avoid potential errors
      // We'll add a text header instead
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 83, 156);
      doc.text("AMERICAN CAR AUCTION", margin, margin + 10);

      // Company info on right side
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);

      const companyInfo = [
        "American Car Auction",
        "123 Auction Drive, Suite 100",
        "Atlanta, GA 30303",
        "Tel: (404) 555-1234",
        "www.americancarauction.com"
      ];

      let companyY = margin;
      companyInfo.forEach(line => {
        doc.text(line, pageWidth - margin - doc.getTextWidth(line), companyY);
        companyY += 5;
      });

      // Colored header bar
      const headerY = margin + 22;
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(margin, headerY, contentWidth, 12, 'F');

      // Invoice title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text("INVOICE", margin + 5, headerY + 8);

      // Invoice number and date
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      const invoiceText = `#${estimation._id || 'N/A'}`;
      doc.text(invoiceText, pageWidth - margin - 5 - doc.getTextWidth(invoiceText), headerY + 8);

      // ===== INVOICE DETAILS SECTION =====

      let currentY = headerY + 20;

      // Invoice details box
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.setDrawColor(220, 220, 220);
      doc.roundedRect(margin, currentY, contentWidth, 25, 2, 2, 'FD');

      // Left column - Invoice details
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.text("INVOICE DETAILS", margin + 5, currentY + 6);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, margin + 5, currentY + 12);
      doc.text(`Payment Method: ${order.payment || 'N/A'}`, margin + 5, currentY + 18);

      // Right column - Customer details
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      const customerX = margin + contentWidth / 2;
      doc.text("BILLED TO", customerX, currentY + 6);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`${user.name || 'N/A'}`, customerX, currentY + 12);
      doc.text(`${user.email || 'N/A'}`, customerX, currentY + 18);

      // ===== SHIPPING DETAILS SECTION =====

      currentY += 30;

      // Shipping details box
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.roundedRect(margin, currentY, contentWidth, 25, 2, 2, 'FD');

      // Shipping details
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("SHIPPING DETAILS", margin + 5, currentY + 6);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Address: ${order.country || 'N/A'}`, margin + 5, currentY + 12);

      // Status on right side
      doc.setFont("helvetica", "bold");
      const statusX = margin + contentWidth / 2;
      doc.text("STATUS", statusX, currentY + 6);

      doc.setFont("helvetica", "normal");
      doc.text(`Order Status: ${order.status || 'N/A'}`, statusX, currentY + 12);
      doc.text(`Phone: ${order.phone || 'N/A'}`, statusX, currentY + 18);

      // ===== PRICE DETAILS SECTION =====

      currentY += 35;

      // Section title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("PRICE DETAILS", margin, currentY);

      // Horizontal line
      doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.setLineWidth(0.5);
      doc.line(margin, currentY + 3, pageWidth - margin, currentY + 3);

      currentY += 10;

      // Price details - simplified to avoid autoTable issues
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("PRICE DETAILS", margin, currentY);

      currentY += 10;

      // Draw a simple line
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.1);
      doc.line(margin, currentY, margin + contentWidth, currentY);

      currentY += 10;

      // Base price
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("Base Price:", margin, currentY);
      doc.text(`$${order.price.toFixed(2)}`, margin + contentWidth - 30, currentY, { align: 'right' });

      currentY += 8;

      // Tax
      doc.text(`Tax (${(estimation.Tax * 100).toFixed(0)}%):`, margin, currentY);
      doc.text(`$${(order.price * estimation.Tax).toFixed(2)}`, margin + contentWidth - 30, currentY, { align: 'right' });

      currentY += 8;

      // Draw a line before total
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.1);
      doc.line(margin, currentY, margin + contentWidth, currentY);

      currentY += 8;

      // Total
      doc.setFont("helvetica", "bold");
      doc.text("Total:", margin, currentY);
      doc.text(`$${(order.price + (order.price * estimation.Tax)).toFixed(2)}`, margin + contentWidth - 30, currentY, { align: 'right' });

      currentY += 15;

      // ===== ESTIMATION STATUS SECTION =====

      currentY += 15;

      // Simple status text instead of complex box
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("Estimation Status:", margin, currentY);

      doc.setFont("helvetica", "normal");
      doc.text(estimation.approved ? 'APPROVED' : 'PENDING APPROVAL', margin + 40, currentY);

      // ===== CUSTOMER NOTE SECTION =====

      if (order.note && order.note.trim() !== '') {
        currentY += 15;

        // Simple note section
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text("CUSTOMER NOTE:", margin, currentY);

        currentY += 10;

        // Note content - simplified
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);

        // Split long notes into multiple lines
        const noteLines = doc.splitTextToSize(order.note, contentWidth - 10);
        doc.text(noteLines, margin, currentY);
      }

      // ===== FOOTER SECTION =====

      // Footer line
      const footerY = pageHeight - 25;
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.5);
      doc.line(margin, footerY, pageWidth - margin, footerY);

      // Footer text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("Thank you for choosing American Car Auction. We appreciate your business!", margin, footerY + 5);
      doc.text("For any questions regarding this invoice, please contact our customer service at support@americancarauction.com", margin, footerY + 10);

      // Page number
      doc.text("Page 1 of 1", pageWidth - margin - 20, footerY + 10);

      // Save with improved error handling
      try {
        // Use a simpler filename to avoid potential issues
        const filename = "Invoice_" + new Date().getTime() + ".pdf";

        // Use a timeout to ensure UI updates before heavy PDF operation
        setTimeout(() => {
          try {
            // Use output method instead of save for better browser compatibility
            const pdfData = doc.output('blob');
            const pdfUrl = URL.createObjectURL(pdfData);

            // Create a download link and trigger it
            const downloadLink = document.createElement('a');
            downloadLink.href = pdfUrl;
            downloadLink.download = filename;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            // Clean up the URL object
            setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);

            toast.success("Professional invoice PDF generated successfully!");
          } catch (innerError) {
            console.error("Error in PDF output/download:", innerError);
            toast.error("Error downloading PDF. Please try again.");
          } finally {
            setIsGeneratingPDF(false);
          }
        }, 100);
      } catch (error) {
        console.error("Error preparing PDF for save:", error);
        toast.error("Error generating PDF. Please try again.");
        setIsGeneratingPDF(false);
      }
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Error generating PDF. Please try again.");
      setIsGeneratingPDF(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Loading data...</h2>
          <p className="text-gray-500 mt-2">Please wait while we fetch your information</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!estimation || !order || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md border-l-4 border-red-500">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800">Failed to load data</h2>
          <p className="text-gray-500 mt-2">Please try again or contact support</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const taxAmount = order.price * estimation.Tax;
  const totalAmount = order.price + taxAmount;

  const renderCardIcon = (method) => {
    const type = method?.toLowerCase() || '';
    if (type.includes("visa")) return <FaCcVisa className="text-blue-600 text-2xl inline ml-2" />;
    if (type.includes("master")) return <FaCcMastercard className="text-red-600 text-2xl inline ml-2" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 md:px-8">
      <ToastContainer position="bottom-right" autoClose={5000} />

      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaFileInvoice className="text-blue-600" /> Invoice & Shipment Details
            </h1>
            <p className="text-gray-500 mt-1">View and manage invoice and shipment information</p>
          </div>

          <button
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            {isGeneratingPDF ? (
              <>
                <FaSpinner className="animate-spin" /> Generating...
              </>
            ) : (
              <>
                <FaDownload /> Download Invoice PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Invoice Section - 2 columns wide */}
        <div className="lg:col-span-2" ref={invoiceRef}>
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            {/* Invoice Header */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-wide">INVOICE</h1>
                  <p className="text-sm mt-1 opacity-90">Generated on {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-semibold">American Car Auction</p>
                  <p>support@americancarauction.com</p>
                  <p>+1 (404) 555-1234</p>
                </div>
              </div>
            </div>

            {/* Bill To & Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 text-sm text-gray-700">
              <div className="space-y-2">
                <h2 className="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
                  <FaUser className="text-blue-600" /> Bill To
                </h2>
                <p className="flex items-start gap-2">
                  <span className="font-semibold min-w-[80px]">Name:</span>
                  <span>{user.name}</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-semibold min-w-[80px]">Email:</span>
                  <span>{user.email}</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-semibold min-w-[80px]">Phone:</span>
                  <span>{order.phone}</span>
                </p>
              </div>
              <div className="space-y-2">
                <h2 className="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
                  <FaFileInvoice className="text-blue-600" /> Order Info
                </h2>
                <p className="flex items-start gap-2">
                  <span className="font-semibold min-w-[80px]">Invoice ID:</span>
                  <span className="truncate">{estimation._id}</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-semibold min-w-[80px]">Order ID:</span>
                  <span className="truncate">{order._id}</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-semibold min-w-[80px]">Address:</span>
                  <span>{order.country}</span>
                </p>
              </div>
            </div>

            {/* Payment & Status */}
            <div className="flex flex-wrap justify-between items-center px-6 pb-6 text-sm gap-4">
              <div className="flex items-center gap-2">
                <FaMoneyBillWave className="text-blue-600" />
                <span className="font-semibold">Payment Method:</span>
                <span>{order.payment} {renderCardIcon(order.payment)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Status:</span>
                <span className={`px-3 py-1 rounded-full text-white text-xs ${order.status === 'Pending' ? 'bg-yellow-500' : 'bg-green-600'}`}>
                  {order.status}
                </span>
              </div>
              <img src={img} alt="card" className="h-8" />
            </div>

            {/* Price Details */}
            <div className="border-t border-b py-6 px-6 bg-gray-50">
              <h2 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                <FaMoneyBillWave className="text-blue-600" /> Price Details
              </h2>
              <div className="space-y-3 text-base text-gray-800">
                <div className="flex justify-between items-center">
                  <span>Base Price</span>
                  <span className="font-medium">${order.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tax ({(estimation.Tax * 100).toFixed(0)}%)</span>
                  <span className="font-medium">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-300 my-3"></div>
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-blue-700">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Estimation Status */}
            <div className="px-6 py-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Estimation Status:</span>
                <span className={`px-3 py-1 rounded-full text-white text-xs ${estimation.approved ? 'bg-green-600' : 'bg-yellow-500'}`}>
                  {estimation.approved ? 'APPROVED' : 'PENDING APPROVAL'}
                </span>
              </div>
            </div>

            {/* Customer Note */}
            <div className="px-6 py-5 bg-gray-50 border-t">
              <h2 className="font-bold text-lg mb-3 text-gray-800 flex items-center gap-2">
                <FaEdit className="text-blue-600" /> Customer Note
              </h2>
              <div className="p-4 bg-white border border-gray-200 rounded-lg text-sm leading-relaxed text-gray-700">
                {order.note ? order.note : 'Dear Customer, Thank you for choosing our services. Your order is being processed and will be shipped shortly. If you have any questions, feel free to contact us.'}
              </div>
            </div>
          </div>
        </div>

        {/* Shipment Filter Section - 1 column wide */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <FaFilter className="text-blue-600" /> Filter Shipments
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="estimationId" className="block text-sm font-medium text-gray-700 mb-1">
                  Estimation ID
                </label>
                <div className="flex">
                  <input
                    id="estimationId"
                    type="text"
                    value={filterEstimationId}
                    onChange={(e) => setFilterEstimationId(e.target.value)}
                    placeholder="Enter estimation ID"
                    className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => setFilterEstimationId("")}
                    className="bg-gray-200 px-3 rounded-r-md hover:bg-gray-300 transition-colors"
                    title="Clear filter"
                  >
                    <FaTimes />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Filter shipments by estimation ID
                </p>
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center text-sm text-gray-700">
                  <span>Total shipments: {shipments.length}</span>
                  <span>Filtered: {filteredShipments.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipment Table Section */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <FaShippingFast className="text-blue-600" /> Shipment Data
            </h2>
            <p className="text-gray-500 mt-1">
              Showing {filteredShipments.length} shipment{filteredShipments.length !== 1 ? 's' : ''}
              {filterEstimationId ? ` filtered by estimation ID: ${filterEstimationId}` : ''}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  {[
                    "Shipment ID", "Order ID", "User ID", "Estimation ID", "Inventory ID",
                    "Status", "Shipment Status", "Shipment Date",
                    "Address", "City", "Phone", "Total Price"
                  ].map((heading, index) => (
                    <th key={index} className="px-4 py-3 border-b font-medium whitespace-nowrap text-left">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredShipments.length > 0 ? (
                  filteredShipments.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50 even:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 border-b truncate max-w-xs">{s._id}</td>
                      <td className="px-4 py-3 border-b">{s.OrderId}</td>
                      <td className="px-4 py-3 border-b">{s.UserId}</td>
                      <td className="px-4 py-3 border-b font-medium text-blue-600">{s.EstimationId}</td>
                      <td className="px-4 py-3 border-b">{s.InventoryId}</td>
                      <td className="px-4 py-3 border-b">
                        <span className={`px-2 py-1 rounded-full text-xs ${s.Status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                          {s.Status}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-b">
                        <span className={`px-2 py-1 rounded-full text-xs ${s.ShipmentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                          {s.ShipmentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-b">
                        {s.ShipmentDate ? new Date(s.ShipmentDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3 border-b truncate max-w-sm">{s.ShipmentAddress}</td>
                      <td className="px-4 py-3 border-b">{s.ShipmentCity}</td>
                      <td className="px-4 py-3 border-b">{s.ShipmentPhone}</td>
                      <td className="px-4 py-3 border-b font-semibold text-green-600">
                        ${s.totalPrice?.toFixed(2) || '0.00'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="px-4 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <FaShippingFast className="text-4xl text-gray-300 mb-3" />
                        <p className="font-medium">No shipment data found</p>
                        <p className="text-sm mt-1">
                          {filterEstimationId ? 'Try changing your filter criteria' : 'No shipments are available'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
