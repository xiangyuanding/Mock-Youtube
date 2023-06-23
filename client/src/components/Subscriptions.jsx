import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import { useAuthToken } from "../AuthToken";
import "../style/channel.css"

export default function Favourites() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const [channelList, setChannelList] = useState([]);
  const { accessToken } = useAuthToken();
  if (!isLoading && !isAuthenticated) {
    loginWithRedirect();
  }
  
  useEffect(()=>{
    if (!accessToken){
      return;
    }
    fetch(`${process.env.REACT_APP_API_URL}/channels`, {
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
      setChannelList(response);
    })
  }, [accessToken]);

  async function deleteChannel(item){
    fetch(`http://localhost:8000/channel/${item.id}`, {
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
    const newList=channelList.filter((element) => element.id !== item.id);
    setChannelList(newList);
  }

  return (
    <ul>
      <h1>Subscriptions</h1>
      {channelList.map((item) => {
        return (
          <li className="video" key={item.id}>
            <div className="subscrption">
              <div className="button-channel">
                <img width="100" src={item.avatar} alt=""/>
                <p className="channel-title">{item.name}</p>
              </div>
              <button className="delete-button" onClick={()=>deleteChannel(item)}>X</button>
            </div>
          </li>
        );
      })}
    </ul>
  )
}

