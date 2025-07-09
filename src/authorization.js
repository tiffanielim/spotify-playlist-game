//deals with authorization and PKCE code

//// Adapted from Spotify Authorization Code with PKCE Flow Guide:
//// https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow 

/* -------------------------------------- */
/* ---------- helper functions ---------- */
/* -------------------------------------- */

//PKCE auth starts with making a code verifier
// code verifier = random string, reassures Spotify that this is your auth code.
// This is basically a secret key
const generateRandomString = len => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const random = crypto.getRandomValues(new Uint8Array(len));
  return [...random].map(x => chars[x % chars.length]).join('');
};

// turns secret to a code challenge that Spotify will use to verify me later on
const sha256 = plain =>
  crypto.subtle.digest('SHA-256', new TextEncoder().encode(plain));

// converts it to this format bc Spotify only accepts this one
const b64url = buf =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

/* --------------------------------------- */
/* -------------- authorize -------------- */
/* --------------------------------------- */

// generates the code verifier, converts(hashes) it into the code challenge,
// stores verifier in localStorage, and redirects you to Spotify login
export async function authorize() {
  const clientId = '8a4642a5ae0545d39ecab03afe0a17c4';
  const redirectUri = 'https://tiffanielim.github.io/spotify-playlist-game/';
  const scopes = 'playlist-modify-public user-read-private user-top-read';

  const codeVerifier = generateRandomString(64);
  localStorage.setItem('code_verifier', codeVerifier);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = b64url(hashed);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });

  window.location = `https://accounts.spotify.com/authorize?${params}`;
}

/* ---------------------------------------- */
/* ----------- handle redirects ----------- */
/* ---------------------------------------- */

// pulls code from URL after user logs in, gets the code verifier from localStorage (to verify that it's the same user)
// sends to Spotify to get access token and saves that acess token to localStorage
export async function handleRedirect() {
  const code = new URLSearchParams(window.location.search).get('code');
  if (!code)
    return; // first visit, nothing to do

  const clientId = '8a4642a5ae0545d39ecab03afe0a17c4';
  const redirectUri = 'https://tiffanielim.github.io/spotify-playlist-game/';
  const codeVerifier = localStorage.getItem('code_verifier');

  console.log('URL code param →', code);
  console.log('Saved code_verifier →', codeVerifier);

  if (!codeVerifier) {
    console.error("Missing code_verifier. Likely origin mismatch.");
    return;
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier,
  });

  const r = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });

  if (!r.ok) {
    console.error('Token exchange failed:', await r.json());
    localStorage.removeItem('code_verifier');
    return;
  }

  const json = await r.json();
  localStorage.setItem('access_token', json.access_token);

  history.replaceState({}, '', redirectUri);
}
