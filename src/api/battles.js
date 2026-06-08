import { upsertPlayer, getBattles } from '../lib/db.js';
import { getPlayer } from '../lib/brawlstars.js';

 

//env, tag, limit

const JSON_HEADERS = { 'Content-Type': 'application/json' };

export async function handlePlayers(request, env) {
    try {
        const body = await request.json();
        const tag = body.tag;
        if (!tag) {
            return new Response(JSON.stringify({ error: 'tag is required' }), { status: 400, headers: JSON_HEADERS });
        }
        const player = await getPlayer(tag, env.BRAWL_API_KEY);
        const playerData = await upsertPlayer(env, tag, player.name);
        return new Response(JSON.stringify(playerData), { headers: JSON_HEADERS });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: JSON_HEADERS });
    }
}

export async function handleBattles(request, env) {
    try {
        const url = new URL(request.url); 
        const tag = decodeURIComponent(url.pathname.split('/')[3]);
        const limit = url.searchParams.get('limit') || 100;
        const battles = await getBattles(env, tag, limit);
        return new Response(JSON.stringify(battles), { headers: JSON_HEADERS });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: JSON_HEADERS });
    }
}

