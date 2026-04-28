const Employee =require ("../models/employee.model.js")

const createemployee = async (req, res) => {
    try {
        const data = req.body;

        const newEmployee = new Employee(data);
        await newEmployee.save(); // Ensure the document is saved to the database

        res.status(201).json({ message: "Employee created successfully", employee: newEmployee });
    } catch (error) {
        console.error("Error creating employee:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const allemployee = async (req, res) => {
    try {
      const data = await Employee.find({});
  
      if (!data || data.length === 0) {
        return res.status(404).json({ message: "No employees found" });
      }
  
      return res.status(200).json({
        message: "Employees fetched successfully",
        data,
      });
    } catch (error) {
      console.error("Error fetching employees:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  const updateemployee = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
  
    try {
      const updatedEmployee = await Employee.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      res.status(200).json({ message: "Employee updated successfully", data: updatedEmployee });
    } catch (error) {
      console.error("Error updating employee:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  const getemployee = async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ message: "Employee ID is required" });
    }
  
    try {
      const data = await Employee.findById(id);
  
      if (!data) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      return res.status(200).json({
        message: "Employee fetched successfully",
        data,
      });
  
    } catch (error) {
      console.error("Error fetching employee:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  


  module.exports = {
    createemployee,
    allemployee,
    updateemployee,
    getemployee
  };