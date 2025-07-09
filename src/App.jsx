import { useState, useEffect } from "react";
import { Button } from '@mui/material';
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import './App.css'

//files imported
import { authorize, handleRedirect } from './authorization';
import TrackCards from "./TrackCards";

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
  const [timer, setTimer] = useState(10); // 10-second timer
  const [showDialog, setShowDialog] = useState(false);

  //step 3) create playlist!
  const [playlistUrl, setPlaylistUrl] = useState(null);

  const [token, setToken] = useState(null);

  // useEffect(() => {
  //   console.log("token state", token);
  // }, [token]);

  // useEffect(() => {
  //   console.log('name', name);
  // }, [name]);

  async function fetchWebApi(endpoint, method, body = null) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: body ? JSON.stringify(body) : undefined,
    });
    return res.json();
  }

  //for step 3, user choosing tracks
  function handleChoose(track) {
    setSelectedTracks(prev => [...prev, track]);

    if (trackIndex + 2 >= 10) {
      setStep(3); //done picking!
    } else {
      setTrackIndex(prev => prev + 2); //next pair
    }
  }

  //getting top tracks of artist, once we have a token and chosen artist
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

  //setting up timer once we're in step 2
  useEffect(() => {
    if (step !== 2)
      return;

    setTimer(10);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setShowDialog(true); // show popup
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  //create playlist and add tracks
  async function createPlaylist(trackUris) {
    const { id: user_id } = await fetchWebApi("v1/me");

    const playlistName = name.trim()
      ? `${name.trim()}'s Playlist`
      : 'My Playlist';

    //creating playlist
    const playlist = await fetchWebApi(
      `v1/users/${user_id}/playlists`,
      "POST",
      {
        name: playlistName || "Hello Playlist",
        description: "Playlist created by YOU",
        public: true,
      }
    );
    //adding chosen songs to playlist
    await fetchWebApi(
      `v1/playlists/${playlist.id}/tracks?uris=${trackUris.join(",")}`,
      "POST"
    );
    //setting up the URL to open spotify playlist
    const link = `https://open.spotify.com/playlist/${playlist.id}`;
    setPlaylistUrl(link);
    setStep(4);
  }

  return (
    <>
      <Container maxWidth="lg" gap="4">
        <Grid container spacing={4}>
          <Grid>
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
          </Grid>

          <Grid>
            <Box>
            {/* lets user input name for playlist name */}
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

            {/* artist selection */}
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
                    <MenuItem value="3TVXtAsR1Inumwj472S9r4">Drake</MenuItem>
                    <MenuItem value="2h93pZq0e7k5yf4dywlkpM">Frank Ocean</MenuItem>
                    <MenuItem value="3fMbdgg4jU18AjLCKBhRSm">Michael Jackson</MenuItem>
                    <MenuItem value="1Xyo4u8uXC1ZmMpatF05PJ">The Weeknd</MenuItem>
                    <MenuItem value="2qxJFvFYMEDqd7ui6kSAcq">Zedd</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
          </Grid>

            {/* button to start step 2 aka choosing songs */}
          <Grid>
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

            {/* timer + track choosing */}
            {step === 2 && (
              <>
                {step === 2 && (
                  <>
                    <Typography variant="h5" sx={{ color: '#000', mb: 2 }}>
                      Time left: {timer} seconds
                    </Typography>
                    <TrackCards
                      tracks={tracks.slice(trackIndex, trackIndex + 2)}
                      onChoose={handleChoose}
                    />
                  </>
                )}
                {/* Pop up for when time is up */}
                <Dialog open={showDialog}>
                  <DialogTitle>Time's Up!</DialogTitle>
                  <DialogContent>
                    You took too long to pick your songs. Please try again!
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => {
                      setShowDialog(false);
                      setStep(1); // go back to setup
                      setTrackIndex(0);
                      setSelectedTracks([]);
                    }}>
                      Restart
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
          </Grid>

          {/* step 3: create playlist button */}
          <Grid>
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

            {/* step 4: showing playlist link */}
            {step === 4 && playlistUrl && (
              <Box sx={{ mt: 4 }}>
                <h2>Hi {name}, your playlist is ready.</h2>
                <a href={playlistUrl} target="_blank" rel="noopener noreferrer">
                  Open in Spotify 🎵
                </a>
              </Box>
            )}
          </Grid>

          {/* <ul>
        {tracks.map((t) => (
          <li key={t.id}>{t.name}</li>
        ))}
      </ul> */}
        </Grid>
      </Container>
    </>
  )
}

export default App

//Feedback:
// have more built out functions (to keep track better)
// be able to skim through and understand
// improve modularity
// - class dependency
// - functions
// do 1 place to touch data
// ex: timer - could be on top so you don't have to worry about disreprencies