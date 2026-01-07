import Card from './Card';
import { format } from 'date-fns';
import { FaRunning } from 'react-icons/fa';
import styles from './RunList.module.css';

const RunList = ({ runs, onRunClick }) => {
    // Sort detailed runs by date desc, then timestamp desc
    const sortedRuns = [...runs].sort((a, b) => {
        if (a.date !== b.date) return new Date(b.date) - new Date(a.date);
        return b.timestamp - a.timestamp;
    });

    return (
        <Card>
            <h3 className={styles.header}>
                <FaRunning /> Activities
            </h3>
            {sortedRuns.length === 0 ? (
                <p className={styles.empty}>No runs logged yet this month.</p>
            ) : (
                <div className={styles.list}>
                    {sortedRuns.map((run) => (
                        <div
                            key={run.id}
                            onClick={() => onRunClick && onRunClick(run)}
                            className={`${styles.item} ${onRunClick ? styles.clickable : ''}`}
                        >
                            <div>
                                <div className={styles.date}>{format(new Date(run.date), 'MMM do')}</div>
                                <div className={styles.day}>
                                    {format(new Date(run.date), 'EEEE')}
                                </div>
                            </div>
                            <div className={styles.distance}>
                                {run.km} <span className={styles.unit}>km</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default RunList;
