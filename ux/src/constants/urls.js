const baseURL = "http://localhost:8080/api";

const URLs = {
    Employees: {
        Common: `${baseURL}/employee`
    },
    Projects: {
        Common: `${baseURL}/project`
    },
    Tasks: {
        Common: `${baseURL}/task`
    },
    Timesheets:{
        Common: `${baseURL}/timesheet`
    }
};

export default URLs;


