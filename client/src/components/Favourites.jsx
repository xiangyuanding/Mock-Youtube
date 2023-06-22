import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import { useAuthToken } from "../AuthToken";
import "../style/favourites.css"
import { useNavigate } from "react-router-dom";

export default function Favourites() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const [videoList, setVideoList] = useState([]);
  const { accessToken } = useAuthToken();
  const navigate = useNavigate();
  if (!isLoading && !isAuthenticated) {
    loginWithRedirect();
  }
  
  useEffect(()=>{
    if (!accessToken){
      return;
    }
    fetch(`${process.env.REACT_APP_API_URL}/videos`, {
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
      setVideoList(response);
    })
  }, [accessToken]);

  async function deleteVideo(item){
    fetch(`http://localhost:8000/video/${item.id}`, {
      method: "DELETE",
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
    });
  }

function gotoVideo(item){
  navigate(`/details/${item.id}`)
}

  return (
    <ul>
      <h1>Favourites</h1>
      {videoList.map((item) => {
        return (
          <li className="video" key={item.id}>
            <div className="favourite">
              <button className="button-video" onClick={()=>gotoVideo(item)}>
                <img width="150" src={item.cover} alt=""/>
                <p className="video-title">{item.title}</p>
              </button>
              <a href=""><button className="delete-button" onClick={()=>deleteVideo(item)}>X</button></a>
            </div>
          </li>
        );
      })}
    </ul>
  )
}

