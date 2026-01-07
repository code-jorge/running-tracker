export const getDashboardData = async (month) => {
    try {
        const res = await fetch(`/.netlify/functions/get-dashboard-data?month=${month}`);
        if (res.ok) {
            return await res.json();
        }
    } catch (error) {
        console.error('Failed to fetch data', error);
    }
    return null;
};

export const saveDashboardData = async (month, data) => {
    try {
        await fetch('/.netlify/functions/save-data', {
            method: 'POST',
            body: JSON.stringify({ month, data }),
            headers: { 'Content-Type': 'application/json' }
        });
        return true;
    } catch (error) {
        console.error('Failed to save data', error);
        return false;
    }
};
