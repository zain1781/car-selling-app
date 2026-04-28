const Inventory = require("../models/inventory.model.js");

const allInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find({});
        if (!inventory || inventory.length === 0) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        res.status(200).json(inventory);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

 const createInventory = async (req, res) => {
    try {
        const {  make, model, year, price, mileage, fuelType, transmission, bodyType, condition, description, status, userId, location ,portleading,color,edition} = req.body;

        // Check for required fields
        if ( !make || !model || !year || !price || !mileage || !fuelType || !userId ) {
            return res.status(400).json({
                message: "Missing required fields:  make, model, year, price, mileage, fuelType, and userId are mandatory."
            });
        }

        // Convert year, price, and mileage to numbers
        const yearNum = Number(year);
        const priceNum = Number(price);
        const mileageNum = Number(mileage);

        if (isNaN(yearNum) || isNaN(priceNum) || isNaN(mileageNum)) {
            return res.status(400).json({
                message: "Invalid data type: year, price, and mileage must be numbers."
            });
        }

        // Handle images and docs safely
        const imagePaths = req.files && req.files.images
            ? req.files.images.map(file => `/uploads/${file.filename}`)
            : [];
        const docPaths = req.files && req.files.docs
            ? req.files.docs.map(file => `/uploads/${file.filename}`)
            : [];

        // Create inventory item with userId
        const newInventory = await Inventory.create({
            userId,  // ✅ Storing the userId
            make,
            model,
            year: yearNum,
            price: priceNum,
            mileage: mileageNum,
            fuelType,
            transmission,
            bodyType,
            condition,
            description,
            status,
            location,
            portleading,
            color,
            edition,
            images: imagePaths,
            docs: docPaths,
        });

        return res.status(201).json(newInventory);
    } catch (error) {
        console.error("Error creating inventory:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

 const InventoryByid = async (req, res) => {
    try {
        const id = req.params.id;
        const inventory = await Inventory.findById(id);
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        res.status(200).json(inventory);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

 const deleteInventory = async (req, res) => {
    try {
        const id = req.params.id;
        const inventory = await Inventory.findByIdAndDelete(id);
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        res.status(200).json({ message: "Inventory deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
 const deleteAllInventory = async (req, res) => {
    try {
        const inventory = await Inventory.deleteMany();
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        res.status(200).json({ message: "All Inventory deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
 const updateInventory = async (req, res) => {
    try {
        const id = req.params.id;

        // Check if we have files in the request
        if (req.files) {
            // Get the existing inventory item
            const existingInventory = await Inventory.findById(id);
            if (!existingInventory) {
                return res.status(404).json({ message: "Inventory not found" });
            }

            // Process images if they exist
            let imagePaths = existingInventory.images || [];
            if (req.files.images) {
                const newImagePaths = req.files.images.map(file => `/uploads/${file.filename}`);
                imagePaths = [...imagePaths, ...newImagePaths];
            }

            // Process docs if they exist
            let docPaths = existingInventory.docs || [];
            if (req.files.docs) {
                const newDocPaths = req.files.docs.map(file => `/uploads/${file.filename}`);
                docPaths = [...docPaths, ...newDocPaths];
            }

            // Update with form data and new file paths
            const updateData = {
                ...req.body,
                images: imagePaths,
                docs: docPaths
            };

            const updatedInventory = await Inventory.findByIdAndUpdate(id, updateData, { new: true });
            return res.status(200).json(updatedInventory);
        } else {
            // Regular update without files
            const inventory = await Inventory.findByIdAndUpdate(id, req.body, { new: true });
            if (!inventory) {
                return res.status(404).json({ message: "Inventory not found" });
            }
            return res.status(200).json(inventory);
        }
    } catch (error) {
        console.error("Error updating inventory:", error);
        return res.status(500).json({ message: error.message });
    }
}
 const getInventoryByUserId = async (req, res) => {
    try {
        const userId = req.params.id;

        const inventory = await Inventory.find({ userId });

        if (!inventory || inventory.length === 0) {
            return res.status(404).json({ message: "No inventory found for this user." });
        }

        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};


module.exports = { allInventory, createInventory, InventoryByid, deleteInventory, deleteAllInventory, updateInventory, getInventoryByUserId };
