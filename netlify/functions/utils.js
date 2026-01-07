import { getStore } from '@netlify/blobs';

export const getProgressStore = () => getStore({ name: 'progress' });
