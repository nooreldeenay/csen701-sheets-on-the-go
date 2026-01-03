import React, { useState, useEffect, useRef } from 'react';
import { useTutorial } from '../context/TutorialContext';
import Typewriter from './Typewriter';

const BootSequence = () => {
    const { setAppState, setTutorialStep } = useTutorial();
    const [displayedLines, setDisplayedLines] = useState([]);
    const [isPromptVisible, setIsPromptVisible] = useState(false);
    const [promptTextStarted, setPromptTextStarted] = useState(false);
    const [input, setInput] = useState('');
    const containerRef = useRef(null);
    const sequenceStarted = useRef(false);
    const skippedRef = useRef(false);

    // Determines the sequence of logs
    const bootLogs = [
        "BIOS DATE 01/01/99 14:22:54 VER 1.0.2",
        "CPU: NEC V60 @ 16MHz",
        "640K RAM SYSTEM ... OK",
        "INITIALIZING VIDEO ADAPTER ... OK",
        "LOADING KERNEL ... OK",
        "MOUNTING VOLUMES ...",
        "  > /dev/sda1 [CORE]",
        "  > /dev/sda2 [USER]",
        "CHECKING INTEGRITY ... COMPLETED",
        "ESTABLISHING SECURE CONNECTION ... ",
        "CONNECTION ESTABLISHED.",
        "SYSTEM READY."
    ];

    // Scroll to bottom whenever lines change
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [displayedLines, isPromptVisible]);

    // Initial Start
    useEffect(() => {
        if (!sequenceStarted.current) {
            sequenceStarted.current = true;
            addNextLine(0);
        }
    }, []);

    const addNextLine = (index) => {
        if (skippedRef.current) return; // Stop if skipped

        if (index >= bootLogs.length) {
            // Sequence finished
            setTimeout(() => setIsPromptVisible(true), 500);
            return;
        }

        const newLine = {
            id: index,
            text: bootLogs[index],
            timestamp: new Date().toLocaleTimeString(),
            completed: false
        };

        setDisplayedLines(prev => [...prev, newLine]);
    };

    const handleLineComplete = (index) => {
        if (skippedRef.current) return; // Stop if skipped

        // Mark line as completed
        setDisplayedLines(prev => prev.map(line =>
            line.id === index ? { ...line, completed: true } : line
        ));

        const randomDelay = Math.random() * 400 + 50;
        setTimeout(() => {
            addNextLine(index + 1);
        }, randomDelay);
    };

    useEffect(() => {
        const handleSkip = (e) => {
            if (isPromptVisible) return;
            if (e.key === 'Escape' || e.key === ' ') {
                skippedRef.current = true; // Flag to stop recursion

                const allCompleted = bootLogs.map((text, i) => ({
                    id: i,
                    text,
                    timestamp: new Date().toLocaleTimeString(),
                    completed: true
                }));
                setDisplayedLines(allCompleted);
                setIsPromptVisible(true);
                setPromptTextStarted(true);
            }
        };

        window.addEventListener('keydown', handleSkip);
        return () => window.removeEventListener('keydown', handleSkip);
    }, [isPromptVisible]);


    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const val = input.trim().toLowerCase();
            if (val === 'y' || val === 'yes') {
                setAppState('TUTORIAL');
                setTutorialStep(0);
            } else {
                setAppState('READY');
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex flex-col items-center justify-center font-mono">
            <div className="w-[800px] h-[600px] bg-black border border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.2)] p-6 flex flex-col relative overflow-hidden">

                {/* Scanlines effect */}
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] z-10"></div>

                {/* Header */}
                <div className="flex justify-between items-center border-b border-green-900 pb-2 mb-4">
                    <span className="text-green-500 font-bold"> BOOT_SEQUENCE.EXE</span>
                    <span className="text-green-700 text-xs">MEM: 640K OK</span>
                </div>

                <div className="flex-1 overflow-y-auto z-20 scrollbar-none" ref={containerRef}>
                    {displayedLines.map((line) => (
                        <div key={line.id} className="mb-1 text-sm md:text-base text-green-500">
                            <span className="opacity-50 mr-2 text-green-700">[{line.timestamp}]</span>
                            {/* Only use Typewriter if not completed. Once completed, show full text static for performance & stability */}
                            {line.completed ? (
                                <span>{line.text}</span>
                            ) : (
                                <Typewriter
                                    text={line.text}
                                    speed={10} // Faster speed as requested
                                    onComplete={() => handleLineComplete(line.id)}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {isPromptVisible && (
                    <div className="mt-4 border-t border-green-900 pt-4 animate-in fade-in duration-500">
                        <p className="mb-2 text-lg font-bold text-green-500">
                            <span className="mr-2"></span>
                            <Typewriter
                                text="INITIALIZE TUTORIAL PROTOCOL? [Y/N]"
                                speed={5}
                                onComplete={() => setPromptTextStarted(true)}
                            />
                        </p>
                        {promptTextStarted && (
                            <div className="flex items-center gap-2 animate-in fade-in duration-300">
                                <span className="text-green-500">&gt;</span>
                                <input
                                    autoFocus
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value.toUpperCase())}
                                    onKeyDown={handleKeyDown}
                                    className="bg-transparent border-none outline-none text-green-500 font-bold caret-green-500 w-full uppercase"
                                    maxLength={3}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Skip Hint */}
            {!isPromptVisible && (
                <div className="mt-4 text-green-700 text-xs animate-pulse opacity-50 font-mono">
                    [ PRESS ESC TO SKIP BOOT SEQUENCE ]
                </div>
            )}
        </div>
    );
};

export default BootSequence;

