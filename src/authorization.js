/* ---------- helper functions ---------- */
const generateRandomString = len => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const random = crypto.getRandomValues(new Uint8Array(len));
  return [...random].map(x => chars[x % chars.length]).join('');
};

const sha256 = plain =>
  crypto.subtle.digest('SHA-256', new TextEncoder().encode(plain));

const b64url = buf =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

/* ---------- public functions ---------- */
export async function authorize() {
  const clientId    = '8a4642a5ae0545d39ecab03afe0a17c4';
  const redirectUri = 'https://tiffanielim.github.io/spotify-playlist-game/';
  const scopes      = 'playlist-modify-public user-read-private';

  // 1. make a verifier
  const codeVerifier = generateRandomString(64);
  localStorage.setItem('code_verifier', codeVerifier);

  // 2. derive the challenge
  const hashed        = await sha256(codeVerifier);
  const codeChallenge = b64url(hashed);

  // 3. build /authorize URL
  const params = new URLSearchParams({
    response_type: 'code',
    client_id:     clientId,
    redirect_uri:  redirectUri,
    scope:         scopes,
    code_challenge_method: 'S256',
    code_challenge:       codeChallenge,
  });

  window.location = `https://accounts.spotify.com/authorize?${params}`;
}

export async function handleRedirect() {
  const code = new URLSearchParams(window.location.search).get('code');
  if (!code) return;                      // first visit, nothing to do

  const clientId    = '8a4642a5ae0545d39ecab03afe0a17c4';
  const redirectUri = 'https://tiffanielim.github.io/photobooth/';
  const codeVerifier = localStorage.getItem('code_verifier');

  const body = new URLSearchParams({
    grant_type:     'authorization_code',
    code,
    redirect_uri:   redirectUri,
    client_id:      clientId,
    code_verifier:  codeVerifier,
  });

  const r   = await fetch('https://accounts.spotify.com/api/token', {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  const json = await r.json();
  localStorage.setItem('access_token', json.access_token);

  // tidy the URL
  history.replaceState({}, '', redirectUri);
}
