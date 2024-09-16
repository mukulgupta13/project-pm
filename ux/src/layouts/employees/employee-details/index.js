import { CircularProgress, Grid } from "@mui/material";
import Card from "@mui/material/Card";
import DatePickerWithHeaderSelection from "components/DatePickerWithHeaderSelection";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDSnackbar from "components/MDSnackbar";
import MDTypography from "components/MDTypography";
import NavigateHRef from "constants/navigatehref";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchEmployee,
  saveEmployee,
  setCurrentEmployee,
  updateEmployee,
} from "slices/employee.slice";
import "./style.css";

function EmployeeEntry() {
  const { currentEmployee: empData } = useSelector((state) => state.employees);
  const {
    control,
    watch,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const showDOBLabel = watch("dob", false);
  const showDOMLabel = watch("dom", false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [current, setCurrent] = useState(null);
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
    navigate(NavigateHRef[1].Employees);
  };
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      setCurrent(id);
      if (empData._id) {
        reset(empData);
      } else {
        setIsLoading(true);
        dispatch(fetchEmployee(id))
          .unwrap()
          .then(() => setIsLoading(false))
          .catch(() => setIsLoading(false));
      }
    }
  }, [id, empData, reset, dispatch]);
  const employeesave = (cb, data) => {
    const data2 = { current };
    data = { ...data, ...data2 };

    if (isValid()) {
      setIsLoading(true);
      dispatch(current ? updateEmployee({ id: current, data }) : saveEmployee(data))
        .unwrap()
        .then(() => {
          setNotification({
            title: "Saved!",
            content: "Employee Saved Successfully",
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
    employeesave(() => {
      setTimeout(nav, 3000);
    }, data);
  };

  const onSaveAndContinue = (data) => {
    employeesave(() => {
      reset();
    }, data);
  };
  const back = () => {
    dispatch(setCurrentEmployee({}));
    navigate(NavigateHRef[1].Employees);
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
    firstname: validation("firstname", "First Name"),
    lastname: validation("lastname", "Last Name"),
    email: validation("email", "Email"),
    phonenumber: validation("phonenumber", "Phone Number"),
    dob: validation("dob", "Date of Birth"),
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
                  Employee Details !!
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <MDBox mb={2}>{message}</MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="First Name"
                      variant="standard"
                      fullWidth
                      {...register("firstname", { required: true })}
                      {...rules.firstname}
                      {...(!empData._id || { InputLabelProps: { shrink: !!empData.firstname } })}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Last Name"
                      variant="standard"
                      fullWidth
                      {...register("lastname", { required: true })}
                      {...rules.lastname}
                      {...(!empData._id || { InputLabelProps: { shrink: !!empData.lastname } })}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="email"
                      label="Email"
                      variant="standard"
                      fullWidth
                      {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                      {...rules.email}
                      {...(!empData._id || { InputLabelProps: { shrink: !!empData.email } })}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="number"
                      label="Phone No."
                      variant="standard"
                      fullWidth
                      maxLength="10"
                      {...register("phonenumber", { required: true, maxLength: 10, minLength: 10 })}
                      {...rules.phonenumber}
                      {...(!empData._id || { InputLabelProps: { shrink: !!empData.phonenumber } })}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    {showDOBLabel && <label className="label">Date of Birth</label>}
                    <Controller
                      control={control}
                      name="dob"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <DatePickerWithHeaderSelection
                          field={field}
                          placeholderText="Select date of birth"
                        />
                      )}
                    />
                    <p
                      className="MuiFormHelperText-root MuiFormHelperText-sizeMedium css-p6upx4-MuiFormHelperText-root"
                      id="mui-5-helper-text"
                      style={{ color: "red" }}
                    >
                      {rules.dob.helperText}
                    </p>
                  </MDBox>
                  <MDBox mb={2}>
                    {showDOMLabel && <label className="label">Date of Marriage</label>}
                    <Controller
                      control={control}
                      name="dom"
                      render={({ field }) => (
                        <DatePickerWithHeaderSelection
                          field={field}
                          placeholderText="Select date of Marriage"
                        />
                      )}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Address Line 1"
                      variant="standard"
                      fullWidth
                      {...register("addressline1")}
                      {...(!empData._id || { InputLabelProps: { shrink: !!empData.addressline1 } })}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Address Line 2"
                      variant="standard"
                      fullWidth
                      {...register("addressline2")}
                      {...(!empData._id || { InputLabelProps: { shrink: !!empData.addressline2 } })}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="City"
                      variant="standard"
                      fullWidth
                      {...register("city")}
                      {...(!empData._id || { InputLabelProps: { shrink: !!empData.city } })}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="State"
                      variant="standard"
                      fullWidth
                      {...register("state")}
                      {...(!empData._id || { InputLabelProps: { shrink: !!empData.state } })}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="number"
                      label="Pin Code"
                      variant="standard"
                      fullWidth
                      {...register("pincode")}
                      {...(!empData._id || { InputLabelProps: { shrink: !!empData.pincode } })}
                    />
                  </MDBox>
                  <MDBox mt={4} mb={1} fullWidth>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={12} lg={12} className="buttons-team-details">
                        <MDButton
                          variant="gradient"
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

export default EmployeeEntry;
