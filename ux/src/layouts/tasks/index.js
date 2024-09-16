import * as React from 'react';
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Card from "@mui/material/Card";
import { useNavigate } from "react-router-dom";
import MDTypography from "components/MDTypography";
import { CircularProgress, Icon } from "@mui/material";
import { useEffect, useState } from "react";

// import MDButton from "components/MDButton";
import DataTable from "examples/Tables/DataTable";
import tasksTableData from "layouts/tables/data/tasksTableData";
import { useDispatch, useSelector } from 'react-redux';
import MDButton from 'components/MDButton';
import useConfirm from 'components/useConfirm';
import { setCurrentTask } from 'slices/task.slice';
import { fetchTasks } from 'slices/task.slice';
import { deleteTask } from 'slices/task.slice';
import MDSnackbar from 'components/MDSnackbar';
import { Controller } from 'react-hook-form';
import NavigateHRef from 'constants/navigatehref';
function Tasks() {
    const { columns } = tasksTableData();
    const { darkMode } = Controller;

    const navigate = useNavigate();

    const nav = () => {
        navigate(NavigateHRef[4].TaskEntry);
    }
    const dispatch = useDispatch();
    useEffect(() => {
        setIsLoading(true);
        dispatch(fetchTasks());
        setIsLoading(false)
    }, [dispatch])
    const [notification, setNotification] = useState({ title: '', content: '', open: false });
    const closeNotification = () => setNotification({ title: '', content: '', open: false });
    const { isConfirmed } = useConfirm();
    const editItem = (task) => {
        const data = task;
        dispatch(setCurrentTask(data));
        navigate(`${NavigateHRef[4].TaskEntry}/${task.ID}`);
    }
    const deleteItem = async (ev, task) => {
        ev.preventDefault();
        const confirmed = await isConfirmed(
            `Are you sure. You want to delete employee '${task.ID}'.`
        );
        if (confirmed) {
            dispatch(deleteTask(task._id)).unwrap()
                .then((res) => {
                    if (res.status === "Success") {
                        setNotification({ status: 'success', title: 'Successfully Deleted!', content: res.message, open: true, icon: 'check' });
                    } else {
                        setNotification({ status: 'error', title: 'Error in Delete!', content: res.message, open: true, icon: 'close' });
                    }
                });
        }

    }
    const [isLoading, setIsLoading] = useState(false);
    const { tasks: taskData } = useSelector((state) => state.tasks)

    const rows = taskData?.map((item) => ({ ...item })) || [];
    for (var i = 0; i < rows.length; i++) {
        const task = taskData[i];
        rows[i].action = (
            <MDBox display="flex" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
                <MDTypography onClick={() => editItem(task)}>
                    <MDButton
                        style={{ paddingRight: "0" }}
                        variant="text"
                    color={darkMode ? "white" : "dark"}>
                        <Icon>edit</Icon>&nbsp;
                    </MDButton>
                </MDTypography>
                <MDTypography onClick={(ev) => deleteItem(ev, task)}>
                    <MDButton style={{ paddingLeft: "0" }} variant="text" color="error">
                        <Icon>delete</Icon>&nbsp;
                    </MDButton>
                </MDTypography>
            </MDBox>
        );
    }
    return (
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
                                    Task
                                </MDTypography>
                                <MDBox
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    width="2.25rem"
                                    height="2.25rem"
                                    bgColor="white"
                                    shadow="sm"
                                    borderRadius="50%"
                                    color="dark"
                                    sx={{ cursor: "pointer" }}
                                    onClick={nav}
                                >
                                    <Icon fontSize="small" color="inherit">
                                        add
                                    </Icon>
                                </MDBox>
                            </MDBox>

                            <MDBox pt={3}>

                                <DataTable
                                    table={{ columns, rows }}
                                    isSorted={false}
                                    entriesPerPage={false}
                                    showTotalEntries={false}
                                    noEndBorder

                                />

                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
                <MDSnackbar
                    color="success"
                    icon="check"
                    title={notification.title}
                    content={notification.content}
                    dateTime=""
                    open={notification.open}
                    onClose={closeNotification}
                    close={closeNotification}
                    bgWhite
                />
            </MDBox>
    );
}

export default Tasks;