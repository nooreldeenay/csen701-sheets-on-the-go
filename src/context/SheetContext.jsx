import React, { createContext, useContext, useState, useMemo } from 'react';
import { modules } from '../data/modules';

const SheetContext = createContext();

export const SheetProvider = ({ children }) => {
    // Set of selected submodule IDs
    const [selectedItems, setSelectedItems] = useState(new Set());

    // Map of submodule ID -> weight (0.5, 1, 1.5, 2)
    const [weights, setWeights] = useState({});

    const toggleSelection = (id) => {
        setSelectedItems(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const updateWeight = (id, weight) => {
        setWeights(prev => ({ ...prev, [id]: weight }));
    };

    const value = useMemo(() => ({
        modules,
        selectedItems,
        weights,
        toggleSelection,
        updateWeight
    }), [selectedItems, weights]);

    return (
        <SheetContext.Provider value={value}>
            {children}
        </SheetContext.Provider>
    );
};

export const useSheet = () => {
    const context = useContext(SheetContext);
    if (!context) throw new Error('useSheet must be used within a SheetProvider');
    return context;
};
