import React, { useState } from "react";
import PropTypes from "prop-types";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const values = {
    isLoggedIn,
    isLoading,
    username,
  };

  const setters = {
    setIsLoggedIn,
    setIsLoading,
    setUsername,
  };

  return (
    <AppContext.Provider value={{ values, setters }}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.object,
};

export { AppProvider, AppContext };
