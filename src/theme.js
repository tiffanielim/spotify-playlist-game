//styling

import { createTheme } from "@mui/material/styles";

const theme = createTheme({

    palette: {
        mode: 'dark',
        background: {
            default: '#000'
        },
        text: {
            primary: '#fff',
            secondary: '#fff',
        },
    },

    typography: {

        // card title (ex: see you again)
        songTitle: {
            fontSize: "1.2rem",
            fontWeight: "bold",
            lineHeight: 1.25,
            color: "#000",
            "@media (min-width:600px)": {
                fontSize: "1rem",
            },
        },

        // card artist (“tyler the creator”)
        artistName: {
            fontSize: "0.5rem",
            fontWeight: 400,
            color: "#000",
            "@media (min-width:600px)": {
                fontSize: "0.5rem",
            },
        },
    },

    // img shadow
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)", // glow
                    borderRadius: 8,
                },
            },
        },

        MuiButton: {
            styleOverrides: {
                outlinedPrimary: {
                    color: "#fff",
                    borderColor: "#fff",
                    boxShadow: "0 0 10px #ffffff80",
                    "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.08)",
                        borderColor: "#fff",
                        boxShadow: "0 0 15px #ffffffa0",
                    },
                    "&.Mui-disabled": {
                        color: "rgba(255,255,255,0.5)",
                        borderColor: "rgba(255,255,255,0.3)",
                        boxShadow: "none",
                    },
                },
            },
        },
    },
});
export default theme;
