import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import config from "../config";
const ApiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;
import { AppContext } from "../Context";



const Register = () => {
  const [inputFirstName, setInputFirstName] = useState("");
  const [inputLastName, setInputLastName] = useState("");
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputPassword2, setInputPassword2] = useState("");
  const [firstNameFeedback, setFirstNameFeedback] = useState("");
  const [lastNameFeedback, setLastNameFeedback] = useState("");
  const [usernameFeedback, setUsernameFeedback] = useState("");
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [failedFeedback, setFailedFeedback] = useState("");

  const nav = useNavigate();
  const context = useContext(AppContext);

  useEffect(() => {
    if (context.values.isLoggedIn === true) {
      window.alert("You are logged in! Redirecting to home page");
      nav(`/items/users/${context.values.user_id}`);
    }
  }, [context.values.isLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let error = false;

    setFirstNameFeedback("");
    setLastNameFeedback("");
    setUsernameFeedback("");
    setPasswordFeedback("");
    setFailedFeedback("");

    if (inputFirstName.length < 2) {
      setFirstNameFeedback("error: first name must be at least 2 characters\n");
      error = true;
    }
    if (inputLastName.length < 2) {
      setLastNameFeedback("error: last name must be at least 2 characters\n");
      error = true;
    }
    if (inputUsername.length < 3) {
      setUsernameFeedback("error: username must be at least 3 characters\n");
      error = true;
    }
    if (inputPassword.length < 4) {
      setPasswordFeedback("error: password must be at least 3 characters\n");
      error = true;
    }
    if (inputFirstName.length > 50) {
      setFirstNameFeedback(
        "error: first name must be less than 50 characters\n"
      );
      error = true;
    }
    if (inputLastName.length > 50) {
      setLastNameFeedback(
        "error: first name must be less than 50 characters\n"
      );
      error = true;
    }
    if (inputUsername.length > 50) {
      setUsernameFeedback(
        "error: first name must be less than 50 characters\n"
      );
      error = true;
    }
    if (inputPassword.length > 50) {
      setPasswordFeedback(
        "error: first name must be less than 50 characters\n"
      );
      error = true;
    }
    if (inputPassword !== inputPassword2) {
      setPasswordFeedback("error: passwords must match!\n");
      error = true;
    }
    if (!error) {
      let body = {
        first_name: inputFirstName,
        last_name: inputLastName,
        username: inputUsername,
        password: inputPassword,
      };

      let res = await fetch(`${ApiUrl}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      let newUser = await res.json();

      if (newUser.length > 0) {
        window.alert(
          "Your account has been created. You will now be logged in"
        );
        context.setters.setUser_id(newUser[0].user_id);
        context.setters.setIsLoggedIn(true);
      }
    }
  };

  return (
    <Background>
      <GridContainer>
        <h1>InvenMag</h1>
        <h2>Register</h2>
        <form action="/" method="get" onSubmit={handleSubmit}>
          <FormContainer>
            <Feedback>{firstNameFeedback}</Feedback>
            <Feedback>{lastNameFeedback}</Feedback>
            <Feedback>{usernameFeedback}</Feedback>
            <Feedback>{passwordFeedback}</Feedback>
            <label htmlFor="firstName">
              <Labels>First name:</Labels>
            </label>
            <StyledInput
              type="text"
              id="firstName"
              placeholder="First"
              name="text"
              value={inputFirstName}
              onChange={(e) => {
                setInputFirstName(e.target.value);
              }}
            />
            <label htmlFor="lastName">
              <Labels>Last name:</Labels>
            </label>
            <StyledInput
              type="text"
              id="lastName"
              placeholder="Last"
              name="text"
              value={inputLastName}
              onChange={(e) => {
                setInputLastName(e.target.value);
              }}
            />
            <label htmlFor="username">
              <Labels>Username:</Labels>
            </label>
            <StyledInput
              type="text"
              id="username"
              placeholder="enter your username here"
              name="text"
              value={inputUsername}
              onChange={(e) => {
                setInputUsername(e.target.value);
              }}
            />
            <label htmlFor="password1">
              <Labels>Password:</Labels>
            </label>
            <StyledInput
              type="password"
              id="password1"
              placeholder="enter your password here"
              name="text"
              value={inputPassword}
              onChange={(e) => {
                setInputPassword(e.target.value);
              }}
            />
            <label htmlFor="password2">
              <Labels>Re-Enter your Password:</Labels>
            </label>
            <StyledInput
              type="password"
              id="password2"
              placeholder="re-enter your password here"
              name="text"
              value={inputPassword2}
              onChange={(e) => {
                setInputPassword2(e.target.value);
              }}
            />
            <RegisterButton variant="contained" type="submit">
              {" "}
              Register{" "}
            </RegisterButton>
          </FormContainer>
        </form>
        <Feedback>{failedFeedback}</Feedback>
      </GridContainer>
    </Background>
  );
};

export default Register;

const RegisterButton = styled(Button)`
  && {
    background-color: #676767;
    margin-top: 20px;
    color: black;
    font-weight: bold;
  }
  &&:hover {
    background-color: #665F4D;
  }
`;
const StyledInput = styled.input`
  && {
    background-color: #f0f0f0;
    color: black;
    border-color: black;
    border-width: 2px;
    border-radius: 10px;
  }
`;

const Background = styled.div`
  background-color: white;
  height: 90vh;
  width: 75vw;
  justify-content: center;
  text-align: center;
  margin: 0px auto 0px auto;
  color: black;
  a {
    text-decoration: none;
    color: black;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(auto-fill, auto);
  justify-content: center;
`;
const FormContainer = styled.div`
  display: grid;
  grid-template-rows: 10px 10px 10px 10px 40px 30px 40px 30px 40px 30px 40px 30px 40px 30px;
  justify-content: center;
  width: 50vw;
  grid-gap: 10px;
`;

const Feedback = styled.p`
  color: red;
`;

const Labels = styled.p`
  padding-top: 15px;
  text-align: left;
`;
