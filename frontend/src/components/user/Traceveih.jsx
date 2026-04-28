import React, { useState, useEffect,useRef } from 'react';
import { FaTruck, FaBox, FaCheckCircle, FaWarehouse, FaClipboardCheck } from 'react-icons/fa';
import { MdLocalShipping } from 'react-icons/md';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import logo from '../../assets/img/logo.png'

export default function Traceveih() {
    const [shipments, setShipments] = useState([]);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const pdfRef = useRef(null);
 const [car, setCar] = useState(null);
    const api = import.meta.env.VITE_API_URL;
        const upload = import.meta.env.VITE_UPLOADS;

    useEffect(() => {
        fetchUserShipment();
    }, []);

    // User information
    const name = localStorage.getItem('user');
    const email = localStorage.getItem('email');

    const fetchUserShipment = async () => {
        try {
            const userId = localStorage.getItem('userid');
            console.log("UserId from localStorage:", userId);

            if (!userId) {
                console.log("No userId found in localStorage");
                setLoading(false);
                return;
            }

            const url = `${api}shipment/user/${userId}`;
            console.log("Fetching from URL:", url);

            const response = await fetch(url);
            console.log("Response status:", response.status);

            if (response.status === 404) {
                console.log("No shipments found for this user");
                setShipments([]);
                setLoading(false);
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            console.log("Parsed shipments data:", data);

            // Ensure we have an array of shipments
            let shipmentsArray = [];

            if (Array.isArray(data)) {
                shipmentsArray = data;
            } else if (data && typeof data === 'object') {
                // Check if data has a property that might contain the shipments array
                if (Array.isArray(data.shipments)) {
                    shipmentsArray = data.shipments;
                } else {
                    // If it's a single shipment object
                    shipmentsArray = [data];
                }
            }

            console.log("Processed shipments array:", shipmentsArray);

            if (shipmentsArray.length > 0) {
                // Sort shipments by date (newest first)
                const sortedShipments = shipmentsArray.sort((a, b) =>
                    new Date(b.ShipmentDate) - new Date(a.ShipmentDate)
                );

                setShipments(sortedShipments);
                setSelectedShipment(sortedShipments[0]); // Select the most recent shipment
            } else {
                setShipments([]);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching shipments:", error);
            setLoading(false);
        }
    };
  useEffect(() => {
    if (selectedShipment?.InventoryId) {
      fetch(`${api}inventory/${selectedShipment.InventoryId}`)
        .then(res => res.json())
        .then(setCar)
        .catch(console.error);
    }
  }, [selectedShipment]);


    const getStepStatus = (currentStatus, step) => {
        const steps = {
            'order_placed': 0,
            'processing': 1,
            'preparing': 2,
            'in_transit': 3,
            'out_for_delivery': 4,
            'delivered': 5
        };

        return steps[currentStatus] >= steps[step] ? 'completed' : 'pending';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!shipments || shipments.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center text-gray-600">
                    <h2 className="text-2xl font-semibold mb-2">No Active Shipments</h2>
                    <p>There are no shipments to track at this time.</p>
                </div>
            </div>
        );
    }

    const generatePDF = (shipment) => {
        try {
            const doc = new jsPDF();

            // Safely extract IDs
            const orderId = shipment.OrderId ?
                (typeof shipment.OrderId === 'string' ?
                    shipment.OrderId :
                    String(shipment.OrderId)) :
                'N/A';

            const trackingId = shipment._id ?
                (typeof shipment._id === 'string' ?
                    shipment._id :
                    String(shipment._id)) :
                'N/A';

            // Add logo
            const img = new Image();
            img.src = logo;
            img.onload = () => {
                try {
                    doc.addImage(img, 'png', 80, 10, 50, 20);

                    // Header with Company Information
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(14);
                    doc.text("American Car", 80, 40);
                    doc.setFontSize(10);
                    doc.text("New York, NY 10001", 80, 45);
                    doc.text("Contact: cars@gmail.com", 80, 50);
                    doc.text("Phone: +1 (302) 456-7890", 80, 55);

                    // Title
                    doc.setFontSize(16);
                    doc.text("Shipment Invoice", 75, 70);
                    doc.line(10, 75, 200, 75); // Title underline

                    // Draw border
                    doc.rect(5, 5, 200, 285);

                    // Order Info Section
                    doc.setFontSize(12);
                    doc.setFont("helvetica", "bold");
                    doc.text("Order Details", 10, 90);
                    doc.setFont("helvetica", "normal");
                    doc.text(`Order ID:`, 10, 100);
                    doc.text(orderId.length > 20 ? orderId.slice(0, 20) + '...' : orderId, 60, 100);

                    doc.text(`Shipment Date:`, 10, 110);
                    doc.text(shipment.ShipmentDate ? new Date(shipment.ShipmentDate).toLocaleDateString() : 'N/A', 60, 110);

                    doc.text(`Tracking ID:`, 10, 120);
                    doc.text(trackingId.length > 20 ? trackingId.slice(0, 20) + '...' : trackingId, 60, 120);

                    doc.text(`Status:`, 10, 130);
                    doc.text(shipment.ShipmentStatus ? shipment.ShipmentStatus.replace('_', ' ') : 'N/A', 60, 130);

                    // Customer Info Section
                    doc.setFont("helvetica", "bold");
                    doc.text("Customer Information", 10, 150);
                    doc.setFont("helvetica", "normal");
                    doc.text(`Name:`, 10, 160);
                    doc.text(name || 'N/A', 60, 160);

                    doc.text(`Phone:`, 10, 170);
                    doc.text(shipment.ShipmentPhone || 'N/A', 60, 170);

                    doc.text(`Email:`, 10, 180);
                    doc.text(email || 'N/A', 60, 180);

                    doc.text(`Address:`, 10, 190);
                    doc.text(shipment.ShipmentAddress || 'N/A', 60, 190);

                    doc.text(`City:`, 10, 200);
                    doc.text(shipment.ShipmentCity || 'N/A', 60, 200);

                    // Price Section
                    doc.setFont("helvetica", "bold");
                    doc.text("Price Details", 10, 220);
                    doc.setFont("helvetica", "normal");
                    doc.text(`Total Price:`, 10, 230);
                    doc.text(`$${shipment.totalPrice ? parseFloat(shipment.totalPrice).toFixed(2) : '0.00'}`, 60, 230);

                    // Footer
                    doc.setFontSize(10);
                    doc.setFont("helvetica", "italic");
                    doc.text("Thank you for your business!", 70, 250);
                    doc.text("For any inquiries, please contact us.", 65, 255);

                    // Save PDF with a safe filename
                    const safeOrderId = orderId.replace(/[^a-zA-Z0-9]/g, '').slice(-6);
                    doc.save(`Shipment_Invoice_${safeOrderId || '000000'}.pdf`);
                } catch (error) {
                    console.error("Error generating PDF content:", error);
                    alert("There was an error generating the PDF. Please try again.");
                }
            };

            // Handle image loading error
            img.onerror = () => {
                console.error("Error loading logo image");
                // Continue with PDF generation without the logo
                try {
                    // Title
                    doc.setFontSize(16);
                    doc.setFont("helvetica", "bold");
                    doc.text("Shipment Invoice", 75, 30);
                    doc.line(10, 35, 200, 35); // Title underline

                    // Continue with the rest of the PDF generation...
                    // (similar to above but with adjusted y-coordinates)

                    // Save PDF
                    const safeOrderId = orderId.replace(/[^a-zA-Z0-9]/g, '').slice(-6);
                    doc.save(`Shipment_Invoice_${safeOrderId || '000000'}.pdf`);
                } catch (error) {
                    console.error("Error generating PDF without logo:", error);
                    alert("There was an error generating the PDF. Please try again.");
                }
            };
        } catch (error) {
            console.error("Error initializing PDF generation:", error);
            alert("There was an error generating the PDF. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Track Your Vehicle</h1>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Shipment to Track
                    </label>
                    <select
                        className="w-full p-3 border border-gray-300 rounded-md bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        value={selectedShipment?._id || ''}
                        onChange={(e) => setSelectedShipment(shipments.find(s => s._id === e.target.value))}
                    >
                        {shipments.map((shipment) => {
                            // Safely extract the last 6 characters of OrderId if it exists
                            const orderId = shipment.OrderId ?
                                (typeof shipment.OrderId === 'string' ?
                                    shipment.OrderId.slice(-6) :
                                    String(shipment.OrderId).slice(-6)) :
                                'N/A';

                            return (
                                <option key={shipment._id} value={shipment._id}>
                                    {`Order ${orderId} - ${new Date(shipment.ShipmentDate).toLocaleDateString()} - ${shipment.ShipmentStatus.charAt(0).toUpperCase() + shipment.ShipmentStatus.slice(1).replace('_', ' ')}`}
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {shipments.map((shipment) => {
                        // Safely extract the last 6 characters of OrderId if it exists
                        const orderId = shipment.OrderId ?
                            (typeof shipment.OrderId === 'string' ?
                                shipment.OrderId.slice(-6) :
                                String(shipment.OrderId).slice(-6)) :
                            'N/A';

                        return (
                            <div
                                key={shipment._id}
                                className={`p-4 rounded-lg border ${
                                    selectedShipment?._id === shipment._id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200'
                                } cursor-pointer`}
                                onClick={() => setSelectedShipment(shipment)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-sm">
                                        <p className="font-medium">Order #{orderId}</p>
                                        <p className="text-gray-500">{new Date(shipment.ShipmentDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        shipment.ShipmentStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                        shipment.ShipmentStatus === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {shipment.ShipmentStatus.replace('_', ' ')}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {selectedShipment && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-8">
                            <div className="w-full">
                                <div className="relative">
                                    {/* Progress bar */}
                                    <div className="h-2 bg-gray-200 rounded-full">
                                        <div
                                            className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${(getStepStatus(selectedShipment.ShipmentStatus, 'delivered') === 'completed' ? 100 :
                                                        getStepStatus(selectedShipment.ShipmentStatus, 'out_for_delivery') === 'completed' ? 75 :
                                                        getStepStatus(selectedShipment.ShipmentStatus, 'in_transit') === 'completed' ? 50 :
                                                        getStepStatus(selectedShipment.ShipmentStatus, 'processing') === 'completed' ? 25 : 0)}%`
                                            }}


                                        />
                                    </div>

                                    {/* Steps */}
                                    <div className="flex justify-between mt-6">
                                        {[
                                            { icon: <FaClipboardCheck />, label: 'Order Placed', status: 'order_placed' },
                                            { icon: <FaBox />, label: 'Processing', status: 'processing' },
                                            { icon: <FaWarehouse />, label: 'Preparing', status: 'preparing' },
                                            { icon: <FaTruck />, label: 'In Transit', status: 'in_transit' },
                                            { icon: <MdLocalShipping />, label: 'Out for Delivery', status: 'out_for_delivery' },
                                            { icon: <FaCheckCircle />, label: 'Delivered', status: 'delivered' }
                                        ].map((step, index) => (
                                            <div key={index} className="flex flex-col items-center">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                    getStepStatus(selectedShipment.ShipmentStatus, step.status) === 'completed'
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200 text-gray-500'
                                                }`}>
                                                    {step.icon}
                                                </div>
                                                <span className="text-xs mt-2 text-gray-600">{step.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipment Details */}
                        <div className="bg-gray-50 rounded-lg p-4 mt-6">
                          
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Tracking ID</p>
                                    <p className="font-medium">
                                        {selectedShipment._id ?
                                            (typeof selectedShipment._id === 'string' ?
                                                selectedShipment._id.slice(0,8)+'...' :
                                                String(selectedShipment._id).slice(0,8)+'...') :
                                            'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Order ID</p>
                                    <p className="font-medium">
                                        {selectedShipment.OrderId ?
                                            (typeof selectedShipment.OrderId === 'string' ?
                                                selectedShipment.OrderId.slice(0,8)+'...' :
                                                String(selectedShipment.OrderId).slice(0,8)+'...') :
                                            'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Shipment Date</p>
                                    <p className="font-medium">{selectedShipment.ShipmentDate ? new Date(selectedShipment.ShipmentDate).toLocaleString() : 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Last Updated</p>
                                    <p className="font-medium">{selectedShipment.updatedAt ? new Date(selectedShipment.updatedAt).toLocaleString() : 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Delivery Address</p>
                                    <p className="font-medium">{selectedShipment.ShipmentAddress || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Current Status</p>
                                    <p className="font-medium capitalize">{selectedShipment.ShipmentStatus ? selectedShipment.ShipmentStatus.replace('_', ' ') : 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Car Details Section */}
                        {car ? (
                            <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
                                {/* Header */}
                                <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                                    {car.images && car.images.length > 0 ? (
                                        <img
                                            src={`${upload}${car.images[0]}`}
                                            alt={car.make || 'Car image'}
                                            className="w-full md:w-64 h-48 object-contain rounded border"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full md:w-64 h-48 bg-gray-200 flex items-center justify-center rounded border">
                                            <span className="text-gray-500">No image available</span>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold mb-1">
                                            {car.make || 'N/A'} {car.model || ''} {car.year ? `(${car.year})` : ''}
                                        </h2>
                                        <p className="text-gray-600">{car.description || 'No description available'}</p>
                                        <p className="mt-2 text-sm text-gray-500">Status: <span className="font-semibold">{car.status || 'N/A'}</span></p>
                                    </div>
                                </div>

                                {/* Car Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Car Info</h3>
                                        <ul className="text-sm text-gray-700 space-y-1">
                                            <li><strong>Fuel:</strong> {car.fuelType || 'N/A'}</li>
                                            <li><strong>Transmission:</strong> {car.transmission || 'N/A'}</li>
                                            <li><strong>Body:</strong> {car.bodyType || 'N/A'}</li>
                                            <li><strong>Color:</strong> {car.color || 'N/A'}</li>
                                            <li><strong>Edition:</strong> {car.edition || 'N/A'}</li>
                                            <li><strong>Condition:</strong> {car.condition || 'N/A'}</li>
                                            <li><strong>Mileage:</strong> {car.mileage ? `${car.mileage} km` : 'N/A'}</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Location & Status</h3>
                                        <ul className="text-sm text-gray-700 space-y-1">
                                            <li><strong>Location:</strong> {car.location || 'N/A'}</li>
                                            <li><strong>Port:</strong> {car.portOfLoading || 'N/A'}</li>
                                            <li><strong>Received at:</strong> {car.currentStatus || 'N/A'}</li>
                                            <li><strong>Handed to Customer:</strong> {car.handedToCustomer || 'N/A'}</li>
                                            <li><strong>Sold in Dubai:</strong> {car.soldInDubai || 'N/A'}</li>
                                            <li><strong>In Transit:</strong> {car.inTransit || 'N/A'}</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold mb-2">Pricing Info</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-800">
                                        <div><strong>Price:</strong> ${car.price || '0'}</div>
                                        <div><strong>Repair Cost:</strong> ${car.repairCost || '0'}</div>
                                        <div><strong>Storage Fee:</strong> ${car.storageFee || '0'}</div>
                                        <div><strong>Custom Fee:</strong> ${car.customFee || '0'}</div>
                                        <div><strong>Agent Fee:</strong> ${car.agentFee || '0'}</div>
                                        <div><strong>Amount Due:</strong> ${car.amountDue || '0'}</div>
                                        <div><strong>Amount Received:</strong> ${car.amountReceived || '0'}</div>
                                        <div><strong>Sold Amount:</strong> ${car.soldAmount || '0'}</div>
                                    </div>
                                </div>

                                {/* Documents */}
                                {car.docs && car.docs.length > 0 ? (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold mb-2">Documents</h3>
                                        <a
                                            href={`${upload}${car.docs[0]}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            View Invoice (PDF)
                                        </a>
                                    </div>
                                ) : (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold mb-2">Documents</h3>
                                        <p className="text-sm text-gray-500">No documents available</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Loading vehicle information...</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
