import React, { createContext, useContext, useState, useEffect } from 'react';

const TutorialContext = createContext();

export const TutorialProvider = ({ children }) => {
    // App States: 'BOOTING', 'PROMPT', 'TUTORIAL', 'READY'
    const [appState, setAppState] = useState('BOOTING');

    // Tutorial Steps:
    // 0: Init (Blank)
    // 1: Sidebar Intro
    // 0: Init
    // 1: Sidebar Intro
    // 2: Expand Custom (Action: Expand 'custom')
    // 3: Expand Tutorial Folder (Action: Expand 'tut-basics')
    // 4: Merge Mode Trigger (Action: Click Merge)
    // 5: Select Items for Merge (Action: Select items)
    // 6: Merge Execute (Action: Click Execute)
    // 7: Preview Reveal (Wait for Enter)
    // 8: Enable Modules (Action: Select both 'tut-1' and 'tut-2')
    // 9: Print Trigger
    // 10: End
    // 99: Skipping Sequence
    const [tutorialStep, setTutorialStep] = useState(0);

    const skipTutorial = () => {
        setTutorialStep(99);
    };

    const handleTutorialAction = (action, payload) => {
        if (appState !== 'TUTORIAL') return;

        switch (tutorialStep) {
            case 2: // Expand Custom
                if (action === 'EXPAND_CUSTOM') setTutorialStep(3);
                break;
            case 3: // Expand Tutorial Folder (NEW)
                if (action === 'EXPAND_TUTORIAL') setTutorialStep(4);
                break;
            case 4: // Toggle Merge
                if (action === 'TOGGLE_MERGE') setTutorialStep(5);
                break;
            case 5: // Select Items for Merge
                if (action === 'SELECT_ITEM') {
                    if (payload >= 2) setTutorialStep(6);
                }
                break;
            case 6: // Confirm Merge
                if (action === 'CONFIRM_MERGE') setTutorialStep(7);
                break;
            case 8: // Enable Modules
                if (action === 'SELECT_TUTORIAL_ITEM') {
                    // Check logic
                    const has1 = payload.includes('tut-1');
                    const has2 = payload.includes('tut-2');
                    if (has1 && has2) setTutorialStep(9);
                }
                break;
            default:
                break;
        }
    };

    // Controls what functionalities are visible/active
    const value = {
        appState,
        setAppState,
        tutorialStep,
        setTutorialStep,
        handleTutorialAction,
        skipTutorial,

        // Helper booleans for UI consumption
        showSidebar: appState === 'READY' || (appState === 'TUTORIAL' && tutorialStep >= 1),

        // Sidebar Mode Logic
        sidebarMode: (appState === 'READY' || (appState === 'TUTORIAL' && tutorialStep >= 10))
            ? 'FULL'
            : (tutorialStep >= 2 ? 'PARTIAL' : (tutorialStep >= 1 ? 'EXAMPLE' : 'HIDDEN')),

        showPreview: appState === 'READY' || (appState === 'TUTORIAL' && tutorialStep >= 7 && tutorialStep !== 99),
    };

    return (
        <TutorialContext.Provider value={value}>
            {children}
        </TutorialContext.Provider>
    );
};

export const useTutorial = () => {
    const context = useContext(TutorialContext);
    if (!context) throw new Error('useTutorial must be used within a TutorialProvider');
    return context;
};
