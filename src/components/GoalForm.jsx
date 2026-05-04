import { useState } from 'react';
import { format, parse } from 'date-fns';
import Card from './Card';
import Input from './Input';
import Button from './Button';
import { FaTrophy } from 'react-icons/fa';
import { SPORTS, SPORT_KEYS, normalizeGoal } from '../sports';
import styles from './GoalForm.module.css';

const GoalForm = ({ currentMonth, onSave, onCancel, initialGoal = 0 }) => {
    const initial = normalizeGoal(initialGoal);
    const [targets, setTargets] = useState(
        SPORT_KEYS.reduce(
            (acc, key) => ({ ...acc, [key]: initial[key] > 0 ? String(initial[key]) : '' }),
            {}
        )
    );
    const [loading, setLoading] = useState(false);
    const isEditing = SPORT_KEYS.some((key) => initial[key] > 0);

    let formattedDate = currentMonth;
    try {
        const dateObj = parse(currentMonth, 'yyyy-MM', new Date());
        formattedDate = format(dateObj, 'MMMM yyyy');
    } catch (e) {
        console.error('Date parsing error', e);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSave(
            SPORT_KEYS.reduce(
                (acc, key) => ({ ...acc, [key]: parseFloat(targets[key]) || 0 }),
                {}
            )
        );
        setLoading(false);
    };

    const hasAnyTarget = SPORT_KEYS.some((key) => (parseFloat(targets[key]) || 0) > 0);

    return (
        <Card>
            <h3 className={styles.header}>
                <FaTrophy className={styles.headerIcon} /> {isEditing ? 'Edit Monthly Goal' : 'Set Monthly Goal'}
            </h3>
            <p className={styles.description}>
                {isEditing
                    ? `Update your targets for ${formattedDate}.`
                    : `Challenge yourself! Set how many km you want for ${formattedDate}. Leave a sport at 0 to skip it.`
                }
            </p>
            <form onSubmit={handleSubmit}>
                {SPORT_KEYS.map((key) => {
                    const sport = SPORTS[key];
                    const Icon = sport.icon;
                    return (
                        <Input
                            key={key}
                            type="number"
                            step="0.1"
                            min="0"
                            label={
                                <span className={styles.sportLabel}>
                                    <Icon /> {sport.label} target (km)
                                </span>
                            }
                            value={targets[key]}
                            onChange={(e) => setTargets((t) => ({ ...t, [key]: e.target.value }))}
                            placeholder="e.g. 100"
                        />
                    );
                })}
                <div className={styles.buttons}>
                    {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
                    <Button type="submit" variant="primary" disabled={loading || !hasAnyTarget}>
                        {loading ? 'Saving...' : (isEditing ? 'Update Goal' : 'Set Goal')}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default GoalForm;
