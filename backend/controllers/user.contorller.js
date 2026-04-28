const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const bcrypt = require("bcryptjs");

 const allUser = async (req, res) => {
    try {
        const allusers = await User.find({
            $or: [{ role: "buyer" }, { role: "staff" }, { role: "seller" }]
        });

        res.status(200).json(allusers);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

 const createUser = async (req, res) => {
    try {
        const { name, email,country, phone, password } = req.body;
        const existUser = await User.findOne({ email });

        if (existUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({ name, email,country, phone, password });
        await newUser.save();
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

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
          subject: "verify your email",
          html: `
            <p>To verify your email, please click the link below:</p>
            <a href="${process.env.FRONTENDURL}/verify/${token}" target="_blank">
            verify email
            </a>
            <p>This link will expire in 1 hour.</p>
          `,
        };
    
        // Send the email
        await transporter.sendMail(receiver);
    
        res.status(201).json({ message: "User created successfully and email sent for verification", user: newUser });
        

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 const loginUser = async (req, res) => {
  try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(400).json({ message: "User not found" });
      }

      if (!user.verified) {
          return res.status(400).json({ message: "Please verify your email" });
      }

      // Add debug logs
      console.log('Attempting password comparison');
      const isPasswordValid = await user.comparePassword(password);
      console.log('Password valid:', isPasswordValid);

      if (!isPasswordValid) {
          return res.status(401).json({
              message: "Incorrect password",
              success: false,
          });
      }

      const jwtToken = jwt.sign(
          { 
              email: user.email, 
              _id: user._id,
              role: user.role
          },
          process.env.JWT_SECRET,  
          { expiresIn: '24h' }
      );

      return res.status(200).json({
          message: "Login successful",
          success: true,
          jwtToken,
          id: user._id,
          email,
          name: user.name,
          role: user.role
      });

  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


 const getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
 const forgetpassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const checkuser = await User.findOne({ email });
    if (!checkuser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a token for password reset
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

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
      subject: "Reset Your Password",
      html: `
        <p>To reset your password, please click the link below:</p>
        <a href="${process.env.FRONTENDURL}/resetpassword/${token}" target="_blank">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    // Send the email
    await transporter.sendMail(receiver);

    return res.status(200).json({ message: "Password reset email sent successfully" });

  } catch (error) {
    console.error("Error in forgetpassword:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

  const resetpassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
  
      if (!password) {
        return res.status(400).send({ message: "Password is required" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
  
      const newPassword = await bcrypt.hash(password, 10);
  
      user.password = newPassword;
      await user.save();
  
      return res.status(200).send({ message: "Password reset successfully" });
      
    } catch (error) {
      console.error("Error resetting password:", error); // Add more logging for debugging
      if (error.name === 'TokenExpiredError') {
        return res.status(401).send({ message: "Token has expired" });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).send({ message: "Invalid token" });
      }
      res.status(500).send({ message: "Internal server error: " + error.message });
    }
  };
  
   const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        
        // Add specific error handling for token verification
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Verification link has expired" });
            }
            return res.status(401).json({ message: "Invalid verification token" });
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) {  
            return res.status(404).json({ message: "User not found" });
        }

        // Check if already verified
        if (user.verified) {
            return res.status(400).json({ message: "Email already verified" });
        }

        user.verified = true;
        await user.save();
        return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) { 
        return res.status(500).json({ message: error.message });
    }
};
  

 const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Updateuser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { allUser, createUser, loginUser, getUser, forgetpassword, resetpassword, verifyEmail, deleteUser,Updateuser };
