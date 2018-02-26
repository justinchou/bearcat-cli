'use strict';

let express = require('express');
let router = express.Router();
let bearcat = require('bearcat');

router.get('/', bearcat.getRoute('bearController', 'index'));

module.exports = router;
