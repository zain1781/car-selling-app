const Order = require("../models/order.model.js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const AddOrder = async (req, res) => {
    try {
        const { userId, carId, price, name, email, phone, payment, country } = req.body;

        // Validate input
        if (!userId || !carId || !price || !name || !email || !phone || !payment || !country) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if the car is already ordered by the user
        const existingOrder = await Order.findOne({ userId, carId });
        if (existingOrder) {
            return res.status(400).json({ message: "Car already ordered." });
        }

        if (payment === "paypal") {
            const token = jwt.sign({ email,price,name,phone,country }, process.env.JWT_SECRET, { expiresIn: "1h" });

            // Nodemailer configuration
            const transporter = nodemailer.createTransport({
                service: "gmail",
                secure: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
           
            // Email details
            const receiver = {
                from: process.env.EMAIL,
                to: email,
                subject: "verify your payment",
                html: `
                    <p>To verify your payment, please click the link below:</p>
                    <a href="${process.env.FRONTENDURL}/payment/${token}" target="_blank">
                        verify payment
                    </a>
                    <p>This link will expire in a week.</p>
                `,
            };
        
            // Send the email
            await transporter.sendMail(receiver);
        }
        if (payment === "wire") {
            const token = jwt.sign({ email,price,name,phone,address,city }, process.env.JWT_SECRET, { expiresIn: "1h" });

            // Nodemailer configuration
            const transporter = nodemailer.createTransport({
                service: "gmail",
                secure: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
           
            // Email details
            const receiver = {
                from: process.env.EMAIL,
                to: email,
                subject: "verify your Wire payment",
                html: `
                    <p>To verify your payment, please click the link below:</p>
                    <a href="${process.env.FRONTENDURL}/bank/${token}" target="_blank">
                        verify payment
                    </a>
                    <p>This link will expire in a week.</p>
                `,
            };
        
            // Send the email
            await transporter.sendMail(receiver);
        }
        if (payment === "wallet") {
            const token = jwt.sign({ email,price,name,phone,address,city }, process.env.JWT_SECRET, { expiresIn: "1h" });

            // Nodemailer configuration
            const transporter = nodemailer.createTransport({
                service: "gmail",
                secure: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
           
            // Email details
            const receiver = {
                from: process.env.EMAIL,
                to: email,
                subject: "verify your wallet payment",
                html: `
                    <p>To verify your payment, please click the link below:</p>
                    <a href="${process.env.FRONTENDURL}/wallet/${token}" target="_blank">
                        verify payment
                    </a>
                    <p>This link will expire in a week.</p>
                `,
            };
        
            // Send the email
            await transporter.sendMail(receiver);
        }
        // Create a new order
        const order = await Order.create({ userId, carId, price, name, email, phone, payment, country });
        return res.status(201).json({ message: "Order created successfully.", order });

    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};


const GetOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        return res.status(200).json({ message: "Orders fetched successfully.", orders });   
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
}
const DeleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByIdAndDelete(id);
        return res.status(200).json({ message: "Order deleted successfully.", order });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
}
const UpdateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, carId, price, name, email, phone, payment, status } = req.body;
        const order = await Order.findByIdAndUpdate(id, { userId, carId, price, name, email, phone, payment, status });
        return res.status(200).json({ message: "Order updated successfully.", order });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
}               

const OrderByid = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }
        return res.status(200).json({ message: "Order fetched successfully.", order });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
}
const OrderByuserid = async (req, res) => {
    try {
        const { id } = req.params;
        const orders = await Order.find({ userId: id });
        return res.status(200).json({ message: "Orders fetched successfully.", orders });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
}       
module.exports = { AddOrder, GetOrders, DeleteOrder, UpdateOrder, OrderByid, OrderByuserid };
