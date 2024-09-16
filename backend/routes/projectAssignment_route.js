const express = require('express');
const router = express.Router();
const { getAssignments, saveAssignment, updateAssignment, deleteAssignment, getAssignment, getAssignmentByProjectId } = require('./../controller/projectAssignment_controller');

router.get('/', getAssignments);
router.get('/:id', getAssignment);
router.get('/byproject/:id', getAssignmentByProjectId);
router.post('/', saveAssignment);
router.put('/:id', updateAssignment);
router.delete('/:id', deleteAssignment);

module.exports = router;