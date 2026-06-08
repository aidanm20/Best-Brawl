/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import {handlePlayers, handleBattles} from './api/battles.js';
import { handleHealth } from './api/health.js';
import { runPoller } from './poller.js';

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		if (url.pathname === '/api/players' && request.method === 'POST') {
			return await handlePlayers(request, env)
		}
		if (url.pathname.startsWith('/api/battles/' )  && request.method === 'GET') {
			return await handleBattles(request, env)
		}
		if (url.pathname === '/api/health' && request.method === 'GET') {
			return await handleHealth(request, env)
		}
		return new Response('Not found', { status: 404})
	},
	async scheduled(event, env, ctx) {
		return await runPoller(env);
	},
};

