import { Icon } from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import MDTypography from "components/MDTypography";
import useConfirm from "components/useConfirm";
import NavigateHRef from "constants/navigatehref";
import { useMaterialUIController } from "context";
import DataTable from "examples/Tables/DataTable";
import projectsTableData from "layouts/tables/data/projectsTableData";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteProject, fetchProjects, setCurrentProject } from "slices/project.slice";
import "./project.css";

function Projects() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { columns } = projectsTableData();
  const { projects: projectData } = useSelector((state) => state.projects);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);
  const [notification, setNotification] = useState({
    title: "",
    content: "",
    open: false,
    status: "success",
    icon: "check",
  });
  const closeNotification = () =>
    setNotification({
      title: "",
      content: "",
      open: false,
      status: "success",
      icon: "check",
    });
  const { isConfirmed } = useConfirm();
  const navigate = useNavigate();
  const nav = () => {
    navigate(NavigateHRef[0].ProjectEntry);
  };
  const editItem = (proj) => {
    const data = proj;
    dispatch(setCurrentProject(data));
    navigate(`${NavigateHRef[0].ProjectEntry}/${proj.name}`);
  };
  const deleteItem = async (ev, proj) => {
    ev.preventDefault();
    const confirmed = await isConfirmed(
      `Are you sure. You want to delete employee '${proj.name}'.`
    );
    if (confirmed) {
      dispatch(deleteProject(proj._id))
        .unwrap()
        .then((res) => {
          if (res.status === "Success") {
            setNotification({
              status: "success",
              title: "Successfully Deleted!",
              content: res.message,
              open: true,
              icon: "check",
            });
          } else {
            setNotification({
              status: "error",
              title: "Error in Delete!",
              content: res.message,
              open: true,
              icon: "close",
            });
          }
        });
    }
  };
  const rows = projectData?.map((item) => ({ ...item })) || [];
  for (var i = 0; i < rows.length; i++) {
    const proj = projectData[i];
    rows[i].action = (
      <MDBox display="flex" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
        <MDTypography onClick={() => editItem(proj)}>
          <MDButton
            style={{ paddingRight: "0" }}
            variant="text"
            color={darkMode ? "white" : "dark"}
          >
            <Icon>edit</Icon>&nbsp;
          </MDButton>
        </MDTypography>
        <MDTypography onClick={(ev) => deleteItem(ev, proj)}>
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
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Project
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

export default Projects;
