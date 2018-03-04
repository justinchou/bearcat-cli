'use strict';

let express = require('express');
let router = express.Router();

router.get('/', bearcat.getRoute('bearController', 'index'));

module.exports = router;
