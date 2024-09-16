import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import jwtDecode from 'jwt-decode'
// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";
import PublicApp from "PublicApp";
import PrivateApp from "PrivateApp";
// const root = ReactDOM.createRoot(document.getElementById("root"));
(() => {
  const token = localStorage.getItem('token');
  const user = token ? jwtDecode(token) : null;

  ReactDOM.render(
    <BrowserRouter>
      <MaterialUIControllerProvider>
        {user ? <PrivateApp user={user} /> : <PublicApp />}
      </MaterialUIControllerProvider>
    </BrowserRouter>,
    document.getElementById("root")
  );
})();