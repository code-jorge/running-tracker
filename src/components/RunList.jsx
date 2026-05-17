import Card from './Card';
import { format } from 'date-fns';
import { FaListUl, FaCheckSquare } from 'react-icons/fa';
import { SPORTS, validActivityKey, isDistanceActivity } from '../sports';
import styles from './RunList.module.css';

const RunList = ({ runs, onRunClick }) => {
    const sortedRuns = [...runs].sort((a, b) => {
        if (a.date !== b.date) return new Date(b.date) - new Date(a.date);
        return b.timestamp - a.timestamp;
    });

    return (
        <Card>
            <h3 className={styles.header}>
                <FaListUl /> Activities
            </h3>
            {sortedRuns.length === 0 ? (
                <p className={styles.empty}>No activities logged yet this month.</p>
            ) : (
                <div className={styles.list}>
                    {sortedRuns.map((run) => {
                        const type = validActivityKey(run.type);
                        const sport = SPORTS[type];
                        const Icon = sport.icon;
                        const hasDistance = isDistanceActivity(type);
                        return (
                            <div
                                key={run.id}
                                onClick={() => onRunClick && onRunClick(run)}
                                className={`${styles.item} ${onRunClick ? styles.clickable : ''}`}
                            >
                                <div className={styles.left}>
                                    <div className={styles.icon} aria-label={sport.label}>
                                        <Icon />
                                    </div>
                                    <div>
                                        <div className={styles.date}>{format(new Date(run.date), 'MMM do')}</div>
                                        <div className={styles.day}>
                                            {format(new Date(run.date), 'EEEE')}
                                        </div>
                                    </div>
                                </div>
                                {hasDistance ? (
                                    <div className={styles.distance}>
                                        {run.km} <span className={styles.unit}>km</span>
                                    </div>
                                ) : (
                                    <FaCheckSquare className={styles.checkbox} aria-label="Visited" />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
};

export default RunList;
