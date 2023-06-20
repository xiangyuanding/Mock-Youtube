import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import { useAuthToken } from "../AuthToken";


export default function Profile() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const [user, setUser] = useState();
  const { accessToken } = useAuthToken();
  if (!isLoading && !isAuthenticated) {
    loginWithRedirect();
  }
  
  useEffect(()=>{
    fetch(`${process.env.REACT_APP_API_URL}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((response) => {
      console.log(response)
      setUser(response);
    })
  }, []);


  return (
    <div className="center">
      <h1>
        Personal information
      </h1>
      <button className="folder"></button>
      <div className="folder-content">
        <p>{user.name}</p> 
        <p className="content-font"></p>
        <button className="edit-item" value="${note.id}"> edit🖊 </button>
        <button className="remove-item" value="${note.id}"> X </button>
      </div>
    </div>
  )
}
