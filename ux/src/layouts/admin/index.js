import { CircularProgress } from "@mui/material";
import MDBox from "components/MDBox";
import NavigateHRef from "constants/navigatehref";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Assignments from "layouts/assignments";
import AssignmentEntry from "layouts/assignments/assignment-details";
import Employees from "layouts/employees";
import EmployeeEntry from "layouts/employees/employee-details";
import Projects from "layouts/projects";
import ProjectEntry from "layouts/projects/project-details";
import Tasks from "layouts/tasks";
import TaskEntry from "layouts/tasks/task-details";
import Teams from "layouts/teams";
import TeamEntry from "layouts/teams/team-details";
import TimeSheets from "layouts/timeSheets";
import TimeSheetEntry from "layouts/timeSheets/timesheet-details";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";

function AuthenticatedApp() {
    const [isLoading, setIsLoading] = useState(false);
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox py={3} style={{ minHeight: '80vh' }}>

                <Routes>
                    <Route path={NavigateHRef[0].Projects} element={<Projects />} />
                    <Route path={NavigateHRef[0].ProjectEntry} element={<ProjectEntry />} />
                    <Route path={`${NavigateHRef[0].ProjectEntry}/:id`} element={<ProjectEntry />} />
                    <Route path={NavigateHRef[1].Employees} element={<Employees />} />
                    <Route path={NavigateHRef[1].EmployeeEntry} element={<EmployeeEntry />} />
                    <Route path={`${NavigateHRef[1].EmployeeEntry}/:id`} element={<EmployeeEntry />} />
                    <Route path={NavigateHRef[2].Teams} element={<Teams />} />
                    <Route path={NavigateHRef[2].TeamEntry} element={<TeamEntry />} />
                    <Route path={`${NavigateHRef[2].TeamEntry}/:id`} element={<TeamEntry />} />
                    <Route path={NavigateHRef[3].Assignments} element={<Assignments />} />
                    <Route path={NavigateHRef[3].AssignmentEntry} element={<AssignmentEntry />} />
                    <Route path={`${NavigateHRef[3].AssignmentEntry}/:id`} element={<AssignmentEntry />} />
                    <Route path={NavigateHRef[4].Tasks} element={<Tasks />} />
                    <Route path={NavigateHRef[4].TaskEntry} element={<TaskEntry />} />
                    <Route path={`${NavigateHRef[4].TaskEntry}/:id`} element={<TaskEntry />} />
                    <Route path={NavigateHRef[5].TimeSheets} element={<TimeSheets />} />
                    <Route path={NavigateHRef[5].TimeSheetEntry} element={<TimeSheetEntry />} />
                    <Route path={`${NavigateHRef[5].TimeSheetEntry}/:id`} element={<TimeSheetEntry />} />
                </Routes>
            </MDBox>
            <Footer />
            {isLoading && (
                <div className="progress-bar-wrapper">
                    <div className="overlay">
                        <CircularProgress color="primary" />
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default AuthenticatedApp;
