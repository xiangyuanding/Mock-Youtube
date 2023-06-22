import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import { useAuthToken } from "../AuthToken";
import "../style/profile.css"

export default function Profile() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const [user, setUser] = useState();
  const { accessToken } = useAuthToken();
  if (!isLoading && !isAuthenticated) {
    loginWithRedirect();
  }
  
  useEffect(()=>{
    if (!accessToken){
      return;
    }
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
      setUser(response);
    })
  }, [accessToken]);

  function clickEdit(e) {
    if (e.target.classList.contains("done")){
      setContentEditable(e.target, "false");
      e.target.textContent="edit🖊";
      update(e.target);
    } else{
      setContentEditable(e.target, "true");
      e.target.textContent="Done✔"; 
    }
    e.target.classList.toggle("done");

  }

  async function update(target){
    const paragraphs = target.parentNode.querySelectorAll(".editable");
    const updateUser = {
      name: paragraphs[0].textContent,
      description: paragraphs[1].textContent
    }
    fetch(`http://localhost:8000/user/${user.auth0Id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updateUser),
    })    
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
  }


  
  function setContentEditable(target, str){
    const paragraphs = target.parentNode.querySelectorAll(".editable");
    paragraphs[0].setAttribute("contenteditable", str);
    paragraphs[1].setAttribute("contenteditable", str);
    paragraphs[0].classList.toggle("activate");
    paragraphs[1].classList.toggle("activate");
  }
  
  return (
    <div className="center">
      <h1>
        Personal information
      </h1>
      <div className="folder-content">
        <div className="same-line">
          <p className="unchangable">User name: </p>
          <p className="editable">{user?.name}</p>
        </div>

        <p>Email: {user?.email}</p> 
        <p>auth0Id: {user?.auth0Id}</p> 
        <div className="same-line">
          <p className="unchangable">Description: </p>
          <p className="editable">{user?.description}</p> 
        </div>

        <button className="edit-item" onClick={(e)=>clickEdit(e)}> edit🖊 </button>

      </div>
    </div>
  )
}

