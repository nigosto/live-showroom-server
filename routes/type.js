const router = require('express').Router();
const typeController = require('../controllers/type');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin')

router.post('/create',typeController.createType)
router.post('/models/:type', typeController.getModelsFromOneType)

module.exports = router;