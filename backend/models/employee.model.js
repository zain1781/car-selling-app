const mongoose = require('mongoose');


const employee = new mongoose.Schema(
  {
    
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    role: { type: String, default: "employee" }, 
    salary:{type: Number, required: true},
    assigned_tasks:{type: String, required: true},
    designation:{type: String, required: true},
    isactive: { type: Boolean, default: false }, // If verification is neede
 
  },
  {
    timestamps: true,
  }
);


const Employee = mongoose.model('Employee', employee);

module.exports = Employee;