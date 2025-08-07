<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/tiffanielim/SnapChatStarterForkable">
    <img src="https://static.vecteezy.com/system/resources/previews/018/930/704/non_2x/snapchat-logo-snapchat-icon-transparent-free-png.png" alt="Logo" width="180" height="180">
  </a>

<h3 align="center">Kiss Or Diss</h3>
<h5 align="center">Musical Tinder</h5>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>

<div align="left">
<!-- ABOUT THE PROJECT -->

## About The Project

Kiss or Diss is an interactive Spotify playlist game built with React, Vite, Material UI, and the Spotify Web API. Players select an artist and have a limited time to choose their top 5 favorite songs, which are then made into a playlist directly on their Spotify account.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With 

- [![React][React-shield]][React-url]
- [![Vite][Vite-shield]][Vite-url]
- [![Material UI][MUI-shield]][MUI-url]
- [![Spotify][Spotify-shield]][Spotify-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To run this project locally, clone the repo and install the dependencies. This project uses React Native with Expo and Supabase for backend services.

### Prerequisites

- **Node.js and npm**  
  - [Get started here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- **Vite**
  - Comes with npm install, allows npm run dev
- **Spotify Developer Account**
  - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/tiffanielim/spotify-playlist-game.git
   cd spotify-playlist-game
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Set up your Spotify Web API credentials
   To use this app, you need a Spotify Developer account.
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Click "Create an App"
   - Give it a name (e.g., "Kiss or Diss") and description
   - Under Redirect URIs, you can use a github-pages link
6. Run the app
   ```
   npm run dev
   ```
7. Log in via Spotify after the app is running!

**Note:** The client ID and redirect URI are safe to expose in the frontend since Kiss or Diss uses the [Authorization Code with PKCE Flow](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow), which does not require a client secret and is designed for browser apps like this one!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

Kiss or Diss offers a fun way to make a new playlist, discover new songs, and pick your favorites!

- User login through Spotify authorization
- Choose an artist 
- Quickly pick your favorite songs before time runs out
- A playlist made up of those chosen songs is created on your Spotify dashboard
  
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Demo
[Live Demo](https://tiffanielim.github.io/spotify-playlist-game/)  

<p align="right">(<a href="#readme-top">back to top</a>)</p>

</div>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[React-shield]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vite-shield]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[MUI-shield]: https://img.shields.io/badge/Material--UI-007FFF?style=for-the-badge&logo=mui&logoColor=white
[MUI-url]: https://mui.com/
[Spotify-shield]: https://img.shields.io/badge/Spotify_API-1ED760?style=for-the-badge&logo=spotify&logoColor=white
[Spotify-url]: https://developer.spotify.com/documentation/web-api
