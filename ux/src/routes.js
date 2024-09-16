
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Projects from "layouts/projects";
import Task from "layouts/tasks";
import TimeSheets from "layouts/timeSheets";
import Employees from "layouts/employees";
import Icon from "@mui/material/Icon";
import EmployeeEntry from "layouts/employees/employee-details";
import ProjectEntry from "layouts/projects/project-details";
import TaskEntry from "layouts/tasks/task-details";
import Teams from "layouts/teams";
import TeamDetails from "layouts/teams/team-details";
import Assignments from "layouts/assignments";
import AssignmentEntry from "layouts/assignments/assignment-details";
import TimeSheetEntry from "layouts/timeSheets/timesheet-details";
import NavigateHRef from "constants/navigatehref";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Tables",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <Billing />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
  {
    type: "divider",
    key: "divider"
  },
  {
    type: "title",
    title: "Manage",
    key: "manage"
  },
  {
    type: "collapse",
    name: "Projects",
    key: "projects",
    icon: <Icon fontSize="small">list</Icon>,
    route: NavigateHRef[0].Projects,
  },
  {
    key: "project-details",
    route: NavigateHRef[0].ProjectEntry,
    
  },
  {
    key: "project-details-id",
    route: `${NavigateHRef[0].ProjectEntry}/:id`,
   
  },
  {
    type: "collapse",
    name: "Employees",
    key: "employees",
    icon: <Icon fontSize="small">people</Icon>,
    route: NavigateHRef[1].Employees,
    
  },
  {
    key: "employee-details",
    route: NavigateHRef[1].EmployeeEntry,
    
  },
  {
    key: "employee-details-id",
    route: `${NavigateHRef[1].EmployeeEntry}/:id`,
  },
  {
    type: "collapse",
    name: "Teams",
    key: "teams",
    icon: <Icon fontSize="small">groups</Icon>,
    route: NavigateHRef[2].Teams,
  },
  {
    key: "team-details-id",
    route: NavigateHRef[2].TeamEntry,
  },
  {
    key: "team-details",
    route:`${NavigateHRef[2].TeamEntry}/:id`,
  },
  {
    type: "collapse",
    name: "Project Assignments",
    key: "assignments",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: NavigateHRef[3].Assignments
  },
  {
    key: "assignment-entry",
    route:NavigateHRef[3].AssignmentEntry,
  },
  {
    key: "assignment-entry-id",
    route:`${NavigateHRef[3].AssignmentEntry}/:id`,
  },
  {
    type: "collapse",
    name: "Tasks",
    key: "tasks",
    icon: <Icon fontSize="small">list</Icon>,
    route: NavigateHRef[4].Tasks,
  },
  {
    key: "task-details",
    route: NavigateHRef[4].TaskEntry,
  },
  {
    key: "task-details-id",
    route: `${NavigateHRef[4].TaskEntry}/:id`,
  },
  {
    type: "collapse",
    name: "Time Sheets",
    key: "TimeSheets",
    icon: <Icon fontSize="small">list</Icon>,
    route:NavigateHRef[5].TimeSheets,
  },
  {
    key: "timesheet-details",
    route: NavigateHRef[5].TimeSheetEntry,
  },
  {
    key: "timesheet-details-id",
    route: `${NavigateHRef[5].TimeSheetEntry}/:id`,
  },
];

export default routes;
