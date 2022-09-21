import React , { useState, useContext } from 'react'
import styled from 'styled-components'
import config from '../config'
const ApiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import { AppContext } from '../Context'

const CreateItem = () => {

  let nav = useNavigate();
  let {values} = useContext(AppContext);

  let [nameFeedback, setNameFeedback] = useState('')
  let [descriptionFeedback, setDescriptionFeedback] = useState('')
  let [failedFeedback, setFailedFeedback] = useState('')

  let [name, setName] = useState('');
  let [description, setDescription] = useState('');
  let [quantity, setQuantity] = useState(0);
  const user_id = values.user_id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    let error = false;
    setNameFeedback('');
    setDescriptionFeedback('');
    setFailedFeedback('');

    if(name.length < 1) {
      setNameFeedback('error: name must be at least 1 character\n')
      error = true;
    } else {
      setNameFeedback('')
    }
    if(description.length < 1) {
      setDescriptionFeedback('error: description must be at least 1 characters\n')
      error = true;
    } else {
      setDescriptionFeedback('')
    }
    if(!error) {

      let body = {
        "user_id": user_id,
        "name": name,
        "description": description,
        "quantity": quantity
      }

      let res = await fetch(`${ApiUrl}/items/${values.username}`, {
        method: 'POST',
        headers: { 'Description-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if(res.status === 200) {
        nav('/')
      } else if(res.status === 404){
        setFailedFeedback('post invalid')
        console.log (res.json())
      } else {
        setFailedFeedback('error on submission')
      }
    }
  }

  if(values.isLoggedIn) {
    return (
      <Background>
      <DetailsContainer>
        <h1>New Item</h1>
        <form action='/' method='get'>
            <FormContainer>
              <Feedback>{nameFeedback}</Feedback>
              <Feedback>{descriptionFeedback}</Feedback>
              <label htmlFor="name">
                  <Labels>Name:</Labels>
              </label>
              <StyledInput
                type="text"
                id="name"
                placeholder="enter the name of your item"
                name="text"
                value={name}
                onChange={e => {setName(e.target.value)}}
              />
              <label htmlFor="quantity">
                  <Labels>Quantity:</Labels>
              </label>
              <StyledInput
                type="number"
                id="quantity"
                placeholder="enter the quantity"
                quantity="number"
                value={quantity}
                onChange={e => {setQuantity(e.target.value)}}
              />
              <label htmlFor="description">
                  <Labels>Description:</Labels>
              </label>
              <StyledTextarea
                name="text"
                id="description"
                placeholder="enter the description of your item"
                rows="14"
                cols="10"
                wrap="soft"
                maxLength="1000"
                value={description}
                onChange={e => {setDescription(e.target.value)}}
              />
              <StyledButton variant="contained" onClick={handleSubmit}> Submit </StyledButton>
            </FormContainer>
          </form>
          <Feedback>{failedFeedback}</Feedback>
      </DetailsContainer>
    </Background>
    )
  } else {
    return (<h1>Please log in to see this page</h1>)
  }
}

export default CreateItem;

const Background = styled.div`
  background-color: #00121C;
  height: 90vh;
  width: 75vw;
  justify-description: center;
  text-align: center;
  margin: auto;
  padding-top: 12vh;
`

const DetailsContainer = styled.div`
  padding: 50px 10px 50px 10px;
  margin: auto;
  background-color: #2B659B;
  width: 65vw;
  height: auto;
`

const StyledButton = styled(Button)`
  &&{
    background-color: #7E8C9B;
    margin: 30px auto 10px auto;
    width: 150px;
  }
  &&:hover {
    background-color: #002439;
  }
`
const StyledInput = styled.input`
  &&{
    background-color: #002439;
    color: white;
    border-color: white;
    border-width: 2px;
    border-radius: 10px;
  }
`
const StyledTextarea = styled.textarea`
&&{
  background-color: #002439;
  color: white;
  border-color: white;
  border-width: 2px;
  border-radius: 10px;
  font-family: Arial;
  width: 50vw;
}
`

const FormContainer = styled.div`
  display: grid;
  grid-template-rows: 15px 15px 40px 30px 40px auto 15px 15px;
  justify-description: center;
  width: 50vw;
  grid-gap: 10px;
  margin-left: auto;
  margin-right: auto;
`

const Feedback = styled.p`
  color: red;
`

const Labels = styled.p`
  padding-top: 15px;
  text-align: left;
`