const Task = require("../models/Task");

const getTasks = async (req, res, next) => {
  const tasks = await Task.aggregate(
    [
      {
        '$lookup': {
          'from': 'projects', 
          'localField': 'project', 
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
        '$project': {
          '_id': 1, 
          'title': 1,
          'ID':1, 
          'description': 1, 
          'project_id': '$project_details._id', 
          'project_name': {
            '$concat': [
                { '$toString': '$project_details.code' }, ':', '$project_details.name'
            ]
          }, 
          'project':1,
          'status':1,
          'efforts':1,
          'importance':1,
          'createdAt': 1, 
          'updatedAt': 1
        }
      }
    ]);
  return res.status(200).json({
    message: "Success",
    data: tasks,
  });
};

const getTask = async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findOne({ ID:id });
  return res.status(200).json({
    message: "Success",
    data: task,
  });
};

const saveTask = async (req, res, next) => {
  console.log(req.body);
  const taskInDb = await Task.findOne({ ID: req.body.ID });
  console.log(taskInDb);
  if (taskInDb) {
    return res.status(200).json({
      message: "Task Should Not Match"
    });
  }
  const task = await Task.create(req.body);
  return res.status(200).json({
    message: "Success",
    data: task,
  });
};

const updateTask = async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findOneAndUpdate({ ID: id }, req.body);
  return res.status(200).json({
    message: "Success",
    data: task,
  });
};

const deleteTask = async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findOneAndDelete({ _id: id });
  return res.status(200).json({
    message: "Success",
    data: task,
  });
};
module.exports = {
  getTasks,
  getTask,
  saveTask,
  updateTask,
  deleteTask,
};