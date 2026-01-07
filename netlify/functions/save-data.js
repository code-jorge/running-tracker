import { getProgressStore } from './utils';

export default async (req) => {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    const { month, data } = await req.json(); // month: "MM-YYYY", data: { goal, runs }

    if (!month || !data) {
        return new Response('Missing month or data', { status: 400 });
    }

    const store = getProgressStore();
    await store.set(month, JSON.stringify(data));

    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
    });
};
