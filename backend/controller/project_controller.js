const Project = require("../models/Project");

const getProjects = async (req, res, next) => {
  const projects = await Project.aggregate(
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
          'type':1,
          'startDate':1,
          'budget':1,
          'endDate':1,
          'status':1,
          'skills':1,
          'createdAt': 1, 
          'updatedAt': 1
        }
      }
    ]);
  return res.status(200).json({
    message: "Success",
    data: projects,
  });
};

const getProject = async (req, res, next) => {
  const { name } = req.params;
  const project = await Project.findOne({ name: name });
  let startDate, endDate;
  if (project) {
    startDate = project.startDate.toISOString().split('T')[0];
    endDate = project.endDate.toISOString().split('T')[0];
  }
  return res.status(200).json({
    message: "Success",
    data: { ...project.toObject(), startDate, endDate}
  });
};

const saveProject = async (req, res, next) => {
  console.log(req.body);
  const projectInDb = await Project.findOne({ name: req.body.name });
  console.log(projectInDb);
  if (projectInDb) {
    return res.status(200).json({
      message: "Project Should Not Match"
    });
  }
  const project = await Project.create(req.body);
  return res.status(200).json({
    message: "Success",
    data: project,
  });
};

const updateProject = async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findOneAndUpdate({ name: id }, req.body);
  return res.status(200).json({
    message: "Success",
    data: project,
  });
};

const deleteProject = async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findOneAndDelete({ _id: id });
  return res.status(200).json({
    message: "Success",
    data: project,
  });
};
module.exports = {
  getProjects,
  getProject,
  saveProject,
  updateProject,
  deleteProject,
};