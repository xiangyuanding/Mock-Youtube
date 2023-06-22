import shuffle from "lodash.shuffle";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/home.css"

const POPULAR_VIDEOS="https://www.googleapis.com/youtube/v3/videos?chart=mostPopular&videoCategoryId=0&maxResults=200&key=AIzaSyBSn9Lmi69QbWsJFoYps9d9MsD-mijyo7E&part=id,snippet,contentDetails,statistics,status"

export default function Home() {
  const [videoList, setVideoList] = useState([]);
  const navigate = useNavigate();
  useEffect(()=>{
    fetch(POPULAR_VIDEOS)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((videos) => {
      const shuffledList = shuffle(videos.items);
      const updateList=[];
      for (let i = 0; i < 8; i++){
        const id = shuffledList[i].id;
        const description = shuffledList[i].snippet.description;
        const cover = shuffledList[i].snippet.thumbnails.standard.url;
        const title = shuffledList[i].snippet.title;
        updateList.push({id, description, cover, title});
      }
      setVideoList(updateList);
    });
  }, [])

  
  function clickVideo(item){
    navigate(`details/${item.id}`);
  }

  return (
  
    <ul className="videos">
      {videoList.map((item) => {
        return (
          <li className="video" key={item.id}>
            <a href="">
              <img src={item.cover} alt="" onClick={()=>clickVideo(item)}/>
            </a>
            <figcaption>{item.title}</figcaption>
          </li>
          
        );
      })}
    </ul>
    
  )
}
