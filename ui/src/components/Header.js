import React, {useContext} from 'react'
import styled from 'styled-components'
import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
import {AppContext} from '../Context'

const Header = () => {
  let navLinks = null;

  const {values} = useContext(AppContext);

  if(values.isLoggedIn === true){
    navLinks = (
      <>
        <Link to={'/profile'}>
          <FirstButtonWrapper>
            <StyledButton variant="contained">User: {values.username}</StyledButton>

          </FirstButtonWrapper>
        </Link>
        <Link to={'/items/all'}>
          <SecondButtonWrapper>
            <StyledButton variant="contained">All Items</StyledButton>
          </SecondButtonWrapper>
        </Link>
        <Link to={'/items/new'}>
          <ThirdButtonWrapper>
            <StyledButton variant="contained">Create Item</StyledButton>
          </ThirdButtonWrapper>
        </Link>
      </>
    );
  } else {
    navLinks = (
      <Link to={'/Login'} >
        <FirstButtonWrapper>
          <StyledButton variant="contained"> Login/Register </StyledButton>
        </FirstButtonWrapper>
      </Link>
    );
  }
  return (
    <HeaderDiv>
      <Link to={`/`}>
        <Logo> InvenMag </Logo>
      </Link>
      {navLinks}
    </HeaderDiv>
  )
}

export default Header;

const StyledButton = styled(Button)`
  &&{
    background-color: #002439;
    height: 50px;
    width: 175px;
  }
  &&:hover {
    background-color: #2b659b;
  }
`
const FirstButtonWrapper = styled.div`
  margin: 23px 50px auto auto;
  position: absolute;
  right: 0px;
`
const SecondButtonWrapper = styled.div`
  margin: 23px 235px auto auto;
  position: absolute;
  right: 0px;
`
const ThirdButtonWrapper = styled.div`
  margin: 23px 420px auto auto;
  position: absolute;
  right: 0px;
`

const HeaderDiv = styled.div`
  background-color: #1D4367;
  position: relative;
  top: 0px;
  height: 100px;
  width: 100%;
  line-height: 35px;
`

const Logo = styled.div`
  padding: 10px;
  text-align: center;
  color: white;
  width: 200px;
  justify-content: center;
  font-size: 42px;
  margin: 15px auto;
  position: absolute;
  left: 20px;
  :hover{
    transform: scale(1.05);
    background-color: #002439;
    border-radius: 4px;
  }
`