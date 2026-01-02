import React, { useState, useEffect, useRef } from 'react';

const Typewriter = ({ text, speed = 10, delay = 0, onComplete, className = '' }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [started, setStarted] = useState(false);
    const indexRef = useRef(0);

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            setStarted(true);
        }, delay);
        return () => clearTimeout(startTimeout);
    }, [delay]);

    useEffect(() => {
        if (!started) return;
        if (!text) return;

        indexRef.current = 0;
        setDisplayedText('');

        const interval = setInterval(() => {
            if (indexRef.current < text.length) {
                // Random chunk size between 1 and 4 characters for a more "data dump" feel
                const chunkSize = Math.floor(Math.random() * 3) + 2;
                const nextIndex = Math.min(indexRef.current + chunkSize, text.length);

                setDisplayedText(text.slice(0, nextIndex));
                indexRef.current = nextIndex;
            } else {
                clearInterval(interval);
                if (onComplete) onComplete();
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed, started]);

    return <span className={className}>{displayedText}</span>;
};

export default Typewriter;
