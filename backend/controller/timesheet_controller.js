const Timesheet = require("../models/Timesheet");

const getTimesheets = async (req, res, next) => {
  const timesheets = await Timesheet.aggregate(
    [
      {
        '$lookup': {
          'from': 'employees', 
          'localField': 'employee', 
          'foreignField': '_id', 
          'as': 'employee_details'
        }
      }, {
        '$unwind': {
          'path': '$employee_details', 
          'includeArrayIndex': 'string', 
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$project': {
          '_id': 1, 
          'name': 1, 
          'description': 1, 
          'employee': 1, 
          'employee_name': {
            '$concat': [
              '$employee_details.firstname', ' ', '$employee_details.lastname'
            ]
          }, 
          'date': 1,
          'task':1,
          'duration':1,
          'starttime': 1,
          'endtime': 1,
          'status':1,
          'createdAt': 1, 
          'updatedAt': 1
        }
      }
    ]);
  return res.status(200).json({
    message: "Success",
    data: timesheets,
  });
};
const getTimesheet = async (req, res, next) => {
  const { task } = req.params;
  const timesheet = await Timesheet.findOne({ task: task });
  let date;
   if (timesheet) {
    date = timesheet.date.toISOString().split("T")[0];
   }
  return res.status(200).json({
    message: "Success",
    data: timesheet,
  })
};

const saveTimesheet = async (req, res, next) => {
  console.log(req.body);
  const timesheetInDb = await Timesheet.findOne({task: req.body.task });
  console.log(timesheetInDb);
  if (timesheetInDb) {
    return res.status(200).json({
      message: "Timesheet Should Not Match"
    });
  }
  const timesheet = await Timesheet.create(req.body);
  return res.status(200).json({
    message: "Success",
    data: timesheet,
  });
};

const updateTimesheet = async (req, res, next) => {
  const { id } = req.params;
  const timesheet = await Timesheet.findOneAndUpdate({ task: id }, req.body);
  return res.status(200).json({
    message: "Success",
    data: timesheet,
  });
};

const deleteTimesheet = async (req, res, next) => {
  const { id } = req.params;
  const timesheet = await Timesheet.findOneAndDelete({ _id: id });
  return res.status(200).json({
    message: "Success",
    data: timesheet,
  });
};
module.exports = {
  getTimesheets,
  getTimesheet,
  saveTimesheet,
  updateTimesheet,
  deleteTimesheet,
};