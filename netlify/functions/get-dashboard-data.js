import { getProgressStore } from './utils';

export default async (req) => {
    const url = new URL(req.url);
    const monthParam = url.searchParams.get('month'); // YYYY-MM (e.g., 2026-01)

    if (!monthParam) {
        return new Response('Missing month parameter', { status: 400 });
    }

    // Convert YYYY-MM to MM-YYYY for storage key
    const [year, month] = monthParam.split('-');
    const key = `${month}-${year}`;

    const store = getProgressStore();
    const data = await store.get(key, { type: 'json' });

    // Default structure if not found
    const responseData = data || { goal: 0, runs: [] };

    return new Response(JSON.stringify(responseData), {
        headers: { 'Content-Type': 'application/json' },
    });
};
