import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
// import MDButton from "components/MDButton";
import DataTable from "examples/Tables/DataTable";
import { useNavigate } from "react-router-dom";
import timesheetsTableData from "layouts/tables/data/timesheetsTableData";
import { CircularProgress, Icon } from "@mui/material";
import { useEffect, useState } from "react";
import useConfirm from "components/useConfirm";
import MDSnackbar from "components/MDSnackbar";
import MDButton from "components/MDButton";
import "./timesheet.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchTimesheets } from "slices/timesheet.slice";
import { useMaterialUIController } from "context";
// import  from "slices/timesheet.slice"; 
import { deleteTimesheet, setCurrentTimesheet } from "slices/timesheet.slice";
import NavigateHRef from "constants/navigatehref";

function TimeSheets() {
  const { columns } = timesheetsTableData();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  // const [projectData, setProjectData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { timesheets: timesheetData } = useSelector((state) => state.timesheets)
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchTimesheets()).unwrap().then(x => setIsLoading(false)).catch(() => setIsLoading(false));
  }, [dispatch])
  const [notification, setNotification] = useState({ title: '', content: '', open: false, content: '', status: 'success', icon: 'check' });
  const closeNotification = () => setNotification({ title: '', content: '', open: false, content: '', status: 'success', icon: 'check' });
  const { isConfirmed } = useConfirm();
  const navigate = useNavigate();
  const nav = () => {
    navigate(NavigateHRef[5].TimeSheetEntry)
  }
  const editItem = (tms) => {
    const data = tms;
    dispatch(setCurrentTimesheet(data));
    navigate(`${NavigateHRef[5].TimeSheetEntry}/${tms.task}`);
  }
  const renew = async (ev, tms) => {
    ev.preventDefault();
    const confirmed = await isConfirmed(`Are you sure? You want to delete Timesheet '${tms._id}'.`);
    if (confirmed) {
      dispatch(deleteTimesheet(tms._id)).unwrap()
      .then((res) => {
        if(res.status === "Success"){
          setNotification({ status: 'success', title:'Successfully Deleted!', content: res.message, open: true, icon:'check'});
        } else{
          setNotification({ status: 'error', title: 'Error in Delete!', content: res.message, open: true, icon: 'close' });
        }
      });
    }     
  };
  const rows = timesheetData?.map((item) => ({ ...item })) || [];
  for (var i = 0; i < rows.length; i++) {
    const tms = timesheetData[i];
    rows[i].action =(
      <MDBox display="flex" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
        <MDTypography onClick={() => editItem(tms)}>
          <MDButton
            style={{ paddingRight: "0" }}
            variant="text"
            color={darkMode ? "white" : "dark"}
          >
            <Icon>edit</Icon>&nbsp;
          </MDButton>
        </MDTypography>
        <MDTypography onClick={(ev) => renew(ev, tms)}>
          <MDButton style={{ paddingLeft: "0" }} variant="text" color="error">
            <Icon>delete</Icon>&nbsp;
          </MDButton>
        </MDTypography>
      </MDBox>
    );
  }
    // rows[i].action = <>
    //   <MDButton variant="text" color="dark" onClick={(ev) => editItem(id)} style={{ paddingRight: "0px" }}>
    //     <Icon>edit</Icon>
    //   </MDButton>
    //   <MDButton variant="text" color="error" style={{ paddingLeft: "0px" }} onClick={(ev) => renew(ev, id1, id)}>
    //     <Icon>delete</Icon>
    //   </MDButton></>
    // rows[i].action = <MDTypography component="button" href="#" variant="caption" color="text" fontWeight="medium" onClick={() => editItem(id)}>
    //   Edit
    // </MDTypography>;
    //  rows[i].delete = <MDTypography component="button" href="#" variant="caption" color="text" fontWeight="medium" onClick = {evt => renew(id, evt)}>
    //   Delete
    // </MDTypography>;
  

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
                  Time Sheet
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

export default TimeSheets;
