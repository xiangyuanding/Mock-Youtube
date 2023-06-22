import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthToken } from "../AuthToken";
import { useAuth0 } from "@auth0/auth0-react";
import "../style/video.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Video() {
  const [video, setVideo] = useState();
  const [channel, setChannel] = useState();
  const { id } = useParams();
  const { accessToken } = useAuthToken();
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const showPopup = () => {
    toast.success('done!', {
      position: toast.POSITION.TOP_CENTER,
      hideProgressBar: true,
    });
  };

  useEffect(()=>{
    fetch(`https://www.googleapis.com/youtube/v3/videos?id=${id}&key=AIzaSyBSn9Lmi69QbWsJFoYps9d9MsD-mijyo7E&part=id,snippet`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((videos) => {
      const id = videos.items[0].id;
      const description = videos.items[0].snippet.description;
      const cover = videos.items[0].snippet.thumbnails.standard.url;
      const title = videos.items[0].snippet.title;
      const channelId = videos.items[0].snippet.channelId;
      setVideo({id, description, cover, title, channelId});
    });
  }, [])

  useEffect(()=>{
    if (!video){
      return;
    }
    fetch(`https://www.googleapis.com/youtube/v3/channels?id=${video.channelId}&key=AIzaSyBSn9Lmi69QbWsJFoYps9d9MsD-mijyo7E&part=id,snippet`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((channels) => {
      const id = channels.items[0].id;
      const description = channels.items[0].snippet.description;
      const avatar = channels.items[0].snippet.thumbnails.default.url;
      const name = channels.items[0].snippet.title;
      setChannel({id, description, avatar, name});
    });
  }, [video])

  function saveVideo(){
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
    fetch(`http://localhost:8000/video`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(video),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      showPopup();
      return response.json();
    })
  }

  function subscribeChannel(){
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
    fetch(`http://localhost:8000/channel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(channel),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      showPopup();
      return response.json();
    })
  }

  return (
    <div>
      <ToastContainer autoClose={1000}/>
      <div className="video-self">
        <iframe className="video-player" width="1000" height="720" src={`https://www.youtube.com/embed/${id}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
        <div>
          <button className='channnel-subscribe' onClick={()=>subscribeChannel()}>
            <img className="subscribe" src={channel?.avatar} />
            <p className='subscribe-button'>{"Subscribe🔔\n"+channel?.name}</p>
          </button>
          

          <button className='save' onClick={()=>saveVideo()}>save this video</button>
        </div>

        

      </div>  
      <p>{video?.description}</p>
    </div>
  )
}
