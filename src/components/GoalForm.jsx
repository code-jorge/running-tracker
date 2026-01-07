import { useState } from 'react';
import { format, parse } from 'date-fns';
import Card from './Card';
import Input from './Input';
import Button from './Button';
import { FaTrophy } from 'react-icons/fa';
import styles from './GoalForm.module.css';

const GoalForm = ({ currentMonth, onSave, onCancel, initialGoal = 0 }) => {
    const [target, setTarget] = useState(initialGoal > 0 ? initialGoal : '');
    const [loading, setLoading] = useState(false);
    const isEditing = initialGoal > 0;

    // Format display date
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
        await onSave(target);
        setLoading(false);
    };

    return (
        <Card>
            <h3 className={styles.header}>
                <FaTrophy className={styles.headerIcon} /> {isEditing ? 'Edit Monthly Goal' : 'Set Monthly Goal'}
            </h3>
            <p className={styles.description}>
                {isEditing
                    ? `Update your target distance for ${formattedDate}.`
                    : `Challenge yourself! How many km do you want to run in ${formattedDate}?`
                }
            </p>
            <form onSubmit={handleSubmit}>
                <Input
                    type="number"
                    label="Target Distance (km)"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="e.g. 100"
                    required
                />
                <div className={styles.buttons}>
                    {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Saving...' : (isEditing ? 'Update Goal' : 'Set Goal')}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default GoalForm;
