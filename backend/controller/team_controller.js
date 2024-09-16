const Team = require("../models/Team");

const getTeams = async (req, res, next) => {
  const teams = await Team.aggregate(
    [
      {
        '$lookup': {
          'from': 'employees', 
          'localField': 'owner', 
          'foreignField': '_id', 
          'as': 'owner'
        }
      }, {
        '$unwind': {
          'path': '$owner', 
          'includeArrayIndex': 'string', 
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$lookup': {
          'from': 'employees', 
          'let': {
            'members': '$members'
          }, 
          'pipeline': [
            {
              '$match': {
                '$expr': {
                  '$in': [
                    {
                      '$toString': '$_id'
                    }, '$$members'
                  ]
                }
              }
            }
          ], 
          'as': 'members'
        }
      }, {
        '$project': {
          '_id': 1, 
          'name': 1, 
          'description': 1, 
          'owner_id': '$owner._id', 
          'owner_name': {
            '$concat': [
              '$owner.firstname', ' ', '$owner.lastname'
            ]
          }, 
          'members._id': 1, 
          'createdAt': 1, 
          'updatedAt': 1, 
          'members.firstname': 1, 
          'members.lastname': 1
        }
      }
    ]);
  return res.status(200).json({
    message: "Success",
    data: teams,
  });
};

const getTeam = async (req, res, next) => {
  const { id: name } = req.params;
  const team = await Team.findOne({ name: name });
  return res.status(200).json({
    message: "Success",
    data: team,
  })
};
const saveTeam = async (req, res, next) => {
  console.log(req.body);
  const teamInDb = await Team.findOne({ name: req.body.name });
  console.log(teamInDb);
  if (teamInDb) {
    return res.status(200).json({
      message: "Already Exist"
    });
  }
  const team = await Team.create(req.body);
  return res.status(200).json({
    message: "Success",
    data: team,
  });
};
const updateTeam = async (req, res, next) => {
  const { id } = req.params;
  const team = await Team.findOneAndUpdate({ name: id }, req.body);
  return res.status(200).json({
    message: "Success",
    data: team,
  });
};

const deleteTeam = async (req, res, next) => {
  const { id } = req.params;
  const team = await Team.findOneAndDelete({ _id: id });
  return res.status(200).json({
    message: "Success",
    data: team,
  });
};
module.exports = {
  getTeams,
  getTeam,
  saveTeam,
  updateTeam,
  deleteTeam,
};