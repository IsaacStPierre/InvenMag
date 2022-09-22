import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Itemcard = ({ item }) => {
    return (
        <Link to={`/items/${item.item_id}`}>
            <Background>
                <ItemHeader>
                    <p style={{"textAlign":"left"}}></p>
                    <ItemName>{item.name}</ItemName>
                    <p style={{"textAlign":"right"}}>Quantity: {item.quantity}</p>
                </ItemHeader>
                <ItemBody>
                    <p>{item.description.slice(0,100)}{item.description.length > 100 ? "..." : null}</p>
                </ItemBody>
            </Background>
        </Link>
    )
};

Itemcard.propTypes = {
  item: PropTypes.object,
};

export default Itemcard;

const Background = styled.div`
  background-color: #676767;
  width: 70vw;
  justify-content: center;
  margin: 20px 0px 20px 0px;
  text-align: center;
  display: grid;
  grid-template-areas:
    "A A A A   A A A A   A A A A"
    "B B B B   B B B B   B B B B"
    "B B B B   B B B B   B B B B";
  :hover {
    transform: scale(1.05);
  }
`

const ItemName = styled.div`
  font-size: 24px;
  margin: auto;
`;

const ItemHeader = styled.div`
  grid-area: A;
  display: grid;
  grid-template-columns: 150px auto 150px;
  padding-top: 10px;
  height: 50px;
  margin: auto 5px auto 5px;
  width: 65vw;
`;

const ItemBody = styled.div`
  grid-area: B;
  padding-left: 10px;
  padding-right: 10px;
`;
