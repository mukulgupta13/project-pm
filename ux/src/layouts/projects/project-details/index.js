import { Grid } from "@mui/material";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import DatePickerWithHeaderSelection from "components/DatePickerWithHeaderSelection";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDSnackbar from "components/MDSnackbar";
import MDTypography from "components/MDTypography";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchEmployees } from "slices/employee.slice";
import { fetchProject, saveProject, setCurrentProject, updateProject } from "slices/project.slice";
import ".././project.css";

function ProjectEntry() {
  const {
    control,
    watch,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const currentDate = new Date().toISOString().split('T')[0];
  const showStartDateLabel = watch("startDate", false);
  const showEndDateLabel = watch("endDate", false);
  const { currentProject: projData } = useSelector((state) => state.projects);
  const { employees } = useSelector((state) => state.employees);
  const [employeeDataFromDb, setEmployeeDataFromDb] = useState([]);
  // const [projData, setProjData] = useState({});
  const [current, setCurrent] = useState(null);
  const [disable, setDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [notification, setNotification] = useState({ title: '', content: '', open: false, color: 'success' });
  const closeNotification = () => setNotification({ title: '', content: '', open: false, color: 'success' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const nav = () => {
    navigate("/projects");
  }
  const back = () => {
    dispatch(setCurrentProject({}));
    navigate("/projects");
  }
  const { id } = useParams();
  const loadEmployees = (callback) => {
    if (employees.length === 0) {
      dispatch(fetchEmployees()).unwrap().then((data) => {
        setEmployeeDataFromDb(data);
        callback && callback(data);
      });
    } else {
      setEmployeeDataFromDb(employees);
      callback && callback(employees);
    }
  }

  useEffect(() => {
    const loadProjectDetails = (id) => {
      setIsLoading(true);
      if (projData._id) {
        reset(projData);
        setIsLoading(false);
      } else {
        dispatch(fetchProject(id)).unwrap().then(() => setIsLoading(false)).catch(() => setIsLoading(false));
      }
    }
    loadEmployees((data) => {
      if (id) {
        setDisable(true);
        setCurrent(id);

        loadProjectDetails(id, data);
      }
    });
  }, [id, `projData`, reset, dispatch]);

  const save = (data) => {
    saveData(() => {
      setTimeout(nav, 3000);
    }, data);
  };

  const SaveAndContinue = (data) => {
    saveData(() => {
      reset();
    }, data);
  };
  const saveData = (cb, data) => {
    // const data = { name, code,  owner, type, description, startDate, budget, endDate, status, skills, current };
    const data1 = { current };
    data = { ...data, ...data1 };
    if (isValid()) {
      setIsLoading(true);
      dispatch(current ? updateProject({ id: current, data }) : saveProject(data)).unwrap()
        .then(() => {
          setNotification({ title: "Saved!", content: "Project Saved Successfully", open: true, color: 'success' })
          cb && cb();
          setIsLoading(false);
        }).catch(() => setIsLoading(false))
    }
  };
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
    code: validation("code", "Code"),
    owner: validation("owner", "Owner"),
    type: validation("type", "Type"),
    startDate: validation("startDate", "startDate"),
    budget: validation("budget", "Budget"),
    status: validation("status", "Status"),
  };
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

      <MDBox py={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>

              <MDBox
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="success"
                mx={2}
                mt={-3}
                py={3}
                textAlign="center"
              >
                <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                  Project Details
                </MDTypography>
              </MDBox>

              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <div style={{ color: "red", fontSize: "15px" }}>{message}</div>
                  {/* <MDBox mb={2}>
                    <MDInput type="text" label="Name" variant="standard" fullWidth value={name} onChange={ev => setName(ev.target.value)} />
                  </MDBox> */}
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Name"
                      variant="standard"
                      fullWidth
                      {...register("name", { required: true })}
                      {...rules.name}
                      {...(!projData._id || { InputLabelProps: { shrink: !!projData.name } })}
                    />
                  </MDBox>
                  {/* <MDBox mb={2}>
                    <MDInput type="number" label="Code" variant="standard" fullWidth value={code} onChange={ev => setCode(ev.target.value)}/>
                  </MDBox> */}
                  <MDBox mb={2}>
                    <MDInput
                      type="number"
                      label="Code"
                      variant="standard"
                      fullWidth
                      {...register("code", { required: true })}
                      {...rules.code}
                      {...(!projData._id || { InputLabelProps: { shrink: !!projData.code } })}
                    />
                  </MDBox>

                  <MDBox mb={2} className={rules.owner.error ? 'error-label' : ''}>
                    <label style={{ fontSize: "15px" }}>Owner</label>
                    <select
                      {...register("owner", { required: true })}
                    >
                      <option value=""></option>
                      {employeeDataFromDb.map(emp => <option key={emp._id} value={emp._id} style={{ fontSize: "15px" }}>{emp.firstname} {emp.lastname}</option>)}
                    </select>
                    <p>{rules.owner.helperText}</p>
                  </MDBox>
                  <MDBox mb={2} className={rules.type.error ? 'error-label' : ''}>
                    <label style={{ fontSize: "15px" }}>Type</label>
                    <select
                      // value={type} defaultValue ="default"onChange={ev => setType(ev.target.value)}
                      {...register("type", { required: true })}
                      style={{ fontSize: "15px" }}>
                      <option value=""></option>
                      <option style={{ fontSize: "15px" }}>Hourly Basis</option>
                      <option style={{ fontSize: "15px" }}>Trunky</option>
                      <option style={{ fontSize: "15px" }}>Retainer</option>
                    </select>
                    <p className="error-label">{rules.type.helperText}</p>
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput type="text" label="Short Description" variant="standard" fullWidth
                      {...register("description")}
                      {...(!projData._id || { InputLabelProps: { shrink: !!projData.description } })}

                    />
                  </MDBox>
                  {/* <MDBox mb={2}>
                    <MDInput type="date" label="Start Date" defaultValue={currentDate} variant="standard" fullWidth value={startDate} onChange={ev => setStartDate(ev.target.value)}/>
                  </MDBox> */}
                  <MDBox mb={2}>
                    {showStartDateLabel && <label className="label" >Start Date</label>}
                    <Controller
                      control={control}
                      name="startDate"
                      render={({ field }) => (
                        <DatePickerWithHeaderSelection
                          field={field}
                          placeholderText="Select Start Date"
                        />
                      )}
                    />
                    <p className="MuiFormHelperText-root MuiFormHelperText-sizeMedium css-p6upx4-MuiFormHelperText-root" id="mui-5-helper-text" style={{ color: "red" }}>{rules.startDate.helperText}</p>
                  </MDBox>

                  {/* <MDBox mb={2}>
                    <MDInput type="number" label="Budget" variant="standard" fullWidth value={budget} onChange={ev => setBudget(ev.target.value)}/>
                  </MDBox> */}
                  <MDBox mb={2}>
                    <MDInput
                      type="number"
                      label="Budget"
                      variant="standard"
                      fullWidth
                      {...register("budget", { required: true })}
                      {...rules.budget}
                      {...(!projData._id || { InputLabelProps: { shrink: !!projData.budget } })}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    {showEndDateLabel && <label className="label" >End Date</label>}
                    <Controller
                      control={control}
                      name="endDate"
                      render={({ field }) => (
                        <DatePickerWithHeaderSelection
                          field={field}
                          placeholderText="Select End Date"
                        />
                      )}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <label style={{ fontSize: "15px" }}>Status</label>
                    <select style={{ fontSize: "15px" }}
                      {...register("status", { required: true })}
                    >
                      <option value=""></option>
                      <option style={{ fontSize: "15px" }} >Not Started</option>
                      <option style={{ fontSize: "15px" }}>Started</option>
                      <option style={{ fontSize: "15px" }}>Completed</option>
                      <option style={{ fontSize: "15px" }}>On Hold</option>
                      <option style={{ fontSize: "15px" }}>Closed</option>
                    </select>
                    <p className="error-label">{rules.status.helperText}</p>
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput type="text" label="Skills" variant="standard" fullWidth
                      {...register("skills")}
                      {...(!projData._id || { InputLabelProps: { shrink: !!projData.skills } })}

                    />
                  </MDBox>
                  <MDBox display="flex" alignItems="center" ml={-1}>
                    <Checkbox />
                    <MDTypography
                      variant="button"
                      fontWeight="regular"
                      color="text"
                      sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                    >
                      &nbsp;&nbsp;Is active&nbsp;
                    </MDTypography>
                  </MDBox>
                  <MDBox mt={4} mb={1} fullWidth>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={12} lg={12} className="buttons-team-details" >
                        <MDButton variant="gradient" disabled={disable} color="success" onClick={handleSubmit(SaveAndContinue)}>
                          Save and Continue
                        </MDButton>

                        <MDButton variant="gradient" color="info" onClick={handleSubmit(save)}>
                          Save
                        </MDButton>

                        <MDButton variant="gradient" color="error" onClick={back}>
                          Cancel
                        </MDButton>
                      </Grid>
                    </Grid>
                  </MDBox>

                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
        {renderSuccessSB}
      </MDBox>
  );
}

export default ProjectEntry;
