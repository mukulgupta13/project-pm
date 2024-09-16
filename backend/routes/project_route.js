const express = require('express');
const router = express.Router();
const { getProjects, saveProject, updateProject, deleteProject, getProject } = require('./../controller/project_controller');

router.get('/', getProjects);
router.get('/:name', getProject);
router.post('/', saveProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

module.exports = router;