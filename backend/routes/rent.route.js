// rentAssets.js
const express = require("express");
const {addrent,allrent,getrent,updaterent,deleterent} = require('../controllers/rent.controller.js')
const router = express.Router();

router.post("/", addrent);

router.get("/",allrent);
router.get("/:id", getrent);
router.put("/:id", updaterent);
router.delete("/:id", deleterent);


module.exports = router;
