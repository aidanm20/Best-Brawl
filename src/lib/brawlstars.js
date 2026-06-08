const BASE_URL = 'https://api.brawlstars.com/v1';

// The API requires the # in player tags to be URL-encoded as %23
// e.g. "#ABC123" becomes "%23ABC123"
function encodeTag(tag) {
  return encodeURIComponent(tag.startsWith('#') ? tag : '#' + tag);
}

export async function getPlayerBattleLog(tag, apiKey) {
  const url = `${BASE_URL}/players/${encodeTag(tag)}/battlelog`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Brawl Stars API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.items; // array of up to 25 battles
}

export async function getPlayer(tag, apiKey) {
  const url = `${BASE_URL}/players/${encodeTag(tag)}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Brawl Stars API error: ${response.status} ${response.statusText}`);
  }

  return response.json(); // player profile (name, trophies, brawlers, etc.)
}
