import { motion } from 'framer-motion';
import styles from './Button.module.css';

const Button = ({ children, variant = 'primary', onClick, type = 'button', disabled = false, className = '', ...props }) => {
    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.02, filter: 'brightness(1.1)' } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            className={`${styles.button} ${styles[variant]} ${className}`}
            onClick={onClick}
            type={type}
            disabled={disabled}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;
