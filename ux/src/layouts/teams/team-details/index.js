import { Card, CircularProgress, Grid, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ".././Team.css";
import { useParams } from "react-router-dom";
import MDSnackbar from "components/MDSnackbar";
import { useNavigate } from "react-router-dom";
import NavigateHRef from "constants/navigatehref";

function TeamEntry() {
  const [employeeDataFromDb, setEmployeeDataFromDb] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [current, setCurrent] = useState(null);
  const [teamData, setTeamData] = useState({});
  const [disable, setDisable] = useState(false);
  const [message, setMessage] = useState("");


  // const { register, handleSubmit, reset: resetData } = useForm();

  const [notification, setNotification] = useState({ title: '', content: '', open: false });
  const closeNotification = () => setNotification({ title: '', content: '', open: false });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const nav = () => {
    navigate(NavigateHRef[2].Teams)
  }
  // const leftChecked = intersection(checked, left);
  // const rightChecked = intersection(checked, right);
  const handleMoveAllToAssigned = () => {
    setEmployees([]);
    setTeamMembers([...employeeDataFromDb]);
  };

  const handleRemoveAllFromAssigned = () => {
    setEmployees([...employeeDataFromDb]);
    setTeamMembers([]);
  };
  const moveToTeamMembers = () => {
    if (selectedEmployees) {
      setEmployees((data) => data.filter((x) => selectedEmployees.indexOf(x._id) === -1));
      setTeamMembers((data) => (data || []).concat(employeeDataFromDb.filter((x) => selectedEmployees.indexOf(x._id) !== -1)));
      setSelectedEmployees([]);
    }
  };

  const moveToEmployees = () => {
    if (selectedTeamMembers) {
      setTeamMembers((data) => data.filter((x) => selectedTeamMembers.indexOf(x._id) === -1));
      setEmployees((data) => (data || []).concat(employeeDataFromDb.filter((x) => selectedTeamMembers.indexOf(x._id) !== -1)));
      setSelectedTeamMembers([]);
    }
  };
  const { id } = useParams();

  const loadEmployees = (callback) => {
    fetch('http://localhost:8080/api/employee').then(res => res.json()).then(res => {
      setEmployeeDataFromDb(res.data);
      setEmployees(res.data);
      callback && callback(res.data);
    })
  }

  useEffect(() => {
    const loadTeamDetails = (id, empData) => {
      setIsLoading(true);
      fetch("http://localhost:8080/api/team/" + id)
        .then((res) => res.json())
        .then((res) => {
          if (res.message === "Success") {
            const data = res.data;
            reset(data); setTeamData(data);
            setTeamMembers(empData.filter((x) => data.members.map(m => m).indexOf(x._id) !== -1));
            setEmployees(empData.filter((x) => data.members.map(m => m).indexOf(x._id) === -1));
          }
          setIsLoading(false);
        }).catch(() => setIsLoading(false));
    }

    loadEmployees((data) => {
      if (id) {
        setDisable(true);
        setCurrent(id);
        loadTeamDetails(id, data);
      }
    });
  }, [id, reset])

  const saveandcontinue = (data) => {
    saveTeamData(() => {
      reset();
    }, data);
  }

  const saveData = (data) => {
    saveTeamData(() => {
      setTimeout(nav, 3000);
    }, data);
  }
  const saveTeamData = (cb, data) => {
    // const data = {
    //   // name, description: teamDescription,
    //   // owner: selectedOwner,
    //   members: teamMembers.map(t => t._id), current
    // };
    const data2 = { current, members: teamMembers.map(t => t._id) };
    data = { ...data, ...data2 };
    if (isValid()) {
      fetch("http://localhost:8080/api/team" + (current ? '/' + current : ''), {
        method: current ? "PUT" : "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.message === "Success") {
            setNotification({ title: "Saved", content: "Team Saved Successfully", open: true })
            cb && cb();
          } else {
            setMessage("Team Already Exist");
          }
        });
    }
  }
  const isValid = () => {
    // setMessage("");
    return !errors.length;
  };

  const validation = (fieldName, label) => {
    return {
      error: !!errors[fieldName],
      helperText: (() => {
        switch (errors[fieldName]?.type) {
          case "required":
            return `${label} is required`;
          case "pattern":
          case "maxlength":
          case "minLength":
            return `${label} is invalid.`;
          default:
            return "";
        }
      })(),
    };
  };
  const rules = {
    name: validation("name", "Name"),
    code: validation("description", "Description"),
    owner: validation("owner", "Owner"),
  };
  // const reset = () => {
  //   setName('');
  //   setTeamDescription('');
  //   setSelectedOwner('');
  //   setSelectedEmployees('');
  //   // setMessage('');
  // }

  const handleSelect = (e) => {
    var options = e.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    return value;
  }
  const handleEmployeeSelect = (e) => {
    setSelectedEmployees(handleSelect(e));
  }
  const handleTeamMemberSelect = (e) => {
    setSelectedTeamMembers(handleSelect(e));
  }

  const renderSuccessSB = (
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
  );




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
                  Team

                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <div style={{ color: "red", fontSize: "15px" }}>{message}</div>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Name"
                      variant="standard"
                      fullWidth
                      {...register("name", { required: true })}
                      {...rules.name}
                      {...(!teamData._id || { InputLabelProps: { shrink: !!teamData.name } })}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Description"
                      variant="standard"
                      fullWidth
                      {...register("description")}

                      {...(!teamData._id || { InputLabelProps: { shrink: !!teamData.description } })}
                    />
                  </MDBox>
                  <MDBox mb={2} className={rules.owner.error ? 'error-label' : ''}>
                    <label style={{ fontSize: "15px" }}>Owner</label>
                    <select {...register("owner", { required: true })}>
                      <option value="">Choose Owner</option>
                      {employeeDataFromDb.map(emp => <option key={emp._id} value={emp._id}>{emp.firstname} {emp.lastname}</option>)}
                    </select>
                    <p className="MuiFormHelperText-root MuiFormHelperText-sizeMedium css-p6upx4-MuiFormHelperText-root">{rules.owner.helperText}</p>

                  </MDBox>


                  <MDBox mt={4} mb={1}>
                    <div className="assignment-list">
                      <div className="employee-list">
                        <label>Employees </label>
                        <select multiple id="select" value={selectedEmployees} onChange={handleEmployeeSelect}>
                          {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.firstname} {emp.lastname}</option>)}
                        </select>
                      </div>
                      <div className="button-area">
                        <MDBox mt={4} mb={1}>
                          <MDButton variant="gradient" color="info" onClick={handleMoveAllToAssigned}>

                            <Icon>keyboard_double_arrow_right</Icon>
                          </MDButton>
                        </MDBox>
                        <MDBox mt={2} mb={1}>

                          <MDButton variant="gradient" color="info" onClick={moveToTeamMembers}>
                            <Icon>keyboard_arrow_right</Icon>
                          </MDButton>
                        </MDBox>
                        <MDBox mt={2} mb={1}>
                          <MDButton variant="gradient" color="info" onClick={moveToEmployees}>
                            <Icon>keyboard_arrow_left</Icon>
                          </MDButton>
                        </MDBox>
                        <MDBox mt={2} mb={1}>
                          <MDButton variant="gradient" color="info" onClick={handleRemoveAllFromAssigned}>
                            <Icon>keyboard_double_arrow_left</Icon>
                          </MDButton>
                        </MDBox>
                      </div>
                      <div className="team-assignment-list">
                        <label>Assigned to Team </label>
                        <select multiple id="select" value={selectedTeamMembers} onChange={handleTeamMemberSelect}>
                          {teamMembers.map(emp => <option key={emp._id} value={emp._id}>{emp.firstname} {emp.lastname}</option>)}
                        </select>
                      </div>
                    </div>
                  </MDBox>
                  <MDBox mt={4} mb={1} fullWidth>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={12} lg={12} className="buttons-team-details" >
                        <MDButton variant="gradient" disabled={disable} color="success" onClick={handleSubmit(saveandcontinue)}>
                          SAVE & CONTIUE
                        </MDButton>

                        <MDButton variant="gradient" color="info" onClick={handleSubmit(saveData)}>
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

            </Card>
          </Grid></Grid>
        {renderSuccessSB}

      </MDBox>
  );
}
export default TeamEntry;