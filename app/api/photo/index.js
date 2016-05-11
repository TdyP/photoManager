"use strict";
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

var express = require('express');
var controller = require('./photo.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', upload.array('photos', 12), controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;