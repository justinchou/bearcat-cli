'use strict';

let express = require('express');
let router = express.Router();

router.get('/', bearcat.getRoute('userController', 'index'));

module.exports = router;
