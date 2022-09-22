import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import config from "../config";
const ApiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;
import Itemcard from "./Itemcard";
import { AppContext } from "../Context";
import { useLocation } from "react-router-dom";

const Itemlist = () => {
  const { values, setters } = useContext(AppContext);
  let [itemList, setItemList] = useState([]);
  let [titleText, setTitleText] = useState("");
  let location = useLocation();
  const context = useContext(AppContext);

  console.log(`Logged in? ${values.isLoggedIn}, Path: ${location.pathname}, User ID: ${context.values.user_id}, Username: ${context.values.username}`)

  useEffect(() => {
    setters.setIsLoading(true);
    if (values.isLoggedIn === true && location.pathname.includes('/items/users/')) {
      setTitleText("My Items");
      fetch(`${ApiUrl}/items/users/${values.user_id}`)
        .then((res) => res.json())
        .then((data) => {
          setItemList(data);
          setTimeout(() => setters.setIsLoading(false), 500);
        })
        .catch((err) => {
          console.log(err);
          setTimeout(() => setters.setIsLoading(false), 500);
        });
    } else {
      setTitleText("All Items");
      fetch(ApiUrl + "/items")
        .then((res) => res.json())
        .then((data) => {
          setItemList(data);
          setTimeout(() => setters.setIsLoading(false), 500);
        })
        .catch((err) => {
          console.log(`err: `, err);
          setTimeout(() => setters.setIsLoading(false), 500);
        });
    }
  }, [location]);

  return (
    <Background>
      <GridContainer>
        <h1>{titleText}</h1>
        {values.isLoading ? (
          <img
            src="https://miro.medium.com/max/1400/1*CsJ05WEGfunYMLGfsT2sXA.gif"
            width="360px"
            alt="loading"
          />
        ) : itemList.length > 0 ? (
          itemList.map((item) => <Itemcard key={item.item_id} item={item} />)
        ) : (
          <>
            <h3>You don&apos;t have any items! </h3>{" "}
            <p>Create one using &apos;Create Item&apos; above.</p>
          </>
        )}
      </GridContainer>
    </Background>
  );
};

export default Itemlist;

const Background = styled.div`
  background-color: #00121c;
  min-height: 90vh;
  width: 75vw;
  justify-content: center;
  text-align: center;
  margin: 0px auto 0px auto;
  a {
    text-decoration: none;
    color: white;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(auto-fill, auto);
  justify-content: center;
  margin: auto;
  padding: 5vmin 0px 15vmin 0px;
`;
