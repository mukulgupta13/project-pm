

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import validator from 'validator'

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import { useForm } from "react-hook-form";
import { useState } from "react";


function Cover() {
  const {
    control,
    watch,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [firstName , setFirstName] = useState('');
  const [lastName , setLastName] = useState('');
  const [phoneNumber , setPhoneNumber] = useState('');
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");
  const [emailError, setEmailError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [detail , setDetail] = useState([]);
  const [message , setMessage] = useState('');
  const validate = (value) => {
 
    if (validator.isStrongPassword(value, {
      minLength: 8, minLowercase: 1,
      minUppercase: 1, minNumbers: 1, minSymbols: 1
    })) {
      setErrorMessage('');
      return true;
    } else {
      setErrorMessage('Not Strong Password')
    }
  }
  const validateEmail = (e) => {
    var email = e.target.value
  
    if (validator.isEmail(email)) {
      setEmailError('');
      return true;
    } else {
      setEmailError('Enter valid Email!')
    }
  }
  const save = () => {
    const data = {firstName,lastName,phoneNumber, email, password};
    if (isValid()) {
        fetch("http://localhost:8080/admin/signup", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.message == "Success") {
                    detail.push(res.data);
                    setDetail([...detail]);
                   
                }
                reset();
            });
    }
    else {
        setMessage("");
    }
}
  const isValid = () => {
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
    email: validation("email", "Email"),
    password: validation("password", "Password"),
    phoneNumber: validation("phoneNumber","Phone Number"),
    firstName: validation("firstName","first Name"),
    lastName: validation("lastName","last Name"),
  };
  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email and password to register
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}> 
              {/* <MDInput type="text" label="first Name" variant="standard" fullWidth /> */}
              <MDInput
                      type="text"
                      label="first Name"
                      variant="standard"
                      fullWidth
                      {...register("firstName", { required: true})}
                      {...rules.firstName}
                      />
            </MDBox>
            <MDBox mb={2}> 
              {/* <MDInput type="text" label="last Name" variant="standard" fullWidth /> */}
              <MDInput
                      type="text"
                      label="last Name"
                      variant="standard"
                      fullWidth
                      {...register("lastName", { required: true})}
                      {...rules.lastName}
                      />
            </MDBox>
            <MDBox mb={2}> 
            
              {/* <MDInput type="number" label="Phone Number" variant="standard" fullWidth /> */}
              <MDInput
                      type="number"
                      label="Phone Number"
                      variant="standard"
                      fullWidth
                      {...register("phoneNumber", { required: true , maxLength: 10, minLength:10})}
                      {...rules.phoneNumber}
                      />
            </MDBox>
            <MDBox mb={2}>
              {/* <MDInput type="email" label="Email" variant="standard" fullWidth /> */}
              <MDInput
                      type="email"
                      label="Email"
                      variant="standard"
                      fullWidth
                      {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                      {...rules.email}
                      onChange={(e) => validateEmail(e)}/>
                       <span style={{
          fontSize:'0.75rem',
          color: 'red',
        }}>{emailError}</span>
            </MDBox>
            <MDBox mb={2}>
              {/* <MDInput type="password" label="Password" variant="standard" fullWidth /> */}
              <MDInput
                   type="password"
                   label="Password"
                   variant="standard"
                   fullWidth
                   {...register("password", { required: true})}
                   {...rules.password}
                   onChange={(e) => validate(e.target.value)}   
                    />
              {errorMessage === '' ? null :
        <span style={{
          fontSize:'0.75rem',
          color: 'red',
        }}>{errorMessage}</span>}
            </MDBox>
            
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick = {handleSubmit(save)}>
                sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
