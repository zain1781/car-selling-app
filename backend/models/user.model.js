const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const authschema = new mongoose.Schema(
  {
    
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["buyer","staff", "admin"], default: "buyer" }, 
    verified: { type: Boolean, default: false }, // If verification is neede
 
  },
  {
    timestamps: true,
  }
);

authschema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
  } catch (error) {
      console.error(error);
      process.exit(1);
  }
});

// Correct method attachment
authschema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', authschema);

module.exports = User;