const express = require('express');
const { allInventory, createInventory, InventoryByid,deleteInventory,deleteAllInventory,updateInventory,getInventoryByUserId } = require('../controllers/inventory.controller.js');
const upload = require('../middleware/multer.js');

const router = express.Router();

router.get('/', allInventory);
router.get('/:id', InventoryByid);
router.post('/create', upload.fields([
    { name: 'images', maxCount: 20 },
    { name: 'docs', maxCount: 20 }
]), createInventory);
router.delete('/:id', deleteInventory);
router.get('/delete-all', deleteAllInventory);
router.put('/:id', upload.fields([
    { name: 'images', maxCount: 20 },
    { name: 'docs', maxCount: 20 }
]), updateInventory);
router.get('/user/:id', getInventoryByUserId);

module.exports = router;
