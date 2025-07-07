import { useState, useEffect } from "react";
import { Button } from '@mui/material';
import { authorize, handleRedirect } from './authorization';
import TextField from "@mui/material/TextField";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TrackCards from "./TrackCards";
import './App.css'

function App() {
  useEffect(() => {
    (async () => {
      await handleRedirect(); // handles the Spotify redirect
      const t = localStorage.getItem("access_token");

      if (t) {
        console.log("access_token found →", t);
        setToken(t);
      } else {
        console.warn("No access token found in localStorage");
      }
    })();
  }, []);

  //step 0) general setup
  const [step, setStep] = useState(1);
  const [trackIndex, setTrackIndex] = useState(0);

  //step 1) setup/select artist & name
  const [artistID, setArtistID] = useState("");
  const [name, setName] = useState("");

  //step 2) user selects artist
  const [tracks, setTracks] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);

  //step 3) create playlist!
  const [playlistUrl, setPlaylistUrl] = useState(null);

  const [token, setToken] = useState(null);

  useEffect(() => {
    console.log("token state →", token);
  }, [token]);

  useEffect(() => {
    console.log('name →', name);
  }, [name]);

  async function fetchWebApi(endpoint, method, body = null) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: body ? JSON.stringify(body) : undefined,
    });
    return res.json();
  }

  function handleChoose(track) {
    setSelectedTracks(prev => [...prev, track]);

    if (trackIndex + 2 >= 10) {
      setStep(3); // Done picking!
    } else {
      setTrackIndex(prev => prev + 2); // Next pair
    }
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
        // setTracks(data.tracks.slice(0, 10).map(t => ({
        //   name: t.name,
        //   uri: t.uri
        // })));
        setTracks(data.tracks.slice(0, 10));
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
    const link = `https://open.spotify.com/playlist/${playlist.id}`;
    setPlaylistUrl(link);
    setStep(4);
  }

  return (
    <>
      <Container maxWidth="lg" gap="4">
        {!token && (
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={authorize}
              sx={{ mt: 4 }}
            >
              Login with Spotify
            </Button>
          </Box>
        )}

        {!name && (
          <Box>
            <TextField
              fullWidth
              id="outlined-controlled"
              label="enter your name:"
              placeholder='Name'
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          </Box>
        )}

        {!artistID && (
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
        )}

        {step === 1 && (
          <Box>
            <Button
              variant="contained"
              color="primary"
              sx={{ ml: 2 }}
              disabled={tracks.length === 0}
              onClick={() => setStep(2)}
            >
              Pick your songs!
            </Button>
          </Box>
        )}

        {step === 2 && (
          <>
            <TrackCards
              tracks={tracks.slice(trackIndex, trackIndex + 2)}
              onChoose={handleChoose}
            />
          </>
        )}

        {step === 3 && (
          <Box>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 4 }}
              onClick={() => createPlaylist(selectedTracks.map(t => t.uri))}
            >
              Create Playlist from Picks
            </Button>
          </Box>
        )}

        {step === 4 && playlistUrl && (
          <Box sx={{ mt: 4 }}>
            <h2>Hi {name}, your playlist is ready.</h2>
            <a href={playlistUrl} target="_blank" rel="noopener noreferrer">
              Open in Spotify 🎵
            </a>
          </Box>
        )}

        {/* <ul>
        {tracks.map((t) => (
          <li key={t.id}>{t.name}</li>
        ))}
      </ul> */}
      </Container>
    </>
  )
}

export default App