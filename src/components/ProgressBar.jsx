import { motion } from 'framer-motion';
import styles from './ProgressBar.module.css';

const ProgressBar = ({ progress, expected, goal }) => (
    <div className={styles.wrapper}>
        <div className={styles.barContainer}>
            <motion.div
                className={styles.fill}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            {expected > 0 && expected < 100 && (
                <div
                    className={styles.pacingLine}
                    style={{ '--pacing-left': `${expected}%` }}
                />
            )}
        </div>
        <div className={styles.labelContainer}>
            <div className={styles.labels}>
                <span>0 km</span>
                <span>{goal} km</span>
            </div>

            {expected > 0 && expected < 100 && (
                <div
                    className={styles.pacingLabel}
                    style={{ '--pacing-left': `${expected}%` }}
                >
                    <span>▲</span>
                </div>
            )}
        </div>
    </div>
);

export default ProgressBar;
