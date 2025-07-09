// Displays two cards at one time
// Props:
// tracks   – Array with exactly two Spotify track objects.
// onChoose – called when the user clicks a card.
// The clicked track object is passed back so we can add it to selectedTracks
// (to eventually create a playlist from selectedTracks)

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import './App.css'

import React from "react";

export default function TrackCards({ tracks = [], onChoose }) {
    if (tracks.length !== 2)
        return null;

    return (
        <Grid container spacing={0}>
            <div className="card-pair">

                {tracks.map((track) => (
                    <Grid>
                        <Card
                            key={track.id}
                            className="track-card"
                            role="button"
                            tabIndex={0}
                            onClick={() =>
                                onChoose(track)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ")
                                    onChoose(track);
                            }}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                padding: 2,
                                bgcolor: "#fff",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                borderRadius: 2,
                                cursor: "pointer",
                                transition: "transform 0.2s ease",
                                "&:hover": {
                                    transform: "scale(1.03)",
                                },
                            }}
                        >
                            {/* track cover */}
                            <CardMedia
                                component="img"
                                height="100"
                                image={track.album.images?.[0]?.url}
                                alt={`${track.name} cover`}
                                sx={{
                                    width: "90%",
                                    height: "auto",
                                    borderRadius: 1,
                                    mb: 2,
                                }}
                            />
                            <CardContent sx={{ pt: 0, maxWidth: 150, height: 25 }}>
                                {/* song title t*/}
                                <Typography variant="songTitle" component="div" className="title">
                                    {track.name}
                                </Typography>
                                {/* artist */}
                                <Typography variant="artistName" className="artist">
                                    {track.artists.map((a) => a.name).join(", ")}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </div>
        </Grid>
    );
}
