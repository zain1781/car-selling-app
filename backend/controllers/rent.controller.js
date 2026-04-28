const RentAsset = require("../models/rent.model.js");



const addrent = async (req, res) => {
        try {
          const asset = new RentAsset(req.body);
          const saved = await asset.save();
          res.status(201).json(saved);
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      }

const allrent =  async (req, res) => {
        const data = await RentAsset.find();
        res.json(data);
      }
      const getrent = async (req, res) => {
        const id = req.params.id;
        const data = await RentAsset.findById(id);
        res.json(data);
      }
      const updaterent = async (req, res) => {
        const id = req.params.id;
        const data = await RentAsset.findByIdAndUpdate(id, req.body, { new: true });
        res.json(data);
      }
      const deleterent = async (req, res) => {
        const id = req.params.id;
        const data = await RentAsset.findByIdAndDelete(id);
        res.json(data);
      }


module.exports = {addrent,allrent,getrent,updaterent,deleterent};