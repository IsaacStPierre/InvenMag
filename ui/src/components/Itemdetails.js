import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import config from "../config";
const ApiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;
import { useParams, useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { HiTrash } from "react-icons/hi";
import { AppContext } from "../Context";
import { Button } from "@mui/material";

const Itemdetails = () => {
  let [Itemdetails, setItemDetails] = useState({
    name: "",
    description: "",
    quantity: "",
    created_by: "",
  });
  let [editView, setEditView] = useState(false);
  let [formChanged, setFormChanged] = useState(false);
  let [nameFeedback, setNameFeedback] = useState("");
  let [descriptionFeedback, setDescriptionFeedback] = useState("");
  let [quantityFeedback, setQuantityFeedback] = useState("");
  let [failedFeedback, setFailedFeedback] = useState("");
  let [name, setName] = useState("");
  let [description, setDescription] = useState("");
  let [quantity, setQuantity] = useState("");

  let { values, setters } = useContext(AppContext);
  let { id } = useParams();
  let nav = useNavigate();

  useEffect(() => {
    setters.setIsLoading(true);
    fetch(ApiUrl + `/items/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setItemDetails(data[0]);
        setName(data[0].name);
        setDescription(data[0].description);
        setQuantity(data[0].quantity);
        setTimeout(() => setters.setIsLoading(false), 500);
      })
      .catch((err) => console.log(err));
  }, [editView]);

  const deletePost = () => {
    fetch(`${ApiUrl}/items/${id}`, { method: "DELETE" }).then((res) => {
      if (res.status === 200) {
        nav("/");
      } else {
        window.alert("an error has occurred");
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let error = false;
    setNameFeedback("");
    setDescriptionFeedback("");
    setFailedFeedback("");

    if (name.length < 1) {
      setNameFeedback("error: name must be at least 1 character\n");
      error = true;
    } else {
      setNameFeedback("");
    }
    if (description.length < 1) {
      setDescriptionFeedback(
        "error: description must be at least 1 characters\n"
      );
      error = true;
    } else {
      setDescriptionFeedback("");
    }
    if (!error) {
      let body = {
        name: name,
        description: description,
      };

      let res = await fetch(`${ApiUrl}/items/${id}`, {
        method: "PATCH",
        headers: { "Description-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.status === 200) {
        setEditView(false);
      } else if (res.status === 404) {
        setFailedFeedback("post invalid");
      } else {
        setFailedFeedback("error on submission");
      }
    }
  };
  const options = (
    <OptionsContainer>
      <EditButton
        size={"2em"}
        onClick={() => {
          if (editView && formChanged) {
            if (
              confirm(
                "Are you sure you want to continue out of edit mode?\nYour work will be lost"
              )
            ) {
              setEditView(false);
            }
          } else {
            setEditView(!editView);
            setFormChanged(false);
          }
        }}
      />
      <TrashButton size={"2em"} onClick={deletePost} />
    </OptionsContainer>
  );

  const staticBody = values.isLoading ? (
    <img
      src="https://miro.medium.com/max/1400/1*CsJ05WEGfunYMLGfsT2sXA.gif"
      width="360px"
      alt="loading"
    />
  ) : (
    <>
      <ItemHeader>
        <p>Quantity: {Itemdetails.quantity}</p>
        <ItemName>Name: {Itemdetails.name}</ItemName>
        <p>Created By: {Itemdetails.created_by}</p>
      </ItemHeader>
      <ItemBody>
        Description:
        <p>{Itemdetails.description}</p>
      </ItemBody>
    </>
  );

  const editBody = (
    <>
      <h1>Edit Item</h1>
      <form action="/" method="get">
        <FormContainer>
          <Feedback>{nameFeedback}</Feedback>
          <Feedback>{descriptionFeedback}</Feedback>
          <label htmlFor="name">
            <Labels>Name:</Labels>
          </label>
          <StyledInput
            type="text"
            id="name"
            name="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setFormChanged(true);
            }}
          />
          <label htmlFor="description">
            <Labels>Description:</Labels>
          </label>
          <StyledTextarea
            name="text"
            id="description"
            rows="14"
            cols="10"
            wrap="soft"
            maxLength="1000"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setFormChanged(true);
            }}
          />
          <StyledButton variant="contained" onClick={handleSubmit}>
            {" "}
            Submit{" "}
          </StyledButton>
        </FormContainer>
        <p>Note: Editing this post will not change the created by user</p>
      </form>
      <Feedback>{failedFeedback}</Feedback>
    </>
  );

  return (
    <Background>
      <DetailsContainer>
        {values.isLoading ? (
          <img
            src="https://miro.medium.com/max/1400/1*CsJ05WEGfunYMLGfsT2sXA.gif"
            width="360px"
            alt="loading"
          />
        ) : (
          <>
            {values.isLoggedIn && Itemdetails.quantity === values.username
              ? options
              : null}
            {editView ? editBody : staticBody}
          </>
        )}
      </DetailsContainer>
    </Background>
  );
};

export default Itemdetails;

const EditButton = styled(MdEdit)`
  &&{
    color: white;
    margin: 0px 20vw auto auto;
    position: absolute;
    right: 0px;
  }
  &&:hover{
    cursor: pointer;
    color: #00121c;
  }
`

const TrashButton = styled(HiTrash)`
  &&{
    color: white;
    margin: 0px 25vw auto auto;
    position: absolute;
    right: 0px;
  }
  &&:hover{
    cursor: pointer;
    color: #00121c;
  }
`

const OptionsContainer = styled.div`
  display: grid;
  margin: 20px;
`

const Background = styled.div`
  background-color: #00121C;
  height: 90vh;
  width: 75vw;
  justify-content: center;
  text-align: center;
  margin: auto;
  padding-top: 12vh;
`

const ItemName = styled.div`
  font-size: 28px;
`

const ItemHeader = styled.div`
  display: grid;
  grid-template-columns: 200px auto 200px;
  padding-top: 10px;
  height: 50px;
`

const ItemBody = styled.div`
  padding: 15vmin 10px 15vmin 10px;
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
    margin: 10px auto 10px auto;
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
  grid-template-rows: 15px 15px 40px 30px 40px 100px 50px 15px;
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