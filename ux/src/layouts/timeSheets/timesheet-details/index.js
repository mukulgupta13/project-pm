import { useEffect, useState } from "react";
import { CircularProgress, Grid } from "@mui/material";
import Card from "@mui/material/Card";
import DatePickerWithHeaderSelection from "components/DatePickerWithHeaderSelection";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDSnackbar from "components/MDSnackbar";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchTimesheet,
  saveTimesheet,
  setCurrentTimesheet,
  updateTimesheet,
} from "slices/timesheet.slice";
import { fetchEmployees } from "slices/employee.slice";
import { fetchTasks } from "slices/task.slice";
import NavigateHRef from "constants/navigatehref";
//import "./style.css";

function TimeSheetEntry() {
  const { currentTimesheet: timeSheetData } = useSelector((state) => state.timesheets);
  const {
    control,
    watch,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const showDOBLabel = watch("date", false);
  const { employees } = useSelector((state) => state.employees);
  const [employeeDataFromDb, setEmployeeDataFromDb] = useState([]);
  const { tasks } = useSelector((state) => state.tasks);
  const [taskDataFromDb, setTaskDataFromDb] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [current, setCurrent] = useState(null);
  const [disable, setDisable] = useState(false);
  const [notification, setNotification] = useState({
    title: "",
    content: "",
    open: false,
    color: "success",
  });
  const closeNotification = () =>
    setNotification({ title: "", content: "", open: false, color: "success" });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const nav = () => {
    navigate(NavigateHRef[5].TimeSheets);
  };
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
  const loadTasks = (callback) => {
    if (tasks.length === 0) {
      dispatch(fetchTasks()).unwrap().then((data) => {
        setTaskDataFromDb(data);
        callback && callback(data);
      });
    } else {
      setTaskDataFromDb(tasks);
      callback && callback(tasks);
    }
  }
  useEffect(() => {
    const loadTimesheetDetails = (id) => {
      setIsLoading(true)
      if (timeSheetData._id) {
        reset(timeSheetData);
        setIsLoading(false);
      } else {
        
        dispatch(fetchTimesheet(id))
          .unwrap()
          .then(() => setIsLoading(false))
          .catch(() => setIsLoading(false));
      }
    }
    loadEmployees((data) => {
      if (id)
 {
        setDisable(true);
        setCurrent(id)
;

        loadTimesheetDetails(id, data);
      }
    });
    loadTasks((data) => {
      if (id)
 {
        setDisable(true);
        setCurrent(id)
;

        loadTimesheetDetails(id, data);
      }
    });
  }, [id, `timeSheetData`, reset, dispatch]);
  
 // useEffect(() => {
    // fetch('http://localhost:8080/api/employee').then(res => res.json()).then(res => {
    //   setEmployeeDataFromDb(res.data);
    //   console.log(employeeDataFromDb,)
    //    //setEmployees(res.data);
    //    callback && callback(res.data); 
    // })
 // },[]);
  
  const timesheetsave = (cb, data) => {
    const data2 = { current };
    data = { ...data, ...data2 };

    if (isValid()) {
      setIsLoading(true);
      dispatch(current ? updateTimesheet({ id: current, data }) : saveTimesheet(data))
        .unwrap()
        .then(() => {
          setNotification({
            title: "Saved!",
            content: "Timesheet Saved Successfully",
            open: true,
            color: "success",
          });
          cb && cb();
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  };

  const onSave = (data) => {
    timesheetsave(() => {
      setTimeout(nav, 3000);
    }, data);
  };

  const onSaveAndContinue = (data) => {
    timesheetsave(() => {
      reset();
    }, data);
  };
  const back = () => {
    dispatch(setCurrentTimesheet({}));
    navigate(NavigateHRef[5].TimeSheets);
  };

  const isValid = () => {
    setMessage("");
    return !errors.length;
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

  const validation = (fieldName, label) => {
    return {
      error: !!errors[fieldName],
      helperText: (() => {
        switch (errors[fieldName]?.type) {
          case "required":
            return `${label} is required`;
          case "pattern":
          case "maxLength":
          case "minLength":
            return `${label} is invalid.`;
          default:
            return "";
        }
      })(),
    };
  };
  
  const rules = {
   date: validation("date" , "Date" ),
   task: validation("task" ,"Task"),
   starttime: validation("starttime", "Start Time"),
   status: validation("status", "Status"),
   endtime: validation("endtime","End Time"),
   duration: validation("duration", "Duration"),
   employee: validation("employee", "Employee")
  };
  //console.log(errors);
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
                  Time Sheet  Details !!
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
              <MDBox mb={2} className={rules.task.error ? 'error-label' : ''}>
                    <label style={{ fontSize: "15px" }}> Task </label>
                    <select
                      {...register("task", { required: true })}
                    >
                      <option value=""></option>
                      {taskDataFromDb.map(tsk => <option key={tsk._id} value={tsk._id} style={{ fontSize: "15px" }}>{tsk.title}</option>)}
                    </select>
                    <p>{rules.task.helperText}</p>
                  </MDBox>
                <MDBox component="form" role="form">
                  <MDBox mb={2}>{message}</MDBox>
                  <MDBox mb={2}>
                    {showDOBLabel && <label className="label">Date </label>}
                    <Controller
                      control={control}
                      name="date"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <DatePickerWithHeaderSelection
                          field={field}
                          placeholderText="Select date"
                        />
                      )}
                    />
                    <p
                      className="MuiFormHelperText-root MuiFormHelperText-sizeMedium css-p6upx4-MuiFormHelperText-root"
                      id="mui-5-helper-text"
                      style={{ color: "red" }}
                    >
                      {rules.date.helperText}
                    </p>
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="time"
                      label="Start Time"
                      variant="standard"
                      fullWidth
                      {...register("starttime", { required: true})}
                      {...rules.starttime}
                      //{...(!timeSheetData._id || { InputLabelProps: { shrink: !!timeSheetData.starttime } })}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="time"
                      label="End Time"
                      variant="standard"
                      fullWidth
                      {...register("endtime")}
                      {...rules.endtime}
                      //{...(!timeSheetData._id || { InputLabelProps: { shrink: !!timeSheetData.endline } })}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Duration"
                      variant="standard"
                      fullWidth
                      {...register("duration")}
                      {...rules.duration}
                      //{...(!timeSheetData._id || { InputLabelProps: { shrink: !!timeSheetData.duration } })}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <label style={{ fontSize: "15px" }}>Status</label>
                    <select style={{ fontSize: "15px" }}
                      {...register("status", { required: true })}
                    >
                      <option value=""></option>
                      <option style={{ fontSize: "15px" }} >Approved</option>
                      <option style={{ fontSize: "15px" }}>Created</option>
                    </select>
                    <p className="error-label">{rules.status.helperText}</p>
                  </MDBox>
                  <MDBox mb={2} className={rules.employee.error ? 'error-label' : ''}>
                    <label style={{ fontSize: "15px" }}>Employee </label>
                    <select
                      {...register("employee", { required: true })}
                    >
                      <option value=""></option>
                      {employeeDataFromDb.map(emp => <option key={emp._id} value={emp._id} style={{ fontSize: "15px" }}>{emp.firstname} {emp.lastname}</option>)}
                    </select>
                    <p>{rules.employee.helperText}</p>
                  </MDBox>
                  <MDBox mt={4} mb={1} fullWidth>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={12} lg={12} className="buttons-team-details">
                        <MDButton
                          variant="gradient"
                          disabled={disable}
                          color="success"
                          onClick={handleSubmit(onSaveAndContinue)}
                        >
                          save & continue
                        </MDButton>

                        <MDButton variant="gradient" color="info" onClick={handleSubmit(onSave)}>
                          save
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

export default TimeSheetEntry;
