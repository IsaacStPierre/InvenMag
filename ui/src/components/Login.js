import React, { useState, useContext, useEffect } from 'react'
import styled from 'styled-components'
import { Button } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import config from '../config'
const ApiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;
import { AppContext } from '../Context'

const Login = () => {

  const { values, setters } = useContext(AppContext)
  const [inputUsername, setInputUsername] = useState('')
  const [inputPassword, setInputPassword] = useState('')
  const [formFeedback, setFormFeedback] = useState('')
  const [formFeedback2, setFormFeedback2] = useState('')
  const [successFeedback, setSuccessFeedback] = useState('')
  const [failedFeedback, setFailedFeedback] = useState('')

  const nav = useNavigate();
  const context = useContext(AppContext);

  useEffect(() => {
    if(context.values.isLoggedIn === true){
      window.alert("You are logged in! Redirecting to your inventory")
      nav(`/items/users/${values.user_id}`)
    }
  }, [context.values.isLoggedIn])

  const handleSubmit = async (e) => {
    e.preventDefault();
    let error = false;

    setFormFeedback('')
    setFormFeedback2('')
    setSuccessFeedback('')
    setFailedFeedback('')

    if(inputUsername.length < 3) {
      setFormFeedback('error: username must be at least 5 characters\n')
      error = true;
    } else {
      setFormFeedback('')
    }
    if(inputPassword.length < 3) {
      setFormFeedback2('error: password must be at least 7 characters\n')
      error = true;
    } else {
      setFormFeedback2('')
    }
    if(!error) {
      let body = {
        username: inputUsername,
        password: inputPassword
      }

      let res = await fetch (`${ApiUrl}/Login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if(res.status === 200) {
        if(await res.text() === 'authenticated') {
          context.setters.setUsername(inputUsername);
          fetch(ApiUrl + `/users/${inputUsername}`)
          .then(res => res.json())
          .then(data => {
            context.setters.setUser_id(data[0].user_id)
            context.setters.setUsername(data[0].username)
            context.setters.setIsLoggedIn(true);
          })
          .catch(err => console.log(err))
        }
      } else if(res.status === 404){
        setFailedFeedback('username could was not found')
      } else if(res.status === 400){
        setFailedFeedback('incorrect password!')
      }
    }
  }

  return (
    <Background>
      <GridContainer>
        <h1>InvenMag</h1>
        <h2>Welcome back!</h2>
        <form action='/' method='get' onSubmit={handleSubmit} >
          <FormContainer>
            <Feedback>{formFeedback}</Feedback>
            <Feedback>{formFeedback2}</Feedback>
            <label htmlFor="username">
                <Labels>Username:</Labels>
            </label>
            <StyledInput
            type="text"
            id="username"
            placeholder="enter your username here"
            name="text"
            value={inputUsername}
            onChange={e => {setInputUsername(e.target.value)}}
            />
            <label htmlFor="password">
                <Labels>Password:</Labels>
            </label>
            <StyledInput
            type="text"
            id="password"
            placeholder="enter your password here"
            name="text"
            value={inputPassword}
            onChange={e => {setInputPassword(e.target.value)}}
            />
            <StyledLoginButton variant="contained" type="submit"> Login </StyledLoginButton>
          </FormContainer>
        </form>
        <p><Link to={'/register'}>Register here</Link></p>
        <Success>{successFeedback}</Success>
        <Feedback>{failedFeedback}</Feedback>
      </GridContainer>
    </Background>
  )
}

export default Login;

const StyledLoginButton = styled(Button)`
  &&{
    background-color: #676767;
    margin-top: 20px;
    font-weight: bold;
  }
  &&:hover {
    background-color: #665F4D;
  }
`
const StyledInput = styled.input`
  &&{
    background-color: #2D2E2E;
    color: white;
    border-color: white;
    border-width: 2px;
    border-radius: 10px;
  }
  // &&:hover {
  //   background-color: #2D2E2E;
  // }
`

const Background = styled.div`
  background-color: #343434;
  height: 90vh;
  width: 75vw;
  justify-content: center;
  text-align: center;
  margin: 0px auto 0px auto;
  a{
    text-decoration: none;
    color: white;
  }
`

const GridContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(auto-fill, auto);
  justify-content: center;
`
const FormContainer = styled.div`
  display: grid;
  grid-template-rows: 15px 15px 40px 30px 40px 30px;
  justify-content: center;
  width: 50vw;
  grid-gap: 10px;
`

const Feedback = styled.p`
  color: red;
`
const Success = styled.p`
  color: green;
`

const Labels = styled.p`
  padding-top: 15px;
  text-align: left;
`