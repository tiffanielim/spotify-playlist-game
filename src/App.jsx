import { useState, useEffect } from "react";
import { Button } from '@mui/material';
import { authorize, handleRedirect } from './authorization';
// import TextField from "@mui/material/TextField";
// import Typography from "@mui/material/Typography";
import './App.css'
// import { Button } from '@mui/material';

function App() {

  const [artist, setArtist] = useState("Artist");
  const [name, setName] = useState("");

  const [tracks, setTracks] = useState([]);
  const [token, setToken] = useState(null);


  // get the token after redirect
  useEffect(() => {
    (async () => {
      await handleRedirect();
      const t = localStorage.getItem("access_token");
      if (t)
        setToken(t);
    })();
  }, []);

  useEffect(() => {
    if (!token) return;

    async function fetchWebApi(endpoint, method = "GET", body = null) {
      const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: body ? JSON.stringify(body) : undefined,
      });
      return res.json();
    }

    async function getTopTracks() {
      try {
        const data = await fetchWebApi(
          "v1/artists/06HL4z0CvFAxyc27GXpf02/top-tracks?market=US"
        );
        // defensive: Spotify returns {tracks:[…]} or an error object
        setTracks(data.tracks?.map(t => t.name) || []);
      } catch (err) {
        console.error(err);
      }
    }

    getTopTracks();
  }, [token]);

  // //once we have a token, fetch top tracks
  // useEffect(() => {
  //   if (!token) return;

  //   async function getTopTracks() {
  //     const data = await fetchWebApi(
  //       'v1/artists/06HL4z0CvFAxyc27GXpf02/top-tracks?market=US',
  //       'GET',
  //       null,
  //       token
  //     );
  //     setTracks(data.tracks.map(t => t.name));
  //   }
  //   getTopTracks();
  // }, [token]);

  // async function fetchWebApi(endpoint, method, body, token) {
  //   const res = await fetch(`https://api.spotify.com/${endpoint}`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //     method,
  //     body: JSON.stringify(body)
  //   });
  //   console.log("Token", { token });
  //   return await res.json();
  // }

  // async function getTopTracks() {
  //   // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  //   let data = await fetchWebApi(
  //     'v1/artists/06HL4z0CvFAxyc27GXpf02/top-tracks', 'GET'
  //   );

  //   console.log(
  //     data.tracks.map(
  //       track => track.name));
  //   // console.log(
  //   //   data.map(
  //   //     ({ name, artists }) =>
  //   //       `${name} by ${artists.map(artist => artist.name).join(', ')}`
  //   //   ));
  // }

  // const topTracks = getTopTracks();
  // console.log(topTracks);

  return (
    <>
      {/* {console.log(currencyRates)} */}
      {/* <TextField
        id="outlined-controlled"
        label="enter your name:"
        placeholder='Name'
        value={name}
        onChange={(event) => {
          setName(event.target.value);
        }}
      /> */}
      <Button
        variant="contained"
        color="primary"
        onClick={authorize}
        sx={{ mt: 4 }}
      >
        Login with Spotify
      </Button>

      {tracks.length > 0 && (
        <ul>
          {tracks.map(title => <li key={title}>{title}</li>)}
        </ul>
      )}
    </>

  )
}

export default App
