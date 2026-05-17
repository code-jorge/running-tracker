import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, getDaysInMonth, getDate, isSameMonth, isBefore } from 'date-fns';
import { FaPlus, FaCog, FaChevronLeft, FaChevronRight, FaDumbbell } from 'react-icons/fa';
import Card from './components/Card';
import Button from './components/Button';
import ProgressBar from './components/ProgressBar';
import RunList from './components/RunList';
import RunForm from './components/RunForm';
import GoalForm from './components/GoalForm';
import Modal from './components/Modal';
import { getDashboardData, saveDashboardData } from './api';
import { SPORTS, SPORT_KEYS, normalizeGoal, normalizeRun, validActivityKey } from './sports';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [view, setView] = useState('dashboard');
    const [data, setData] = useState({ goal: normalizeGoal(0), runs: [] });
    const [loading, setLoading] = useState(true);
    const [selectedRun, setSelectedRun] = useState(null);

    const [selectedDate, setSelectedDate] = useState(new Date());

    const currentMonthStr = format(selectedDate, 'yyyy-MM');
    const monthKey = format(selectedDate, 'MM-yyyy');
    const monthName = format(selectedDate, 'MMMM yyyy');
    const isCurrentActualMonth = isSameMonth(selectedDate, new Date());

    const fetchData = async () => {
        setLoading(true);
        const json = await getDashboardData(currentMonthStr);
        if (json) {
            setData({
                goal: normalizeGoal(json.goal),
                runs: (json.runs || []).map(normalizeRun),
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [currentMonthStr]);

    const handlePrevMonth = () => setSelectedDate(prev => subMonths(prev, 1));
    const handleNextMonth = () => setSelectedDate(prev => addMonths(prev, 1));

    const handleGoalSave = async (newGoal) => {
        const newData = { ...data, goal: normalizeGoal(newGoal) };
        setData(newData);
        await saveDashboardData(monthKey, newData);
        setView('dashboard');
    };

    const handleRunSave = async (runData) => {
        const type = validActivityKey(runData.type);
        let newRuns = [...data.runs];
        const existingIndex = newRuns.findIndex(r => r.id === runData.id);

        if (type === 'gym' && existingIndex < 0) {
            const duplicate = newRuns.some(r => r.type === 'gym' && r.date === runData.date);
            if (duplicate) {
                setView('dashboard');
                setSelectedRun(null);
                return;
            }
        }

        const processedRun = {
            id: runData.id || `run-${Date.now()}`,
            date: runData.date,
            km: type === 'gym' ? 0 : parseFloat(runData.km),
            type,
            timestamp: runData.timestamp || Date.now(),
        };

        if (existingIndex >= 0) {
            newRuns[existingIndex] = processedRun;
        } else {
            newRuns.push(processedRun);
        }

        const newData = { ...data, runs: newRuns };
        setData(newData);
        await saveDashboardData(monthKey, newData);

        setView('dashboard');
        setSelectedRun(null);
    };

    const handleRunDelete = async (runId) => {
        const newRuns = data.runs.filter(r => r.id !== runId);
        const newData = { ...data, runs: newRuns };
        setData(newData);
        await saveDashboardData(monthKey, newData);
        setView('dashboard');
        setSelectedRun(null);
    };

    // --- Computed values ---

    const totals = SPORT_KEYS.reduce((acc, key) => {
        acc[key] = data.runs
            .filter(r => r.type === key)
            .reduce((sum, r) => sum + (parseFloat(r.km) || 0), 0);
        return acc;
    }, {});

    const gymDays = new Set(
        data.runs.filter(r => r.type === 'gym').map(r => r.date)
    ).size;

    const activeSports = SPORT_KEYS.filter(k => (data.goal[k] || 0) > 0);
    const hasAnyGoal = activeSports.length > 0;

    let expectedProgress = 0;
    if (hasAnyGoal) {
        if (isCurrentActualMonth) {
            const daysInMonth = getDaysInMonth(selectedDate);
            const dayOfMonth = getDate(new Date());
            expectedProgress = (dayOfMonth / daysInMonth) * 100;
        } else if (isBefore(selectedDate, startOfMonth(new Date()))) {
            expectedProgress = 100;
        }
    }

    if (loading && !hasAnyGoal && data.runs.length === 0) {
        return <div className={styles.loading}>Loading...</div>;
    }

    const sportStats = (key) => {
        const goal = data.goal[key] || 0;
        const total = totals[key] || 0;
        return {
            goal,
            total,
            percent: goal > 0 ? (total / goal) * 100 : 0,
            expectedKm: (expectedProgress / 100) * goal,
        };
    };

    const renderSportHeader = (key) => {
        const sport = SPORTS[key];
        const Icon = sport.icon;
        const { percent } = sportStats(key);
        return (
            <div key={key} className={styles.percentageWrapper}>
                <Icon className={styles.percentageIcon} aria-label={sport.label} />
                <span className={styles.percentageText}>{Math.round(percent)}%</span>
            </div>
        );
    };

    const renderSportBox = (key) => {
        const sport = SPORTS[key];
        const Icon = sport.icon;
        const { percent } = sportStats(key);
        return (
            <div key={key} className={styles.percentageBox}>
                <Icon className={styles.boxIcon} aria-label={sport.label} />
                <span className={styles.boxPercent}>{Math.round(percent)}%</span>
            </div>
        );
    };

    const renderGymBox = () => (
        <div key="gym" className={styles.percentageBox}>
            <FaDumbbell className={styles.boxIcon} aria-label="Gym" />
            <span className={styles.boxPercent}>{gymDays}d</span>
        </div>
    );

    const renderSportRow = (key) => {
        const sport = SPORTS[key];
        const { goal, total, percent, expectedKm } = sportStats(key);
        const isAhead = total >= goal || total >= expectedKm;
        return (
            <div key={key} className={styles.statsBox}>
                <div className={styles.statsHeader}>
                    <div className={styles.statsLeft}>
                        <div className={styles.label}>{sport.gerund} progress</div>
                        <div className={styles.value}>
                            {total.toFixed(1)} <span className={styles.subValue}>/ {goal} km</span>
                        </div>
                    </div>
                    <div className={styles.statsRight}>
                        <div className={styles.label}>Status</div>
                        <div className={`${styles.statusValue} ${isAhead ? styles.statusGreen : styles.statusYellow}`}>
                            {total >= goal ? (
                                <span>Goal completed!</span>
                            ) : total >= expectedKm ? (
                                <span>+{(total - expectedKm).toFixed(1)} km ahead</span>
                            ) : (
                                <span>{(expectedKm - total).toFixed(1)} km behind</span>
                            )}
                        </div>
                    </div>
                </div>
                <ProgressBar progress={percent} expected={expectedProgress} goal={goal} />
            </div>
        );
    };

    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <Button variant="secondary" onClick={handlePrevMonth} className={styles.navButton}><FaChevronLeft /></Button>
                <div className={styles.headerCenter}>
                    <h1 className={styles.headerTitle}>{monthName}</h1>
                </div>
                <Button variant="secondary" onClick={handleNextMonth} className={styles.navButton}><FaChevronRight /></Button>
            </header>

            <div className={styles.content}>

                <Card className={styles.progressCard}>
                    {(hasAnyGoal || gymDays > 0) && (
                        <div className={styles.percentageContainer}>
                            {activeSports.length === 1 && gymDays === 0 ? (
                                activeSports.map(renderSportHeader)
                            ) : (
                                <div className={`${styles.percentageRow} ${activeSports.length + (gymDays > 0 ? 1 : 0) >= 4 ? styles.percentageGrid : ''}`}>
                                    {activeSports.map(renderSportBox)}
                                    {gymDays > 0 && renderGymBox()}
                                </div>
                            )}
                            {activeSports.map(renderSportRow)}
                        </div>
                    )}
                    {!hasAnyGoal && (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyStateText}>No goal set for this month.</p>
                            <Button variant="primary" onClick={() => setView('set-goal')}>Set Goal</Button>
                        </div>
                    )}
                </Card>

                <div className={styles.runListContainer}>
                    <RunList runs={data.runs} onRunClick={(run) => { setSelectedRun(run); setView('edit-run'); }} />
                </div>

                <div className={styles.bottomActions}>
                    <Button variant="primary" onClick={() => { setSelectedRun(null); setView('add-run'); }}>
                        <FaPlus /> Log Activity
                    </Button>
                    <Button variant="secondary" onClick={() => setView('set-goal')}>
                        <FaCog /> Goal Settings
                    </Button>
                </div>
            </div>

            <Modal
                isOpen={view === 'add-run' || view === 'set-goal' || view === 'edit-run'}
                onClose={() => {
                    setView('dashboard');
                    setSelectedRun(null);
                }}
            >
                {(view === 'add-run' || view === 'edit-run') && (
                    <RunForm
                        onSave={handleRunSave}
                        onDelete={handleRunDelete}
                        onCancel={() => { setView('dashboard'); setSelectedRun(null); }}
                        initialData={selectedRun}
                        currentMonth={currentMonthStr}
                    />
                )}

                {view === 'set-goal' && (
                    <GoalForm
                        currentMonth={currentMonthStr}
                        onSave={handleGoalSave}
                        onCancel={() => setView('dashboard')}
                        initialGoal={data.goal}
                    />
                )}
            </Modal>
        </div>
    );
};

export default Dashboard;
