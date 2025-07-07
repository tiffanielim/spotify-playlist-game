// Displays two cards at one time
// Props:
// tracks   – Array with exactly two Spotify track objects.
// onChoose – called when the user clicks a card.
// The clicked track object is passed back so we can add it to selectedTracks
// (to eventually create a playlist from selectedTracks)

import React from "react";
export default function TrackCards({ tracks = [], onChoose }) {
    if (tracks.length !== 2)
        return null;

    return (
        <div className="card-pair">
            {tracks.map((track) => (
                <div
                    key={track.id}
                    className="track-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => onChoose(track)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") onChoose(track);
                    }}
                >
                    {/* track cover */}
                    <img
                        className="cover"
                        src={track.album.images?.[0]?.url}
                        alt={`${track.name} cover art`}
                    />

                    {/* song title t*/}
                    <h3 className="title">{track.name}</h3>

                    {/* artist */}
                    <p className="artist">
                        {track.artists.map((a) => a.name).join(", ")}
                    </p>
                </div>
            ))}
        </div>
    );
}
