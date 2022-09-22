import React from 'react';
import Header from './components/Header'
import Itemlist from './components/Itemlist'
import Itemdetails from './components/Itemdetails'
import Login from './components/Login'
import Register from './components/Register'
import Createitem from './components/Createitem'
import styled from 'styled-components'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const App = () => {

  return (
      <Background>
        <Router>
          <Header />
          <Routes>
            <Route path='/' element={<Itemlist />} />
            <Route path='/items/all' element={<Itemlist />} />
            <Route path='/items/users/:user_id' element={<Itemlist />} />
            <Route path='/items/new' element={<Createitem />} />
            <Route path='/items/:id' element={<Itemdetails />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </Router>
      </Background>
  );
}

export default App;


const Background = styled.div`
  background-color: #002439;
  min-height:100vh;
  width: 100vw;
  color: white;
  font-family: Arial;
  background-position: center;
  background-size: cover;
`