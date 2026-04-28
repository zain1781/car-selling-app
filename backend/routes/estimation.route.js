const express = require('express');
const {createEst,getallestimation,deletedata,getestid} = require('../controllers/estimation.controller.js');
const router = express.Router();

router.post('/create',createEst)
router.get('/',getallestimation)
router.get('/:id',getestid)
router.delete('/',deletedata)

module.exports=router;