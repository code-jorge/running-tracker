import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, getDaysInMonth, getDate, isSameMonth, isBefore, parse } from 'date-fns';
import { FaPlus, FaCog, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Card from './components/Card';
import Button from './components/Button';
import ProgressBar from './components/ProgressBar';
import RunList from './components/RunList';
import RunForm from './components/RunForm';
import GoalForm from './components/GoalForm';
import Modal from './components/Modal';
import { getDashboardData, saveDashboardData } from './api';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [view, setView] = useState('dashboard'); // dashboard, add-run, set-goal, edit-run
    const [data, setData] = useState({ goal: 0, runs: [] });
    const [loading, setLoading] = useState(true);
    const [selectedRun, setSelectedRun] = useState(null);

    // State for currently selected month
    const [selectedDate, setSelectedDate] = useState(new Date());

    const currentMonthStr = format(selectedDate, 'yyyy-MM');
    const monthKey = format(selectedDate, 'MM-yyyy'); // Key for backend
    const monthName = format(selectedDate, 'MMMM yyyy');
    const isCurrentActualMonth = isSameMonth(selectedDate, new Date());

    const fetchData = async () => {
        setLoading(true);
        const json = await getDashboardData(currentMonthStr);
        if (json) {
            setData(json);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [currentMonthStr]);

    const handlePrevMonth = () => setSelectedDate(prev => subMonths(prev, 1));
    const handleNextMonth = () => setSelectedDate(prev => addMonths(prev, 1));

    // --- State Handlers ---

    const handleGoalSave = async (newGoal) => {
        const newData = { ...data, goal: parseFloat(newGoal) };
        setData(newData); // Optimistic update
        await saveDashboardData(monthKey, newData);
        setView('dashboard');
    };

    const handleRunSave = async (runData) => {
        // runData: { id?, date, km }
        // Note: UI restricts date to current month, so we don't need to handle cross-month moves anymore.

        let newRuns = [...data.runs];
        const existingIndex = newRuns.findIndex(r => r.id === runData.id);

        const processedRun = {
            id: runData.id || `run-${Date.now()}`, // Ensure ID
            date: runData.date,
            km: parseFloat(runData.km), // Ensure number
            type: 'run',
            timestamp: runData.timestamp || Date.now()
        };

        if (existingIndex >= 0) {
            newRuns[existingIndex] = processedRun;
        } else {
            newRuns.push(processedRun);
        }

        const newData = { ...data, runs: newRuns };
        setData(newData); // Optimistic update
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


    // --- Render Helpers ---

    const totalKm = data.runs.reduce((acc, run) => acc + (parseFloat(run.km) || 0), 0);
    const progressPercent = data.goal > 0 ? (totalKm / data.goal) * 100 : 0;
    const remaining = Math.max((data.goal || 0) - totalKm, 0);

    // Pacing Logic ... (Same as before)
    let expectedProgress = 0;
    if (data.goal > 0) {
        if (isCurrentActualMonth) {
            const daysInMonth = getDaysInMonth(selectedDate);
            const dayOfMonth = getDate(new Date());
            expectedProgress = (dayOfMonth / daysInMonth) * 100;
        } else if (isBefore(selectedDate, startOfMonth(new Date()))) {
            expectedProgress = 100;
        } else {
            expectedProgress = 0;
        }
    }

    if (loading && !data.goal && data.runs.length === 0) {
        return <div className={styles.loading}>Loading...</div>;
    }

    const isAhead = totalKm >= data.goal || totalKm >= (expectedProgress / 100 * data.goal);

    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <Button variant="secondary" onClick={handlePrevMonth} className={styles.navButton}><FaChevronLeft /></Button>
                <div style={{ textAlign: 'center' }}>
                    <h1 className={styles.headerTitle}>{monthName}</h1>
                </div>
                <Button variant="secondary" onClick={handleNextMonth} className={styles.navButton}><FaChevronRight /></Button>
            </header>

            {/* Dashboard Content - Always Visible */}
            <div className={styles.content}>

                <Card className={styles.progressCard}>
                    {data.goal > 0 ? (
                        <div className={styles.percentageContainer}>
                            <div className={styles.percentageWrapper}>
                                <span className={styles.percentageText}>
                                    {Math.round(progressPercent)}%
                                </span>
                            </div>

                            <ProgressBar progress={progressPercent} expected={expectedProgress} goal={data.goal} />

                            <div className={styles.statsBox}>
                                <div className={styles.statsLeft}>
                                    <div className={styles.label}>Progress</div>
                                    <div className={styles.value}>
                                        {totalKm.toFixed(1)} <span className={styles.subValue}>/ {data.goal} km</span>
                                    </div>
                                </div>
                                <div className={styles.statsRight}>
                                    <div className={styles.label}>Status</div>
                                    <div className={`${styles.statusValue} ${isAhead ? styles.statusGreen : styles.statusYellow}`}>
                                        {totalKm >= data.goal ? (
                                            <span>Goal completed!</span>
                                        ) : totalKm >= (expectedProgress / 100 * data.goal) ? (
                                            <span>+{((totalKm - (expectedProgress / 100 * data.goal))).toFixed(1)} km ahead</span>
                                        ) : (
                                            <span>{((expectedProgress / 100 * data.goal) - totalKm).toFixed(1)} km behind</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyStateText}>No goal set for this month.</p>
                            <Button variant="primary" onClick={() => setView('set-goal')}>Set Goal</Button>
                        </div>
                    )}
                </Card>

                {data.goal > 0 && (
                    <>
                        <div className={styles.runListContainer}>
                            <RunList runs={data.runs} onRunClick={(run) => { setSelectedRun(run); setView('edit-run'); }} />
                        </div>

                        {/* Bottom Action Area */}
                        <div className={styles.bottomActions}>
                            <Button variant="primary" onClick={() => { setSelectedRun(null); setView('add-run'); }}>
                                <FaPlus /> Log Run
                            </Button>
                            <Button variant="secondary" onClick={() => setView('set-goal')}>
                                <FaCog /> Goal Settings
                            </Button>
                        </div>
                    </>
                )}
            </div>

            {/* Modal Overlay */}
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
