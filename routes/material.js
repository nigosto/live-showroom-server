const router = require('express').Router();
const materialController = require('../controllers/material');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin')

router.post('/upload',materialController.uploadMaterial)

module.exports = router;