import { FaRunning, FaBicycle, FaSwimmer } from 'react-icons/fa';

export const SPORTS = {
    run: { key: 'run', label: 'Run', verb: 'run', gerund: 'Running', icon: FaRunning },
    cycle: { key: 'cycle', label: 'Cycle', verb: 'cycle', gerund: 'Cycling', icon: FaBicycle },
    swim: { key: 'swim', label: 'Swim', verb: 'swim', gerund: 'Swimming', icon: FaSwimmer },
};

export const SPORT_KEYS = ['run', 'cycle', 'swim'];

export const validSportKey = (type) => (SPORT_KEYS.includes(type) ? type : 'run');

export const normalizeGoal = (goal) => {
    if (typeof goal === 'number') {
        return SPORT_KEYS.reduce((acc, k) => ({ ...acc, [k]: k === 'run' ? goal : 0 }), {});
    }
    return SPORT_KEYS.reduce((acc, k) => ({ ...acc, [k]: Number(goal?.[k]) || 0 }), {});
};

export const normalizeRun = (run) => ({
    ...run,
    type: validSportKey(run.type),
});
