import { motion } from 'framer-motion';

const ProgressRing = ({ radius = 80, stroke = 12, progress = 0 }) => {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <svg
                height={radius * 2}
                width={radius * 2}
                style={{ transform: 'rotate(-90deg)' }}
            >
                <circle
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth={stroke}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <motion.circle
                    stroke="var(--accent)"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    style={{
                        strokeDasharray: `${circumference} ${circumference}`,
                        filter: 'drop-shadow(0 0 8px var(--accent-glow))'
                    }}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{Math.round(progress)}%</h2>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>completed</span>
            </div>
        </div>
    );
};

export default ProgressRing;
