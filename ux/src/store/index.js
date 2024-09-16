import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "./../slices/employee.slice";
import projectReducer from "./../slices/project.slice";
import assignmentReducer from "./../slices/assignment.slice";
import taskReducer from "./../slices/task.slice";
import timesheetReducer from "./../slices/timesheet.slice";

export default configureStore({
    reducer: {
        employees: employeeReducer,
        projects: projectReducer,
        assignments: assignmentReducer,
        tasks: taskReducer,
        timesheets: timesheetReducer,
    },
})