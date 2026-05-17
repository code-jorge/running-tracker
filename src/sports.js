import { FaRunning, FaBicycle, FaSwimmer, FaDumbbell } from 'react-icons/fa';

export const SPORTS = {
    run: { key: 'run', label: 'Run', verb: 'run', gerund: 'Running', icon: FaRunning },
    cycle: { key: 'cycle', label: 'Cycle', verb: 'cycle', gerund: 'Cycling', icon: FaBicycle },
    swim: { key: 'swim', label: 'Swim', verb: 'swim', gerund: 'Swimming', icon: FaSwimmer },
    gym: { key: 'gym', label: 'Gym', verb: 'gym session', gerund: 'Gym training', icon: FaDumbbell },
};

export const SPORT_KEYS = ['run', 'cycle', 'swim'];
export const ACTIVITY_KEYS = [...SPORT_KEYS, 'gym'];

export const validSportKey = (type) => (SPORT_KEYS.includes(type) ? type : 'run');
export const validActivityKey = (type) => (ACTIVITY_KEYS.includes(type) ? type : 'run');

export const isDistanceActivity = (type) => SPORT_KEYS.includes(validActivityKey(type));

export const normalizeGoal = (goal) => {
    if (typeof goal === 'number') {
        return SPORT_KEYS.reduce((acc, k) => ({ ...acc, [k]: k === 'run' ? goal : 0 }), {});
    }
    return SPORT_KEYS.reduce((acc, k) => ({ ...acc, [k]: Number(goal?.[k]) || 0 }), {});
};

export const normalizeRun = (run) => ({
    ...run,
    type: validActivityKey(run.type),
});
