

import { useState } from "react";


// react-router-dom components
import { Link, useParams } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import validator from 'validator'
// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { useForm } from "react-hook-form";

function SignIn() {
  const {
    control,
    watch,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
 
  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const [emailError, setEmailError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
 
  const validate = (value) => {
 return true;
    // if (validator.isStrongPassword(value, {
    //   minLength: 8, minLowercase: 1,
    //   minUppercase: 1, minNumbers: 1, minSymbols: 1
    // })) {
    //   setErrorMessage('');
    //   return true;
    // } else {
    //   setErrorMessage('Not Strong Password')
    // }
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
  const id = useParams();
  const logIn = (data) => {
    // const data = { email, password };
    if(isValid()){
    if (id) {
      fetch("http://localhost:8080/api/account/signin", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.message == "Successfully Signin") {
    
            localStorage.setItem('token', res.data.token);
            window.location.href = "/dashboard";
          }
        });
    }
  }
   else {
      setMessage("Please check your data before submission.");
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
  };
  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          {/* <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid> */}
        </MDBox>
        {message}
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              {/* <MDInput type="email" label="Email" fullWidth  onChange={(e) => validateEmail(e)}
              /> */}
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
              {/* <MDInput type="password" label="Password" fullWidth onChange={(e) => validate(e.target.value)} /> */}
                      
              <MDInput
                   type="password"
                   label="Password"
                   variant="standard"
                   fullWidth
                   {...register("password", { required: true})}
                   //{...rules.password}
                   onChange={(e) => validate(e.target.value)}   
                    />
              {errorMessage === '' ? null :
        <span style={{
          fontSize:'0.75rem',
          color: 'red',
        }}>{errorMessage}</span>}
            </MDBox>
            {/* <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox> */}
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick = {handleSubmit(logIn)}>
                sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default SignIn;
