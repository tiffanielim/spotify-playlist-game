import { useState, useEffect } from "react";
import { Button } from '@mui/material';
import { authorize, handleRedirect } from './authorization';
import TextField from "@mui/material/TextField";
// import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import './App.css'

function App() {

  const [artistID, setArtistID] = useState("");
  const [name, setName] = useState("");

  const [tracks, setTracks] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    console.log("token state →", token);
  }, [token]);

  useEffect(() => {
    console.log('name →', name);
  }, [name]);

  // get the token after redirect
  useEffect(() => {
    (async () => {
      await handleRedirect();
      const t = localStorage.getItem("access_token");
      if (t)
        setToken(t);
    })();
  }, []);

  async function fetchWebApi(endpoint, method, body = null) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: body ? JSON.stringify(body) : undefined,
    });
    return res.json();
  }

  //getting top tracks of user, once we have a token
  useEffect(() => {
    if (!token || !artistID)
      return;
    (async () => {
      try {
        const data = await fetchWebApi(
          `v1/artists/${artistID}/top-tracks?market=US`, `GET`
        );
        setTracks(data.tracks.slice(0, 10).map(t => ({
          name: t.name,
          uri: t.uri
        })));
      } catch (err) {
        console.error(err);
      }
    })();
  }, [token, artistID]); //run when token is first made, and then again when artist changes


  // Create playlist and add tracks
  async function createPlaylist(trackUris) {
    const { id: user_id } = await fetchWebApi("v1/me");

    const playlistName = name.trim()
      ? `${name.trim()}'s Playlist`
      : 'My Playlist';

    const playlist = await fetchWebApi(
      `v1/users/${user_id}/playlists`,
      "POST",
      {
        name: playlistName || "Hello Playlist",
        description: "Playlist created by YOU",
        public: true,
      }
    );
    await fetchWebApi(
      `v1/playlists/${playlist.id}/tracks?uris=${trackUris.join(",")}`,
      "POST"
    );
  }

  return (
    <>
      {!token && (
        <Button
          variant="contained"
          color="primary"
          onClick={authorize}
          sx={{ mt: 4 }}
        >
          Login with Spotify
        </Button>
      )}

      <TextField
        id="outlined-controlled"
        label="enter your name:"
        placeholder='Name'
        value={name}
        onChange={(event) => {
          setName(event.target.value);
        }}
      />

      <p>Current name: {name}</p>

      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">choose your artist:</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={artistID}
            label="artist"
            onChange={e =>
              setArtistID(e.target.value)}
          >
            <MenuItem value="06HL4z0CvFAxyc27GXpf02">Taylor Swift</MenuItem>
            <MenuItem value="2YZyLoL8N0Wb9xBt1NhZWg">Kendrick Lamar</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Button
        variant="contained"
        color="secondary"
        sx={{ ml: 2 }}
        disabled={tracks.length === 0}
        onClick={() => createPlaylist(tracks.map((t) => t.uri))}
      >
        Create Playlist
      </Button>
      5:00

      <ul>
        {tracks.map((t) => (
          <li key={t.id}>{t.name}</li>
        ))}
      </ul>
    </>

  )
}

export default App