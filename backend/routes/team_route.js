const express = require('express');
const router = express.Router();
const {getTeams, saveTeam, updateTeam, deleteTeam, getTeam} = require('./../controller/team_controller');

router.post('/', saveTeam);
router.get('/', getTeams);
router.get('/:id', getTeam);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);

module.exports = router;