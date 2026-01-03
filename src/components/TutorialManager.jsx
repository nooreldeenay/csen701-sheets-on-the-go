import React, { useEffect, useState } from 'react';
import { useTutorial } from '../context/TutorialContext';
import { useSheet } from '../context/SheetContext';
import { APP_VERSION } from '../constants';
import Typewriter from './Typewriter';

const TutorialManager = () => {
    const { selectedItems, toggleSelection, setTutorialData } = useSheet();
    const { appState, tutorialStep, setTutorialStep, setAppState, skipTutorial } = useTutorial();
    const [message, setMessage] = useState('');

    const [waitingForInput, setWaitingForInput] = useState(false);

    // Escape to Skip
    useEffect(() => {
        if (appState !== 'TUTORIAL') return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                console.log("Escape pressed - Skipping Tutorial");
                if (skipTutorial) skipTutorial();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [appState, skipTutorial]);

    useEffect(() => {
        if (appState !== 'TUTORIAL') return;

        // Step Orchestration
        const setStep = (step) => {
            setWaitingForInput(false);
            setMessage(''); // Clear briefly
            setTutorialStep(step);
        };

        // If we are waiting, don't change message, just wait for input
        // UNLESS we are skipping (Step 99)
        if (waitingForInput && tutorialStep !== 99) return;

        switch (tutorialStep) {
            case 0:
                setMessage(">> SYSTEM SHELL LOADED. UI SUBSYSTEMS OK.");
                setTimeout(() => setStep(1), 2000);
                break;
            case 1:
                setMessage(">> FEATURE: CONTROL PANEL\n>> THE SIDEBAR (LEFT) MANAGES YOUR MODULES.");
                setWaitingForInput(true);
                break;
            case 2:
                // Interaction Step
                setMessage(">> FEATURE: [USER_DEFINED]\n>> ACTION: OPEN THE USER_DEFINED FOLDER.");
                setWaitingForInput(false);
                break;
            case 3:
                // Interaction Step (Moved Up)
                setMessage(">> FEATURE: [TUTORIAL_BASICS]\n>> ACTION: EXPAND THE TUTORIAL_BASICS FOLDER.");
                setWaitingForInput(false);
                break;
            case 4:
                // Interaction Step
                setMessage(">> FEATURE: [MERGE_MODE]\n>> ACTION: CLICK 'MERGE_MODE' TO INITIALIZE.");
                setWaitingForInput(false);
                break;
            case 5:
                // Interaction Step
                setMessage(">> ACTION: SELECT DATA BLOCKS\n>> CLICK THE HIGHLIGHTED ITEMS ('INTRO TO NODES' & 'CODE BLOCK').");
                setWaitingForInput(false);
                break;
            case 6:
                // Interaction Step
                setMessage(">> ACTION: EXECUTE MERGE\n>> CLICK 'EXECUTE MERGE' TO COMBINE ITEMS.");
                setWaitingForInput(false);
                break;
            case 7:
                setMessage(">> FEATURE: LIVE PREVIEW\n>> GENERATED CONTENT APPEARS ON THE RIGHT.");
                setWaitingForInput(true);
                break;
            case 8:
                // New Step: Enable Modules
                setMessage(">> ACTION: ENABLE MODULES\n>> CHECK BOTH BOXES IN 'TUTORIAL_BASICS' TO ADD CONTENT.");
                setWaitingForInput(false);
                break;
            case 9:
                setMessage(">> FEATURE: [PRINT]\n>> EXPORT YOUR FINAL SHEET TO PDF.");
                setWaitingForInput(true);
                break;
            case 10:
                setMessage(">> FEATURE: KNOWLEDGE BASE\n>> LOADING FULL LECTURE CONTENT...");
                setTimeout(() => {
                    setMessage(">> SYSTEM READY. GOOD LUCK.");
                    setTimeout(() => {
                        // Cleanup
                        setTutorialData([]);
                        if (selectedItems.has('tut-1')) toggleSelection('tut-1');
                        if (selectedItems.has('tut-2')) toggleSelection('tut-2');
                        setAppState('READY');
                    }, 3000);
                }, 3000);
                setWaitingForInput(false);
                break;
            case 99: // Skip Sequence
                setMessage(">> INTERRUPT SIGNAL RECEIVED.\n>> ABORTING TUTORIAL SEQUENCE...");
                setTimeout(() => {
                    setMessage(">> LOADING FINAL CONFIGURATION...");
                    // Force reveal everything
                    setTimeout(() => {
                        // Cleanup
                        setTutorialData([]);
                        if (selectedItems.has('tut-1')) toggleSelection('tut-1');
                        if (selectedItems.has('tut-2')) toggleSelection('tut-2');

                        setAppState('READY');
                        setTutorialStep(10); // Sync step
                    }, 2000);
                }, 1500);
                setWaitingForInput(false);
                break;
            default:
                break;
        }
    }, [appState, tutorialStep, waitingForInput]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (appState === 'TUTORIAL' && waitingForInput && e.key === 'Enter') {
                // Advance to next step
                setWaitingForInput(false);
                setTutorialStep(prev => prev + 1);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [appState, waitingForInput]);

    if (appState !== 'TUTORIAL') return null;

    // ... (keep surrounding code)

    return (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-200 w-[600px] pointer-events-none">
            <div className="bg-[#0a0a0a] border border-green-500 p-4 shadow-[0_0_20px_rgba(34,197,94,0.2)] animate-in slide-in-from-bottom duration-500">
                <div className="flex items-center gap-2 mb-2 border-b border-green-900 pb-2">
                    <div className="w-3 h-3 bg-green-500 animate-pulse"></div>
                    <span className="text-xs text-green-500 font-bold tracking-widest uppercase">TUTORIAL_GUIDE_V1.0</span>
                </div>
                <div className="font-mono text-green-400 whitespace-pre-line text-sm md:text-base min-h-12">
                    <Typewriter
                        key={message} // Re-mounts on new message to restart typing
                        text={message}
                        speed={10}
                    />
                    <span className="animate-pulse">_</span>
                </div>
                {waitingForInput && (
                    <div className="mt-2 text-[10px] text-green-700 font-mono animate-pulse uppercase">
                        [PRESS ENTER TO CONTINUE]
                    </div>
                )}

                {/* Skip Hint */}
                <div className="absolute -bottom-6 right-0 text-[10px] text-green-800 font-mono animate-pulse">
                    [ ESC TO SKIP TUTORIAL ]
                </div>
            </div>
        </div>
    );
};

export default TutorialManager;
