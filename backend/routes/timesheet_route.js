const express = require('express');
const router = express.Router();
const { getTimesheets, saveTimesheet, updateTimesheet, deleteTimesheet, getTimesheet } = require('../controller/timesheet_controller');

router.get('/', getTimesheets);
router.get('/:id', getTimesheet);
router.post('/', saveTimesheet);
router.put('/:id', updateTimesheet);
router.delete('/:id', deleteTimesheet);

module.exports = router;