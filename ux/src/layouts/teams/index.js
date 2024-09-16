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
import { useNavigate } from "react-router-dom";
import teamsTableData from "layouts/tables/data/teamsTableData";
import { CircularProgress, Icon } from "@mui/material";
import { useEffect, useState } from "react";
import MDSnackbar from "components/MDSnackbar";
import useConfirm from "components/useConfirm";
import MDButton from "components/MDButton";
import "./Team.css";
import NavigateHRef from 'constants/navigatehref';

function Teams() {
  const { columns } = teamsTableData();
  const [data, setData] = useState([]);
  const [isLoading , setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ title: '',content:'', open: false });
  const closeNotification = () => setNotification({ title: '',content:'', open: false });
  const { isConfirmed } = useConfirm();
  const Func = () => {
    setIsLoading(true);
    fetch('http://localhost:8080/api/team').then(res => res.json()).then(res => {
      setData(res.data);
      setIsLoading(false);
    })
  }
  useEffect(() => {
    Func();
  }, [])

  const navigate = useNavigate();
  const nav = () => {
    navigate(NavigateHRef[2].TeamEntry)
  }
  const editItem = (ev, id) => {
    ev.preventDefault();
    navigate(`${NavigateHRef[2].TeamEntry}/${id}`);
  }
  const deleteteam = async (ev, id, name) => {
    ev.preventDefault();
    const confirmed = await isConfirmed(`Are you sure? You want to delete Team '${name}'.`);
    if (confirmed) {
      fetch(`http://localhost:8080/api/team/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.message === "Success") {
            setNotification({ title:'Deleted!!',content: `Team ${name} is deleted successfully.`, open: true })
            Func();
          }
          else {
            console.log("Data Not Deleted");
          }
        });

    }

  }

  const rows = data || [];
  for (var i = 0; i < rows.length; i++) {
    let id = rows[i].name;
    let id1 = rows[i]._id;
    rows[i].action =  <>
    <MDButton variant="text" color="dark"onClick={(ev) => editItem(ev,id)}style={{ paddingRight:"0px" }}>
            <Icon>edit</Icon>
          </MDButton>
    <MDButton variant="text" color="error" style={{ paddingLeft:"0px" }}onClick={(ev) =>  deleteteam(ev, id1, id)}>
              <Icon>delete</Icon>
            </MDButton></>
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
                  Teams
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

export default Teams;