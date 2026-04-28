const Estimation = require('../models/estimation.model.js');

const createEst = async (req, res) => {
    const { orderId, userId } = req.body;
  
    try {
      const datafind = await Estimation.find({ orderId, userId });
  
      if (datafind.length > 0) {
        return res.status(400).json({ message: "Estimation already exists for this order" });
      }
  
      // If not found, create new estimation
      const data = new Estimation({ orderId, userId });
      await data.save();
  
      return res.status(201).json({ message: "Estimation created successfully", data });
      
    } catch (error) {
      console.error("Error creating estimation:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  

const getallestimation = async (req, res) => {
    try {
      const data = await Estimation.find();
      
      if (data.length === 0) {
        return res.status(404).json({ message: "No estimations found" });
      }
  
      res.status(200).json(data);
  
    } catch (error) {
      console.error("Error fetching estimations:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  const getestid = async (req, res) => {
    const id = req.params.id;
  
    try {
      const data = await Estimation.findById(id);
  
      if (!data) {
        return res.status(404).json({ message: "Estimation not found" });
      }
  
      res.status(200).json(data);
  
    } catch (error) {
      console.error("Error fetching estimation:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

  const deletedata = async (req, res) => {
    try {
      const result = await Estimation.deleteMany({}); // Delete all documents in the collection
  
      res.status(200).json({
        message: 'All estimations deleted successfully',
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      console.error('Error deleting data:', error);
      res.status(500).json({ message: 'Failed to delete estimations', error });
    }
  };
  
module.exports = {createEst,getallestimation,deletedata,getestid};