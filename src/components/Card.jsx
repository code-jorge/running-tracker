import { motion } from 'framer-motion';
import styles from './Card.module.css';

const Card = ({ children, className = '', ...props }) => (
    <motion.div
        className={`${styles.card} ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        {...props}
    >
        {children}
    </motion.div>
);

export default Card;
