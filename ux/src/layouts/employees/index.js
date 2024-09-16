import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import { useNavigate } from "react-router-dom";
import employeesTableData from "layouts/tables/data/employeesTableData";
import { Icon } from "@mui/material";
import { useEffect, useState } from "react";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";
import useConfirm from "components/useConfirm";
import MDSnackbar from "components/MDSnackbar";
import { fetchEmployees } from "slices/employee.slice";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentEmployee } from "slices/employee.slice";
import { deleteEmployee } from "slices/employee.slice";
import NavigateHRef from "constants/navigatehref";

function Employees() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const { columns } = employeesTableData();
  const { employees: employeeData } = useSelector((state) => state.employees);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const navigate = useNavigate();
  const nav = () => {
    navigate(NavigateHRef[1].EmployeeEntry);
  };

  const editItem = (emp) => {
    const data = emp;
    dispatch(setCurrentEmployee(data));
    navigate(`${NavigateHRef[1].EmployeeEntry}/${emp.firstname}`);
  };

  const [notification, setNotification] = useState({ title: "", open: false, content: '', status: 'success', icon: 'check' });
  const closeNotification = () => setNotification({ title: "", open: false, content: '', status: 'success', icon: 'check' });
  const { isConfirmed } = useConfirm();

  const deleteItem = async (ev, emp) => {
    ev.preventDefault();
    const confirmed = await isConfirmed(
      `Are you sure. You want to delete employee '${emp.firstname} ${emp.lastname}'.`
    );
    if (confirmed) {
      dispatch(deleteEmployee(emp._id)).unwrap()
        .then((res) => {
          if (res.status === "Success") {
            setNotification({ status: 'success', title: 'Successfully Deleted!', content: res.message, open: true, icon: 'check' });
          } else {
            setNotification({ status: 'error', title: 'Error in Delete!', content: res.message, open: true, icon: 'close' });
          }
        });
    }
  };

  const rows = employeeData?.map((item) => ({ ...item })) || [];
  for (var i = 0; i < rows.length; i++) {
    const emp = employeeData[i];
    rows[i].edit = (
      <MDBox display="flex" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
        <MDTypography onClick={() => editItem(emp)}>
          <MDButton
            style={{ paddingRight: "0" }}
            variant="text"
            color={darkMode ? "white" : "dark"}
          >
            <Icon>edit</Icon>&nbsp;
          </MDButton>
        </MDTypography>
        <MDTypography onClick={(ev) => deleteItem(ev, emp)}>
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
                  Employees
                </MDTypography>
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
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
          color={notification.status}
          icon={notification.icon}
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

export default Employees;
