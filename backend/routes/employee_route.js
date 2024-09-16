const express = require('express');
const router = express.Router();
const { getEmployees, saveEmployee, updateEmployee, deleteEmployee, getEmployee } = require('./../controller/employee_controller');

router.get('/', getEmployees);
router.get('/:id', getEmployee);
router.post('/', saveEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;