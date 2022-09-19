import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Itemcard = ({ item }) => {
    return (
        <Link to={`/items/${item.id}`}>
            <Background>
                <ItemHeader>
                    <p style={{"text-align":"left"}}>{item.created_by}</p>
                    <ItemName>{item.name}</ItemName>
                    <p style={{"text-align":"right"}}>{item.quantity}</p>
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

const ItemTitle = styled.div`
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
