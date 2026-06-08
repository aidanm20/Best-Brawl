import { getPlayers } from '../lib/db.js';

export async function handleHealth(request, env) {
    try {
        const players = await getPlayers(env);
        return new Response(JSON.stringify({
            players: players.map(p => ({ tag: p.tag, name: p.name, last_polled_at: p.last_polled_at }))
        }), { headers: { 'Content-Type': 'application/json' } });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
