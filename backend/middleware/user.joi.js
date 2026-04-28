const Joi = require('joi');
const jwt = require('jsonwebtoken')
 const signup =  (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        phone: Joi.number().required(),
        country: Joi.string().required(),
        password: Joi.string().min(8).required(),

    })
    const {error} = schema.validate(req.body)
    if(error) {
        return res.status(400).json({error: error.details[0].message});
    }
    next();
}
 const loginValidator = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
            success: false,
        });
    }

    next();
};

 const adminValidate = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Access denied, no token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Allow both admin and staff roles to access admin routes
        if (decoded.role !== "admin" && decoded.role !== "staff") {
            return res.status(403).json({ message: "Access denied, requires admin or staff role" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Invalid token" });
    }
};
 const userValidate = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Access denied, no token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "buyer" && decoded.role !== "seller") {
            return res.status(403).json({ message: "Access denied, not a user" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = { signup, loginValidator, adminValidate, userValidate };
