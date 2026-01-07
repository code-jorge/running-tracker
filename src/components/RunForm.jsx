import { useState, useEffect } from 'react';
import { format, parse, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import Card from './Card';
import Input from './Input';
import Button from './Button';
import { FaRunning } from 'react-icons/fa';
import styles from './RunForm.module.css';

const RunForm = ({ onSave, onDelete, onCancel, initialData, currentMonth }) => {
    // Parse current month limits
    const monthDate = parse(currentMonth, 'yyyy-MM', new Date());
    const minDate = format(startOfMonth(monthDate), 'yyyy-MM-dd');
    const maxDate = format(endOfMonth(monthDate), 'yyyy-MM-dd');

    // Determine initial date
    const getInitialDate = () => {
        if (initialData) return initialData.date;

        const today = new Date();
        if (isSameMonth(today, monthDate)) {
            return format(today, 'yyyy-MM-dd');
        }
        return minDate;
    };

    const [date, setDate] = useState(getInitialDate());
    const [km, setKm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setKm(initialData.km);
            setDate(initialData.date);
        } else {
            setKm('');
            setDate(getInitialDate());
        }
    }, [initialData, currentMonth]);

    const isEditing = !!initialData;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        await onSave({
            id: initialData?.id,
            date,
            km
        });

        setLoading(false);
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this run?')) {
            onDelete(initialData.id);
        }
    };

    return (
        <Card>
            <h3 className={styles.header}>
                <FaRunning style={{ color: 'var(--accent)' }} /> {isEditing ? 'Edit Run' : 'Log Run'}
            </h3>
            <form onSubmit={handleSubmit}>
                <Input
                    type="date"
                    label="Date"
                    value={date}
                    min={minDate}
                    max={maxDate}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <Input
                    type="number"
                    step="0.01"
                    label="Distance (km)"
                    value={km}
                    onChange={(e) => setKm(e.target.value)}
                    placeholder="e.g. 5.2"
                    required
                />
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
