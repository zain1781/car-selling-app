import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { FaFileInvoice, FaUser, FaCar, FaDownload, FaSpinner, FaEdit, FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaEnvelope, FaMoneyBillWave, FaTruck } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img from "../../assets/img/card.png";

const API_URL = import.meta.env.VITE_API_URL;
const UPLOADS_URL = import.meta.env.VITE_UPLOADS;

export default function Invoice() {
    const [dataa, setdataa] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [estim, setestim] = useState(null);
    const [carData, setCarData] = useState(null);
    const [ship, setShipments] = useState([]);
    const [selectedShipmentId, setSelectedShipmentId] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState('');
    const [payment, setPayment] = useState(['Cash', 'PayPal', 'Wire Transfer', 'Credit Card', 'Bank Transfer']);
    const [customerNote, setCustomerNote] = useState('');
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);

    const [editableData, setEditableData] = useState({
        order: {},
        car: {},
        user: {}
    });
    const [logo, setLogo] = useState(null);
    const [card, setcard] = useState(null);



    useEffect(() => {
      const loadLogo = async () => {
        try {
          // const { default: logoData } = await logoPromise; // Dynamic import
          // setLogo(logoData);
          //  Regular import should work fine in most cases.  If you have issues, use dynamic import
          import("../../assets/img/logo.png").then((module) => {
            setLogo(module.default);
          });
        } catch (error) {
          console.error("Failed to load logo:", error);
          // Handle the error appropriately, e.g., set a default or show an error message
          setLogo(null); // Set to null to indicate logo loading failure
        }
      };
      loadLogo();
    }, []);
    useEffect(() => {
      const loadcard = async () => {
        try {
          // const { default: cardData } = await cardPromise; // Dynamic import
          // setcard(cardData);
          //  Regular import should work fine in most cases.  If you have issues, use dynamic import
          import("../../assets/img/card.png").then((module) => {
            setcard(module.default);
          });
        } catch (error) {
          console.error("Failed to load card:", error);
          // Handle the error appropriately, e.g., set a default or show an error message
          setcard(null); // Set to null to indicate card loading failure
        }
      };
      loadcard();
    }, []);
    useEffect(() => {
      const fetchesit = async () => {
        try {
          const response = await fetch(`${API_URL}estimation`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const data = await response.json();
          setestim(data);

          // Optional: only filter if ship exists
          if (ship?.orderId) {
            const filteredData = data.filter(item => item._id === ship.orderId);
            setdataa(filteredData);
            console.log("Filtered Data:", filteredData[0]);
          }

          setLoading(false); // move this here after fetch & filtering

        } catch (error) {
          console.error("Error fetching shipments:", error);
          setLoading(false);
        }
      };

      fetchesit();
    }, []);


    useEffect(() => {
        const fetchShipments = async () => {
            try {
                const response = await fetch(`${API_URL}shipment`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                const data = await response.json();
                setShipments(data);
                setLoading(false); // Move setLoading(false) here, after fetching shipments
                // If you want to load the first shipment's data by default, you can do this:
                if (data && data.length > 0) {
                    setSelectedShipmentId(data[0]._id); // Select the first shipment
                }
            } catch (error) {
                console.error("Error fetching shipments:", error);
                setLoading(false);
            }
        };

        fetchShipments();
    }, []);

    useEffect(() => {
        const orderddata = async () => {
            if (!selectedShipmentId) return; // Don't fetch if no shipment is selected

            setLoading(true); // Start loading before fetching
            try {
                const response = await fetch(`${API_URL}shipment`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                const data = await response.json();
                setShipments(data);

                const filteredData = data.filter(item => item._id === selectedShipmentId);
                setdataa(filteredData);
console.log("hello",filteredData.EstimationId)
                console.log(data);
            } catch (error) {
                console.error("Error fetching order data:", error);
            } finally {
                setLoading(false); // Ensure loading is set to false after fetch
            }
        };

        orderddata();
    }, [selectedShipmentId]);

    useEffect(() => {
        if (Array.isArray(dataa) && dataa.length > 0) {
            try {
                const order = dataa[0];
                console.log("Parsed Data:", order);

                setOrderData({
                    OrderId: order.OrderId || "",
                    EstimationId: order.EstimationId || "",
                    ShipmentAddress: order.ShipmentAddress || order.shipmentAddress || "",
                    ShipmentCity: order.ShipmentCity || order.shipmentCity || "",
                    ShipmentDate: order.ShipmentDate || order.shipmentDate || "",
                    ShipmentStatus: order.ShipmentStatus || order.shipmentStatus || "",
                    ShipmentPhone: order.ShipmentPhone || "",
                    Name: order.Name || order.name || "",
                    Status: order.Status || order.status || "",
                    createdAt: order.createdAt || order.createdAt || "",
                    updatedAt: order.updatedAt || order.updatedAt || "",
                    InventoryId: order.InventoryId || "",
                    UserId: order.UserId || order.userId || "",
                    totalPrice: order.totalPrice || 0
                });

            } catch (error) {
                console.error("Error handling order data:", error);
                setLoading(false);
            }
        }
    }, [dataa]);


    useEffect(() => {
        const fetchData = async () => {
          if (!orderData) return;
          setLoading(true);
          try {
            const inventoryId = orderData.InventoryId;
            const userId = orderData.UserId;

            if (inventoryId) {
              const carResponse = await fetch(`${API_URL}inventory/${inventoryId}`);
              if (!carResponse.ok) throw new Error("Car data fetch failed");
              const carJson = await carResponse.json();
              console.log("Car Data:", carJson);
              setCarData(carJson);
            }

            if (userId) {
              const userResponse = await fetch(`${API_URL}users/${userId}`);
              if (!userResponse.ok) throw new Error("User data fetch failed");
              const userJson = await userResponse.json();
              console.log("User Data:", userJson);
              setUserData(userJson);
            }
          } catch (error) {
            console.error("Error fetching data:", error);
            alert("Error loading data. Please try again.");
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      }, [orderData]);

    useEffect(() => {
        if (orderData) {
            setEditableData(prev => ({
                ...prev,
                order: { ...orderData }
            }));
        }
        if (carData) {
            setEditableData(prev => ({
                ...prev,
                car: { ...carData }

            }));
        }
        if (userData) {
            setEditableData(prev => ({
                ...prev,
                user: { ...userData }
            }));
        }
    }, [orderData, carData, userData]);


    // console.log(editableData.order.EstimationId)

    const handleInputChange = (section, field, value) => {
        setEditableData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const generatePDF = async () => {
        try {
            if (!editableData.order || !editableData.car || !editableData.user) {
                toast.error("Insufficient data to generate invoice");
                return;
            }

            toast.info("Generating professional invoice...");

            // Create PDF document with better quality settings
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });

            // Set document properties
            doc.setProperties({
                title: `Invoice #${editableData.order.OrderId || 'Unknown'}`,
                subject: 'Vehicle Invoice',
                author: 'American Car Auction',
                keywords: 'invoice, vehicle, car auction',
                creator: 'Invoice Generator'
            });

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

            // Add logo with error handling
            if (logo) {
                try {
                    doc.addImage(logo, "PNG", margin, margin, 40, 16);
                } catch (error) {
                    console.error("Error adding logo:", error);
                }
            }

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
            const invoiceText = `#${editableData.order.OrderId || 'N/A'}`;
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
            doc.text(`Date: ${invoiceDate ? new Date(invoiceDate).toLocaleDateString() : 'N/A'}`, margin + 5, currentY + 12);
            doc.text(`Payment Method: ${selectedPayment || 'N/A'}`, margin + 5, currentY + 18);

            // Right column - Customer details
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            const customerX = margin + contentWidth / 2;
            doc.text("BILLED TO", customerX, currentY + 6);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text(`${editableData.user.name || 'N/A'}`, customerX, currentY + 12);
            doc.text(`${editableData.user.email || 'N/A'}`, customerX, currentY + 18);

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
            doc.text(`Address: ${editableData.order.ShipmentAddress || 'N/A'}`, margin + 5, currentY + 12);
            doc.text(`City: ${editableData.order.ShipmentCity || 'N/A'}`, margin + 5, currentY + 18);

            // Status on right side
            doc.setFont("helvetica", "bold");
            const statusX = margin + contentWidth / 2;
            doc.text("STATUS", statusX, currentY + 6);

            doc.setFont("helvetica", "normal");
            doc.text(`Shipment Status: ${editableData.order.ShipmentStatus || 'N/A'}`, statusX, currentY + 12);
            doc.text(`Phone: ${editableData.order.ShipmentPhone || 'N/A'}`, statusX, currentY + 18);

            // ===== VEHICLE DETAILS SECTION =====

            currentY += 35;

            // Section title
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text("VEHICLE DETAILS", margin, currentY);

            // Horizontal line
            doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
            doc.setLineWidth(0.5);
            doc.line(margin, currentY + 3, pageWidth - margin, currentY + 3);

            currentY += 8;

            // Vehicle details table
            autoTable(doc, {
                startY: currentY,
                margin: { left: margin, right: margin },
                tableWidth: contentWidth,
                head: [["Vehicle Details", "Specifications"]],
                body: [
                    ["Make", editableData.car.make || 'N/A'],
                    ["Model", editableData.car.model || 'N/A'],
                    ["Year", editableData.car.year || 'N/A'],
                    ["VIN", editableData.car.vin || 'N/A'],
                    ["Color", editableData.car.color || 'N/A'],
                    ["Price", editableData.car.price ? `$${editableData.car.price.toLocaleString()}` : 'N/A'],
                    ["Fuel Type", editableData.car.fuelType || 'N/A'],
                    ["Transmission", editableData.car.transmission || 'N/A'],
                    ["Mileage", editableData.car.mileage ? `${editableData.car.mileage.toLocaleString()} km` : 'N/A']
                ],
                styles: {
                    fontSize: 9,
                    cellPadding: 4,
                    overflow: 'linebreak',
                    halign: 'left',
                    textColor: [60, 60, 60]
                },
                columnStyles: {
                    0: { cellWidth: 50, fontStyle: 'bold' },
                    1: { cellWidth: 130 }
                },
                headStyles: {
                    fillColor: secondaryColor,
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    fontSize: 10
                },
                alternateRowStyles: { fillColor: [245, 245, 245] },
                didDrawPage: function (data) {
                    currentY = data.cursor.y;
                }
            });

            // ===== PAYMENT SUMMARY SECTION =====

            currentY += 15;

            // Payment summary box
            doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2], 0.1);
            doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.roundedRect(pageWidth - margin - 80, currentY, 80, 35, 2, 2, 'FD');

            // Payment details
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text("PAYMENT SUMMARY", pageWidth - margin - 75, currentY + 8);

            doc.setLineWidth(0.2);
            doc.line(pageWidth - margin - 75, currentY + 10, pageWidth - margin - 5, currentY + 10);

            // Subtotal and total
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            doc.text("Subtotal:", pageWidth - margin - 75, currentY + 18);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text("TOTAL:", pageWidth - margin - 75, currentY + 28);

            // Amounts
            const subtotal = editableData.order.totalPrice || 0;
            const total = subtotal;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            const subtotalText = `$${subtotal.toLocaleString()}`;
            doc.text(subtotalText, pageWidth - margin - 5 - doc.getTextWidth(subtotalText), currentY + 18);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            const totalText = `$${total.toLocaleString()}`;
            doc.text(totalText, pageWidth - margin - 5 - doc.getTextWidth(totalText), currentY + 28);

            // Add payment method logo if available
            if (card && selectedPayment) {
                try {
                    doc.addImage(card, "PNG", margin, currentY + 5, 30, 10);
                } catch (error) {
                    console.error("Error adding payment logo:", error);
                }
            }

            // ===== CUSTOMER NOTE SECTION =====

            if (customerNote && customerNote.trim() !== '') {
                currentY += 45;

                // Note box
                doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
                doc.roundedRect(margin, currentY, contentWidth, 25, 2, 2, 'F');

                // Note title
                doc.setFont("helvetica", "bold");
                doc.setFontSize(9);
                doc.setTextColor(textColor[0], textColor[1], textColor[2]);
                doc.text("CUSTOMER NOTE", margin + 5, currentY + 6);

                // Note content
                doc.setFont("helvetica", "normal");
                doc.setFontSize(9);
                doc.text(customerNote, margin + 5, currentY + 14, {
                    maxWidth: contentWidth - 10,
                    align: 'left'
                });
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
            doc.text(`Page 1 of ${editableData.car?.images && editableData.car.images.length > 0 ? '2' : '1'}`, pageWidth - margin - 20, footerY + 10);

            // ===== VEHICLE IMAGES PAGE =====

            if (editableData.car?.images && editableData.car.images.length > 0) {
                doc.addPage();

                // Header for images page
                doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
                doc.rect(margin, margin, contentWidth, 12, 'F');

                doc.setFont("helvetica", "bold");
                doc.setFontSize(12);
                doc.setTextColor(255, 255, 255);
                doc.text(`VEHICLE IMAGES - ${editableData.car.make || ''} ${editableData.car.model || ''}`, margin + 5, margin + 8);

                // Invoice number on right
                const invoiceText = `Invoice #${editableData.order.OrderId || 'N/A'}`;
                doc.setFontSize(10);
                doc.text(invoiceText, pageWidth - margin - 5 - doc.getTextWidth(invoiceText), margin + 8);

                const addImage = (imageUrl) => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.crossOrigin = "Anonymous";
                        img.src = `${UPLOADS_URL}${imageUrl}`;
                        img.onload = () => resolve(img);
                        img.onerror = reject;
                    });
                };

                // Function to add images to PDF
                const addImagesToPDF = async () => {
                    try {
                        let yPosition = margin + 20;
                        const imagesPerRow = 2;
                        const imageWidth = 80;
                        const imageHeight = 60;
                        const spacing = 10;

                        // Image counter for captions
                        let imageCount = 1;

                        for (let i = 0; i < Math.min(editableData.car.images.length, 6); i++) {
                            const img = await addImage(editableData.car.images[i]);

                            // Calculate x position (alternating between left and right)
                            const xPosition = margin + (i % imagesPerRow) * (imageWidth + spacing);

                            // Add image with border
                            doc.setDrawColor(200, 200, 200);
                            doc.setLineWidth(0.5);
                            doc.rect(xPosition, yPosition, imageWidth, imageHeight);

                            doc.addImage(
                                img,
                                'JPEG',
                                xPosition,
                                yPosition,
                                imageWidth,
                                imageHeight,
                                `image${i}`,
                                'MEDIUM'
                            );

                            // Add caption
                            doc.setFont("helvetica", "normal");
                            doc.setFontSize(8);
                            doc.setTextColor(100, 100, 100);
                            const caption = `Image ${imageCount} - ${editableData.car.make || ''} ${editableData.car.model || ''}`;
                            doc.text(caption, xPosition + imageWidth/2 - doc.getTextWidth(caption)/2, yPosition + imageHeight + 5);

                            imageCount++;

                            // Move to next row if needed
                            if ((i + 1) % imagesPerRow === 0) {
                                yPosition += imageHeight + 15; // Add extra space for caption
                            }
                        }
                    } catch (error) {
                        console.error("Error adding images to PDF:", error);
                    }
                };

                // Add images
                await addImagesToPDF();

                // Footer on images page
                doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
                doc.setLineWidth(0.5);
                doc.line(margin, footerY, pageWidth - margin, footerY);

                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                doc.text("These images are for reference purposes only. Actual vehicle may vary slightly.", margin, footerY + 5);
                doc.text("© American Car Auction - All Rights Reserved", margin, footerY + 10);

                // Page number
                doc.text("Page 2 of 2", pageWidth - margin - 20, footerY + 10);
            }

            // Save with error handling
            try {
                doc.save(`Invoice_${editableData.order.OrderId || 'unknown'}.pdf`);
                toast.success("Professional invoice PDF generated successfully!");
            } catch (error) {
                console.error("Error saving PDF:", error);
                toast.error("Error generating PDF. Please try again.");
            }
        } catch (error) {
            console.error("PDF generation error:", error);
            toast.error("Error generating PDF. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-6">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header with Logo and Title */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3">
                        <FaFileInvoice className="text-4xl text-blue-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Invoice Generator</h1>
                            <p className="text-gray-500">Create professional invoices for your customers</p>
                        </div>
                    </div>

                    <select
                        value={selectedShipmentId || ''}
                        onChange={(e) => setSelectedShipmentId(e.target.value)}
                        className="w-full sm:w-72 px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="" disabled>Select Shipment</option>
                        {ship.map((item, index) => (
                            <option key={index} value={item._id}>
                                Shipment #{index + 1} -{item.name || ''} - {item.ShipmentCity || ''}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Invoice Header Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-blue-600 p-4 text-white">
                        <h2 className="text-xl font-semibold">Invoice Information</h2>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Bill To */}
                        <div className="space-y-2">
                            <label htmlFor="billTo" className="block text-sm font-medium text-gray-700">
                                <FaUser className="inline mr-2 text-blue-600" /> Bill To
                            </label>
                            <input
                                id="billTo"
                                type="text"
                                value={editableData.user.name || ''}
                                onChange={(e) => handleInputChange('user', 'name', e.target.value)}
                                placeholder="Customer Name"
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* From */}
                        <div className="space-y-2">
                            <label htmlFor="from" className="block text-sm font-medium text-gray-700">
                                <FaFileInvoice className="inline mr-2 text-blue-600" /> From
                            </label>
                            <input
                                id="from"
                                type="text"
                                value="American Car Auction"
                                readOnly
                                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                            />
                        </div>

                        {/* Invoice Date */}
                        <div className="space-y-2">
                            <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700">
                                <FaCalendarAlt className="inline mr-2 text-blue-600" /> Invoice Date
                            </label>
                            <input
                                id="invoiceDate"
                                type="date"
                                value={invoiceDate}
                                onChange={(e) => setInvoiceDate(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Payment Method & Customer Note */}
                    <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Payment Method */}
                        <div className="space-y-2">
                            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                                <FaMoneyBillWave className="inline mr-2 text-blue-600" /> Payment Method
                            </label>
                            <select
                                id="paymentMethod"
                                value={selectedPayment}
                                onChange={(e) => setSelectedPayment(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>Select Payment Method</option>
                                {payment.map((item, index) => (
                                    <option key={index} value={item}>{item}</option>
                                ))}
                            </select>
                            {selectedPayment && (
                                <div className="mt-2 flex items-center">
                                    <img src={img} alt="Payment Card" className="h-8" />
                                    <span className="ml-2 text-sm text-gray-600">{selectedPayment} payment selected</span>
                                </div>
                            )}
                        </div>

                        {/* Customer Note */}
                        <div className="space-y-2">
                            <label htmlFor="customerNote" className="block text-sm font-medium text-gray-700">
                                <FaEdit className="inline mr-2 text-blue-600" /> Customer Note
                            </label>
                            <textarea
                                id="customerNote"
                                value={customerNote}
                                onChange={(e) => setCustomerNote(e.target.value)}
                                placeholder="Add notes for the customer..."
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                            />
                        </div>
                    </div>

                    {/* Estimation ID Link */}
                    {editableData.order?.EstimationId && (
                        <div className="px-6 pb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FaFileInvoice className="inline mr-2 text-blue-600" /> Estimation Reference
                            </label>
                            <NavLink
                                to={`/admin/info/${editableData.order.EstimationId}`}
                                className="inline-block px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-md hover:bg-blue-100 transition border border-blue-200"
                            >
                                View Estimation #{editableData.order.EstimationId.slice(0, 8)}...
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-8">
                    {/* Loading State */}
                    {loading ? (
                        <div className="text-center py-16">
                            <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
                            <p className="text-gray-600">Loading invoice data...</p>
                        </div>
                    ) : orderData ? (
                        <>
                            {/* Order Information */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b flex items-center gap-2">
                                    <FaTruck className="text-blue-600" /> Shipment Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Order ID</label>
                                        <input
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Order ID"
                                            value={editableData.order.OrderId || ''}
                                            onChange={(e) => handleInputChange('order', 'OrderId', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Shipment Status</label>
                                        <input
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Shipment Status"
                                            value={editableData.order.ShipmentStatus || ''}
                                            onChange={(e) => handleInputChange('order', 'ShipmentStatus', e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Total Price ($)</label>
                                        <input
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            type="number"
                                            placeholder="Total Price"
                                            value={editableData.order.totalPrice || ''}
                                            onChange={(e) => handleInputChange('order', 'totalPrice', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            <FaMapMarkerAlt className="inline mr-1 text-blue-600" /> Address
                                        </label>
                                        <input
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Shipment Address"
                                            value={editableData.order.ShipmentAddress || ''}
                                            onChange={(e) => handleInputChange('order', 'ShipmentAddress', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">City</label>
                                        <input
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Shipment City"
                                            value={editableData.order.ShipmentCity || ''}
                                            onChange={(e) => handleInputChange('order', 'ShipmentCity', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            <FaPhone className="inline mr-1 text-blue-600" /> Phone
                                        </label>
                                        <input
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Shipment Phone"
                                            value={editableData.order.ShipmentPhone || ''}
                                            onChange={(e) => handleInputChange('order', 'ShipmentPhone', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b flex items-center gap-2">
                                    <FaUser className="text-blue-600" /> Customer Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Customer Name"
                                            value={editableData.user.name || ''}
                                            onChange={(e) => handleInputChange('user', 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            <FaEnvelope className="inline mr-1 text-blue-600" /> Email
                                        </label>
                                        <input
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            type="email"
                                            placeholder="Email"
                                            value={editableData.user.email || ''}
                                            onChange={(e) => handleInputChange('user', 'email', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            <FaPhone className="inline mr-1 text-blue-600" /> Phone
                                        </label>
                                        <input
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Phone"
                                            value={editableData.user.phone || ''}
                                            onChange={(e) => handleInputChange('user', 'phone', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle Information */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b flex items-center gap-2">
                                    <FaCar className="text-blue-600" /> Vehicle Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Make</label>
                                        <input
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Make"
                                            value={editableData.car.make || ''}
                                            onChange={(e) => handleInputChange('car', 'make', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Model</label>
                                        <input
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Model"
                                            value={editableData.car.model || ''}
                                            onChange={(e) => handleInputChange('car', 'model', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Year</label>
                                        <input
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Year"
                                            value={editableData.car.year || ''}
                                            onChange={(e) => handleInputChange('car', 'year', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                                        <input
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            type="number"
                                            placeholder="Price"
                                            value={editableData.car.price || ''}
                                            onChange={(e) => handleInputChange('car', 'price', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
                                        <input
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Fuel Type"
                                            value={editableData.car.fuelType || ''}
                                            onChange={(e) => handleInputChange('car', 'fuelType', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Transmission</label>
                                        <input
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Transmission"
                                            value={editableData.car.transmission || ''}
                                            onChange={(e) => handleInputChange('car', 'transmission', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Vehicle Images */}
                                {carData?.images?.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-medium mb-3 text-gray-700">Vehicle Images</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {carData.images.slice(0, 8).map((img, index) => (
                                                <div key={index} className="relative group overflow-hidden rounded-lg shadow-sm border border-gray-200">
                                                    <img
                                                        src={`${UPLOADS_URL}${img}`}
                                                        alt={`Vehicle ${index + 1}`}
                                                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Generate PDF Button */}
                            <button
                                onClick={generatePDF}
                                className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg flex justify-center items-center gap-3 transition-all shadow-md hover:shadow-lg"
                            >
                                <FaDownload className="text-xl" /> Generate Professional Invoice PDF
                            </button>
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <div className="text-5xl text-gray-300 mb-4">
                                <FaFileInvoice className="mx-auto" />
                            </div>
                            <p className="text-gray-500 text-lg">No invoice data available. Please select a shipment.</p>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer position="bottom-right" autoClose={5000} />
        </div>
    );
}