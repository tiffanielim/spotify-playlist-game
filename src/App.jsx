import { useState, useEffect } from "react";
// import TextField from "@mui/material/TextField";
// import Typography from "@mui/material/Typography";
import './App.css'
// import { Button } from '@mui/material';

function App() {

  const [artist, setArtist] = useState("Artist");
  const [name, setName] = useState("");
  // console.log(name);

  const token = 'BQDs4flDuAfo4sPRrBNFwjKJkyonjP7MuB6Ep66RdtqEFQ_BMT0NUJXG40NFRpjYQ1Eeo75cW-MMUnGL0p3iSi4bO7c8B1KEzms196ERiB5BkFq-IYFgm4dPBIEyvy-x6xS-1O4Zfho';

  async function fetchWebApi(endpoint, method, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method,
      body: JSON.stringify(body)
    });
    console.log("Token", { token });
    return await res.json();
  }

  async function getTopTracks() {
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    let data = await fetchWebApi(
      'v1/artists/06HL4z0CvFAxyc27GXpf02/top-tracks', 'GET'
    );

    console.log(
      data.tracks.map(
        track => track.name));
    // console.log(
    //   data.map(
    //     ({ name, artists }) =>
    //       `${name} by ${artists.map(artist => artist.name).join(', ')}`
    //   ));
  }

  const topTracks = getTopTracks();
  console.log(topTracks);


  

  return (
    <>
      {/* {console.log(currencyRates)} */}
      {console.log("right before text field!" +   data)}
      {/* <TextField
        id="outlined-controlled"
        label="enter your name:"
        placeholder='Name'
        value={name}
        onChange={(event) => {
          setName(event.target.value);
        }}
      /> */}
    </>

  )
}

export default App
