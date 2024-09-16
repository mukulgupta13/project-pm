const express = require('express');
const router = express.Router();
const {getTasks, saveTask, updateTask, deleteTask, getTask} = require('./../controller/task_controller');

router.post('/', saveTask);
router.get('/', getTasks);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;