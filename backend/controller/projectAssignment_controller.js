const ObjectId = require('mongoose').Types.ObjectId;
const Assignment = require("../models/ProjectAssignment");

const getAssignments = async (req, res, next) => {

  const assignments = await Assignment.aggregate(
    [
      ...projectLookup,
      {
        '$project': {
          '_id': 1,
          'projectId': 1,
          'project_name': {
            '$concat': [
              { '$toString': '$project_details.code' }, ':', '$project_details.name'
            ]
          },
          'teams': 1,
          'teams_data._id': 1,
          'createdAt': 1,
          'updatedAt': 1,
          'teams_data.name': 1
        }
      }
    ]);
  return res.status(200).json({
    message: "Success",
    data: assignments,
  });
};

const projectLookup = [{
  '$lookup': {
    'from': 'projects',
    'localField': 'projectId',
    'foreignField': '_id',
    'as': 'project_details'
  }
}, {
  '$unwind': {
    'path': '$project_details',
    'includeArrayIndex': 'string',
    'preserveNullAndEmptyArrays': true
  }
}, {
  '$lookup': {
    'from': 'teams',
    'let': {
      'teams': '$teams'
    },
    'pipeline': [
      {
        '$match': {
          '$expr': {
            '$in': [
              {
                '$toString': '$_id'
              }, '$$teams'
            ]
          }
        }
      }
    ],
    'as': 'teams_data'
  }
}];

const getAssignment = async (req, res, next) => {
  const { id } = req.params;
  console.log(req.params);
  const assignment = await Assignment.aggregate(
    [
      { '$match': { _id: ObjectId(id) } },
      ...projectLookup,
      {
        '$project': {
          '_id': 1,
          'projectId': 1,
          'project_name': {
            '$concat': [
              { '$toString': '$project_details.code' }, ':', '$project_details.name'
            ]
          },
          'teams': 1,
          'teams_data._id': 1,
          'createdAt': 1,
          'updatedAt': 1,
          'teams_data.name': 1
        }
      }
    ]);
  return res.status(200).json({
    message: "Success",
    data: assignment && assignment[0],
  });
};

const getAssignmentByProjectId = async (req, res, next) => {
  const { id } = req.params;
  console.log(req.params);
  const assignment = await Assignment.aggregate(
    [
      { '$match': { projectId: ObjectId(id) } },
      ...projectLookup,
      {
        '$project': {
          '_id': 1,
          'projectId': 1,
          'project_name': {
            '$concat': [
              { '$toString': '$project_details.code' }, ':', '$project_details.name'
            ]
          },
          'teams': 1,
          'teams_data._id': 1,
          'createdAt': 1,
          'updatedAt': 1,
          'teams_data.name': 1
        }
      }
    ]);
  return res.status(200).json({
    message: "Success",
    data: assignment && assignment[0],
  });
};

const saveAssignment = async (req, res, next) => {
  let assignment = await Assignment.findOneAndUpdate({ projectId: req.body.projectId }, req.body);
  if (!assignment) {
    assignment = await Assignment.create(req.body);
  }
  return res.status(200).json({
    message: "Success",
    data: assignment,
  });
};

const updateAssignment = async (req, res, next) => {
  const { id } = req.params;
  const assignment = await Assignment.findOneAndUpdate({ projectId: id }, req.body);
  return res.status(200).json({
    message: "Success",
    data: assignment,
  });
};

const deleteAssignment = async (req, res, next) => {
  const { id } = req.params;
  const assignment = await Assignment.findOneAndDelete({ _id: id });
  return res.status(200).json({
    message: "Success",
    data: assignment,
  });
};
module.exports = {
  getAssignments,
  getAssignment,
  getAssignmentByProjectId,
  saveAssignment,
  updateAssignment,
  deleteAssignment,
};