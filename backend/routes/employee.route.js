const express = require('express');
const {createemployee,allemployee,updateemployee,getemployee} = require('../controllers/employee.controller.js')

const router = express.Router();

router.post('/create', createemployee);
router.get('/',allemployee);
router.put('/:id',updateemployee);
router.get('/:id',getemployee);
// router.delete('/:id',deleteemployee);


module.exports = router;
