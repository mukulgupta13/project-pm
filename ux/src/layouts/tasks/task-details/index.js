// @mui material components
import Card from "@mui/material/Card";


// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


// Authentication layout components

// Images
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { CircularProgress, Grid } from "@mui/material";
import Footer from "examples/Footer";
import MDSnackbar from "components/MDSnackbar";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchTask, saveTask, setCurrentTask, updateTask } from "slices/task.slice";
import { fetchProjects } from "slices/project.slice";
import NavigateHRef from "constants/navigatehref";
function TaskEntry() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { currentTask: taskData } = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);
  const [projectData, setProjectData] = useState([]);
  const [current, setCurrent] = useState(null);
  const [disable, setDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [notification, setNotification] = useState({ title: '', content: '', open: false, color: 'success' });
  const closeNotification = () => setNotification({ title: '', content: '', open: false, color: 'success' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const nav = () => {
    navigate(NavigateHRef[4].Tasks);
  }
  const back = () => {
    dispatch(setCurrentTask({}));
    navigate(NavigateHRef[4].Tasks);
  }
  
  const { id } = useParams();
  const loadProjects = (callback) => {
    if (projects.length === 0) {
      dispatch(fetchProjects()).unwrap().then((data) => {
        setProjectData(data);
        callback && callback(data);
      });
    } else {
      setProjectData(projects);
      callback && callback(projects);
    }
  }

  useEffect(() => {
    const loadTaskDetails = (id) => {
      setIsLoading(true);
      if (taskData._id) {
        reset(taskData);
        setIsLoading(false);
      } else {
        dispatch(fetchTask(id)).unwrap().then(() => setIsLoading(false)).catch(() => setIsLoading(false));
      }
    }
    loadProjects((data) => {
      if (id) {
        setDisable(true);
        setCurrent(id);

        loadTaskDetails(id, data);
      }
    });
  }, [id, `taskData`, reset, dispatch]);

  const save = (data) => {
    saveData(() => {
      setTimeout(nav, 1000);
    }, data);
  };

  const SaveAndContinue = (data) => {
    saveData(() => {
      reset();
    }, data);
  };
  const saveData = (cb, data) => {
    const data1 = { current };
    data = { ...data, ...data1 };
    if (isValid()) {
      setIsLoading(true);
      dispatch(current ? updateTask({ id: current, data }) : saveTask(data)).unwrap()
        .then(() => {
          setNotification({ title: "Saved!", content: "Task Saved Successfully", open: true, color: 'success' })
          cb && cb();
          setIsLoading(false);
        }).catch(() => setIsLoading(false))

    }
    else{
      setMessage("");
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
    ID: validation("ID", "ID"),
    title: validation("title", "Title"),
    description: validation("description", "Description"),
    project: validation("project", "Project"),
    status: validation("status", "Status"),
    efforts: validation("efforts", "Efforts"),
    importance: validation("importance", "Importance"),

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
                  Task Details
                </MDTypography>
              </MDBox>

              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <div style={{ color: "red", fontSize: "15px" }}>{message}</div>

                  <MDBox mb={2}>
                    <MDInput
                      type="number"
                      label="ID"
                      variant="standard"
                      fullWidth
                      {...register("ID", { required: true })}
                      {...rules.ID}
                      {...(!taskData._id || { InputLabelProps: { shrink: !!taskData.ID } })}
                    />
                  </MDBox>

                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Title"
                      variant="standard"
                      fullWidth
                      {...register("title", { required: true })}
                      {...rules.title}
                      {...(!taskData._id || { InputLabelProps: { shrink: !!taskData.title } })}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput type="text" label="Description" variant="standard" fullWidth
                      {...register("description")}
                      {...(!taskData._id || { InputLabelProps: { shrink: !!taskData.description } })}

                    />
                  </MDBox>

                  <MDBox mb={2} className={rules.project.error ? 'error-label' : ''}>
                    <label style={{ fontSize: "15px" }}>Project</label>
                    <select
                      {...register("project", { required: true })}
                    >
                      <option value=""></option>
                      {projectData.map(proj => <option key={proj._id} value={proj._id} style={{ fontSize: "15px" }}>{proj.name}</option>)}
                    </select>
                    <p>{rules.project.helperText}</p>
                  </MDBox>
                  <MDBox mb={2}>
                    <label style={{ fontSize: "15px" }}>Status</label>
                    <select style={{ fontSize: "15px" }}
                      {...register("status", { required: true })}
                    >
                      <option value=""></option>
                      <option style={{ fontSize: "15px" }} >Created</option>
                      <option style={{ fontSize: "15px" }}>UnAssigned</option>
                      <option style={{ fontSize: "15px" }}>Assigned</option>
                      <option style={{ fontSize: "15px" }}>Committed</option>
                      <option style={{ fontSize: "15px" }}>Fixed</option>
                      <option style={{ fontSize: "15px" }}>Close</option>
                      <option style={{ fontSize: "15px" }}>Completed</option>
                    </select>
                    <p className="error-label">{rules.status.helperText}</p>
                  </MDBox>
                  <MDBox mb={2}>
                  <label style={{ fontSize: "15px" }}>Efforts</label>
                    <select style={{ fontSize: "15px" }}
                      {...register("efforts", { required: true })}
                    >
                      <option value=""></option>
                      <option style={{ fontSize: "15px" }} >1</option>
                      <option style={{ fontSize: "15px" }}>2</option>
                      <option style={{ fontSize: "15px" }}>3</option>
                      <option style={{ fontSize: "15px" }}>4</option>
                      <option style={{ fontSize: "15px" }}>5</option>
                      <option style={{ fontSize: "15px" }}>6</option>
                      <option style={{ fontSize: "15px" }}>7</option>
                      <option style={{ fontSize: "15px" }}>8</option>
                      <option style={{ fontSize: "15px" }}>9</option>
                      <option style={{ fontSize: "15px" }}>10</option>
                    </select>
                    <p className="error-label">{rules.efforts.helperText}</p>
                  </MDBox>
                  <MDBox mb={2}>
                  <label style={{ fontSize: "15px" }}>Importance</label>
                    <select style={{ fontSize: "15px" }}
                      {...register("importance", { required: true })}
                    >
                      <option value=""></option>
                      <option style={{ fontSize: "15px" }} >1</option>
                      <option style={{ fontSize: "15px" }}>2</option>
                      <option style={{ fontSize: "15px" }}>3</option>
                      <option style={{ fontSize: "15px" }}>4</option>
                      <option style={{ fontSize: "15px" }}>5</option>
                      <option style={{ fontSize: "15px" }}>6</option>
                      <option style={{ fontSize: "15px" }}>7</option>
                      <option style={{ fontSize: "15px" }}>8</option>
                      <option style={{ fontSize: "15px" }}>9</option>
                      <option style={{ fontSize: "15px" }}>10</option>
                    </select>
                    <p className="error-label">{rules.importance.helperText}</p>
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

export default TaskEntry;
