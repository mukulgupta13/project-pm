import * as React from 'react';
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
// import MDButton from "components/MDButton";
import DataTable from "examples/Tables/DataTable";
import assignmentTableData from "layouts/tables/data/assignmentTableData";
import { useEffect, useState } from "react";
import { Checkbox, CircularProgress } from '@mui/material';
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ".././assignment.css";
import NavigateHRef from 'constants/navigatehref';

function AssignmentEntry() {
    const [projectData, setProjectData] = useState([]);
    const [teamData, setTeamData] = useState([]);
    const [projectTeams, setProjectTeams] = useState([]);
    const [project, setProject] = useState("");
    const [message, setMessage] = useState("");
    const [current, setCurrent] = useState(null);
    const [disable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { columns } = assignmentTableData();
    const [notification, setNotification] = useState({ title: '', content: '', open: false, color: 'success' });
    const closeNotification = () => setNotification({ title: '', content: '', open: false, color: 'success' });
    const { id } = useParams();
    const navigate = useNavigate();
    const nav = () => {
        navigate(NavigateHRef[3].Assignments);
    }
    const loadTeams = (callback) => {
        fetch('http://localhost:8080/api/team').then(res => res.json()).then(res => {
            setTeamData(res.data);
            callback && callback(res.data);
        });
    }
    const loadProjects = () => {
        fetch('http://localhost:8080/api/project')
            .then(res => res.json())
            .then(res => {

                if (res.message === "Success") {
                    const data = res.data;
                    setProjectData(data);
                }
            });
    }

    const loadProjectAssignementByProjectId = (projectId) => {
        fetch(`http://localhost:8080/api/assignment/byproject/${projectId}`).then(res => res.json()).then(res => {
            setProjectTeams(res.data?.teams ?? []);
            //projectsData.filter((x) => data.projectId.map(m => m).indexOf(x._id) !== -1
        });
    }
    const selectProject = React.useCallback((projectId) => {
        loadProjectAssignementByProjectId(projectId);
        setProject(projectId);
    }, []);

    useEffect(() => {
        const loadProjectAssignement = (id) => {
            setIsLoading(true);
            fetch(`http://localhost:8080/api/assignment/${id}`).then(res => res.json()).then(res => {
                selectProject(res.data?.projectId);
                //projectsData.filter((x) => data.projectId.map(m => m).indexOf(x._id) !== -1
                setIsLoading(false);
            });
        }
        loadTeams((data) => {
            if (id) {
                setDisable(true);
                loadProjectAssignement(id);
                setCurrent(id);
            }
            loadProjects();
        });
    }, [id, selectProject])

    // useEffect(() => {
    //     loadTeams();
    //     loadProjects();
    // }, []);

    const handleTeamChecked = (e) => {
        if (e.target.checked) {
            setProjectTeams((teams) => teams.concat(e.target.value));
        } else {
            setProjectTeams((teams) => teams.filter(x => x !== e.target.value));
        }
    }
    const saveandcontinue = () => {
        saveTeamData(() => {
            reset();
        });
    }
    const saveData = () => {
        saveTeamData(() => {
            setTimeout(nav, 3000);
        });
    }
    const saveTeamData = (cb) => {
        const data = { projectId: project, teams: projectTeams, current };
        setMessage("");
        if (!project) {
            setMessage("Please select a valid Project");
            return;
        }
        if (!projectTeams || projectTeams.length === 0) {
            setMessage("Please select valid teams");
            return;
        }
        setIsLoading(true);
        fetch("http://localhost:8080/api/assignment", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.message === "Success") {
                    setNotification({ title: "Assigned", content: "Project Assigned Successfully", open: true, color: 'success' })
                    cb && cb();
                }
                setIsLoading(false);
            });
    };
    const reset = () => {
        setProject('');
        setProjectTeams([]);
    }
    const rows = teamData || [];
    for (var i = 0; i < rows.length; i++) {
        const _id = rows[i]._id;
        rows[i].action = <Checkbox value={_id} checked={projectTeams.indexOf(_id) !== -1} onChange={(e) => handleTeamChecked(e)} style={{ borderColor: "solid 1px black" }} />

    }
    const renderSuccessSB = (
        <MDSnackbar
            color={notification.color}
            icon="check"
            title={notification.title}
            content={notification.content}
            dateTime=""
            open={notification.open}
            onClose={closeNotification}
            close={closeNotification}
            bgWhite
        />
    );

    return (
        <>
            <div style={{ color: "red", fontSize: "15px" }}>{message}</div>
            <MDBox py={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                                display="flex" justifyContent="space-between" alignItems="center"
                            >
                                <MDTypography variant="h6" color="white">
                                    Projects Assignment
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={4} pb={3} px={3}>
                                <MDBox component="form" role="form">
                                    <MDBox mb={2}>
                                        <label style={{ fontSize: "15px", fontFamily: "Roboto,sans-serif", marginLeft: "6px" }}>Projects</label>
                                        <select value={project}
                                            style={{ border: "none", borderBottom: "solid 1px #ccc", fontSize: "15px", marginTop: "10px" }}
                                            onChange={ev => selectProject(ev.target.value)}
                                            disabled={current != null}>
                                            <option value="">Select Project</option>
                                            {projectData.map(proj => <option key={proj._id} value={proj._id} style={{ fontSize: "15px" }}>{proj.name}</option>)}
                                        </select>
                                    </MDBox>

                                    <MDBox pt={1}>

                                        <DataTable
                                            table={{ columns, rows }}
                                            isSorted={false}
                                            entriesPerPage={false}
                                            showTotalEntries={false}
                                            noEndBorder

                                        />
                                        <MDBox mt={4} mb={1} fullWidth>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={12} lg={12} className="buttons-team-details" >
                                                    <MDButton variant="gradient" disabled={disable} color="success" onClick={saveandcontinue}>
                                                        SAVE & CONTINUE
                                                    </MDButton>

                                                    <MDButton variant="gradient" color="info" onClick={saveData} >
                                                        SAVE
                                                    </MDButton>

                                                    <MDButton variant="gradient" color="error" onClick={nav}>
                                                        CANCEL
                                                    </MDButton>
                                                </Grid>
                                            </Grid>
                                        </MDBox>

                                    </MDBox>
                                </MDBox>
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>

                {renderSuccessSB}
            </MDBox>
            </>
    );
}

export default AssignmentEntry;