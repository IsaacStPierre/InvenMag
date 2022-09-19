import React , { useState, useContext } from 'react'
import styled from 'styled-components'
import config from '../config'
const ApiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import { AppContext } from '../Context'

const CreateBlog = () => {

  // let { username } = useParams();
  let nav = useNavigate();
  let {values} = useContext(AppContext);

  let [titleFeedback, setTitleFeedback] = useState('')
  let [contentFeedback, setContentFeedback] = useState('')
  let [failedFeedback, setFailedFeedback] = useState('')

  let [title, setTitle] = useState('');
  let [content, setContent] = useState('');
  const created_at = new Date();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let error = false;
    setTitleFeedback('');
    setContentFeedback('');
    setFailedFeedback('');

    if(title.length < 1) {
      setTitleFeedback('error: title must be at least 1 character\n')
      error = true;
    } else {
      setTitleFeedback('')
    }
    if(content.length < 1) {
      setContentFeedback('error: content must be at least 1 characters\n')
      error = true;
    } else {
      setContentFeedback('')
    }
    if(!error) {

      let body = {
        "title": title,
        "content": content,
        "created_at": created_at
      }

      let res = await fetch(`${ApiUrl}/items/${values.username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if(res.status === 200) {
        nav('/')
      } else if(res.status === 404){
        setFailedFeedback('post invalid')
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
              <label htmlFor="description">
                  <Labels>Content:</Labels>
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
              <p>{created_at.toDateString()}</p>
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
  justify-content: center;
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
  justify-content: center;
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