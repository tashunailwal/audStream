import React, { useContext } from "react";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import Display from "./components/Display";
import {PlayerContext} from"./context/PlayerContext";
// import DisplayHome from "./components/DisplayHome";
const App=()=>{

  const {audioRef,track,songsData}= useContext(PlayerContext)
  return(
    <div className="h-screen bg-black">
      {
        songsData.length!==0
        ? <>
        <div className="h-[90%] flex">
        <Sidebar/>
        <Display/>
      </div>
      <Player/>
        </> 
      : null
      }
     
      <audio ref={audioRef} src={track ? track.file : ""} preload="auto"></audio>
    </div>
  );
}
export default App;