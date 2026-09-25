const express = require('express');
const router = express.Router();
const profileController = require('../controller/profile.controller');

router.post('/', profileController.createProfile);

router.get('/:id', profileController.getProfileById);

router.put('/:id', profileController.updateProfile);

module.exports = router;