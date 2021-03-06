const router = require('express').Router();
const modelController = require('../controllers/model');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin')

router.post('/upload',modelController.uploadModel )
router.post('/upload/image/:name',modelController.uploadImage )
router.get('/default', modelController.getDefaultModels)
router.get('/get/:id', modelController.getModelById)
router.post('/inventory/add/:userId', modelController.addModelToInventory)
router.get('/inventory/get/:userId', modelController.getModelsFromInventory)

module.exports = router;