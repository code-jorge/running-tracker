import { useState, useEffect } from 'react';
import { format, parse, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import Card from './Card';
import Input from './Input';
import Button from './Button';
import { SPORTS, ACTIVITY_KEYS, validActivityKey, isDistanceActivity } from '../sports';
import styles from './RunForm.module.css';

const RunForm = ({ onSave, onDelete, onCancel, initialData, currentMonth }) => {
    const monthDate = parse(currentMonth, 'yyyy-MM', new Date());
    const minDate = format(startOfMonth(monthDate), 'yyyy-MM-dd');
    const maxDate = format(endOfMonth(monthDate), 'yyyy-MM-dd');

    const getInitialDate = () => {
        if (initialData) return initialData.date;
        const today = new Date();
        if (isSameMonth(today, monthDate)) {
            return format(today, 'yyyy-MM-dd');
        }
        return minDate;
    };

    const [type, setType] = useState(validActivityKey(initialData?.type));
    const [date, setDate] = useState(getInitialDate());
    const [km, setKm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setKm(initialData.km ?? '');
            setDate(initialData.date);
            setType(validActivityKey(initialData.type));
        } else {
            setKm('');
            setDate(getInitialDate());
            setType('run');
        }
    }, [initialData, currentMonth]);

    const isEditing = !!initialData;
    const ActiveIcon = SPORTS[type].icon;
    const needsDistance = isDistanceActivity(type);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSave({
            id: initialData?.id,
            date,
            km: needsDistance ? km : 0,
            type,
        });
        setLoading(false);
    };

    const handleDelete = async () => {
        if (confirm(`Are you sure you want to delete this ${SPORTS[type].verb}?`)) {
            onDelete(initialData.id);
        }
    };

    return (
        <Card>
            <h3 className={styles.header}>
                <ActiveIcon className={styles.headerIcon} /> {isEditing ? `Edit ${SPORTS[type].label}` : `Log ${SPORTS[type].label}`}
            </h3>
            <form onSubmit={handleSubmit}>
                <div className={styles.typeSelector} role="radiogroup" aria-label="Activity type">
                    {ACTIVITY_KEYS.map((key) => {
                        const sport = SPORTS[key];
                        const Icon = sport.icon;
                        const selected = type === key;
                        return (
                            <button
                                key={key}
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                aria-label={sport.label}
                                onClick={() => setType(key)}
                                className={`${styles.typeButton} ${selected ? styles.typeButtonActive : ''}`}
                            >
                                <Icon />
                                <span>{sport.label}</span>
                            </button>
                        );
                    })}
                </div>
                <Input
                    type="date"
                    label="Date"
                    value={date}
                    min={minDate}
                    max={maxDate}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                {needsDistance && (
                    <Input
                        type="number"
                        step="0.01"
                        label="Distance (km)"
                        value={km}
                        onChange={(e) => setKm(e.target.value)}
                        placeholder="e.g. 5.2"
                        required
                    />
                )}
                <div className={styles.buttons}>

                    {isEditing && (
                        <Button
                            type="button"
                            variant="danger"
                            onClick={handleDelete}
                            className={styles.flexButton}
                        >
                            Delete
                        </Button>
                    )}

                    <Button type="submit" variant="primary" disabled={loading} className={styles.flexButton}>
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default RunForm;
