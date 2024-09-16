const Employee = require("../models/Employee");
const Project = require("../models/Project");
const Team = require("../models/Team");

const getEmployees = async (req, res, next) => {
  const employees = await Employee.find();
  return res.status(200).json({
    message: "Success",
    data: employees,
  });
};

const getEmployee = async (req, res, next) => {
  const { id } = req.params;
  const employee = await Employee.findOne({ firstname: id });
  // let dob, dom;
  // if (employee) {
  //   dob = employee.dob.toISOString().split("T")[0];
  //   dom = employee.dom.toISOString().split("T")[0];
  // }
  return res.status(200).json({
    message: "Success",
    data: { ...employee.toObject() },
  });
};

const saveEmployee = async (req, res, next) => {
  console.log(req.body);
  const employeeInDb = await Employee.findOne({
    firstname: req.body.firstname,
  });
  console.log(employeeInDb);
  console.log("employeeInDb");
  if (employeeInDb) {
    return res.status(200).json({
      message: "Employee details Should Not Match",
    });
  }
  const employee = await Employee.create(req.body);
  return res.status(200).json({
    message: "Success",
    data: employee,
  });
};

const updateEmployee = async (req, res, next) => {
  const { id } = req.params;
  const employee = await Employee.findOneAndUpdate({ firstname: id }, req.body);
  return res.status(200).json({
    message: "Success",
    data: employee,
  });
};

const deleteEmployee = async (req, res, next) => {
  const { id } = req.params;
  const empAsPrjOwner = await Project.findOne({ "owner.id": id });
  const empInTeam = await Team.findOne({
    $or: [{ "owner.id": id }, { "members.id": id }],
  });
  if(empAsPrjOwner || empInTeam){
    return res.status(200).json({
      status: "Fail",
      message: "Employee is exist in projects or teams.",
    });
  }
  const employee = await Employee.findOneAndDelete({ _id: id });
  return res.status(200).json({
    status: "Success",
    message: `Employee '${[employee.firstname, employee.lastname].join(' ')}' is deleted successfully.`,
  });
};
module.exports = {
  getEmployees,
  getEmployee,
  saveEmployee,
  updateEmployee,
  deleteEmployee,
};
