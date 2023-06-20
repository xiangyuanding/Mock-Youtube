import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Channel from "./components/Channel";
import Favourites from "./components/Favourites";
import Subscriptions from "./components/Subscriptions";
import Video from "./components/Video";
import Profile from "./components/Profile";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import VerifyUser from "./components/VerifyUser";
//import AuthDebugger from "./components/AuthDebugger";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { AuthTokenProvider } from "./AuthToken";
//import "./style/normalize.css";
//import "./style/index.css";

const container = document.getElementById("root");

const requestedScopes = [
  "profile",
  "email",
  "read:todoitem",
  "read:user",
  "edit:todoitem",
  "edit:user",
  "delete:todoitem",
  "delete:user",
  "write:user",
  "write:todoitem",
];

async function RequireAuth({ children }) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  if (!isLoading && !isAuthenticated) {
    loginWithRedirect();
  }
  return children;
}

const root = ReactDOMClient.createRoot(container);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/verify-user`,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: requestedScopes.join(" "),
      }}
    >
      <AuthTokenProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/verify-user" element={<VerifyUser />} />
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="/details/:id" element={<Video />} />
              <Route path="/channel/:id" element={<Channel />} />
              <Route path="profile" element={<Profile />}/>
              </Route>    
                <Route path="favourites" element={<Favourites />} />
                <Route path="subscriptions" element={<Subscriptions />} />
              

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthTokenProvider>
    </Auth0Provider>
  </React.StrictMode>
);
