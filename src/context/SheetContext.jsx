
import React, { createContext, useContext, useState, useMemo } from 'react';
import { modules } from '../data/modules';

const SheetContext = createContext();

export const SheetProvider = ({ children }) => {
    // Set of selected submodule IDs
    const [selectedItems, setSelectedItems] = useState(new Set());

    // Map of submodule ID -> weight (0.5, 1, 1.5, 2)
    const [weights, setWeights] = useState({});

    // Custom user modules
    const [customModules, setCustomModules] = useState([]);

    const toggleSelection = (id) => {
        setSelectedItems(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleModuleSelection = (submoduleIds, shouldSelect) => {
        setSelectedItems(prev => {
            const next = new Set(prev);
            submoduleIds.forEach(id => {
                if (shouldSelect) next.add(id);
                else next.delete(id);
            });
            return next;
        });
    };

    const addCustomModule = (newModule) => {
        setCustomModules(prev => [...prev, newModule]);
    };

    const removeCustomModule = (id) => {
        setCustomModules(prev => prev.filter(m => m.id !== id));
        // Also unselect it
        setSelectedItems(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        })
    };

    const updateCustomModule = (id, updates) => {
        setCustomModules(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    };

    const updateWeight = (id, weight) => {
        setWeights(prev => ({ ...prev, [id]: weight }));
    };

    // Sheet Metadata
    const [sheetName, setSheetName] = useState("");
    const [highlightNameInput, setHighlightNameInput] = useState(false);

    // Grouping Mode State
    const [isGroupingMode, setIsGroupingMode] = useState(false);
    const [groupingSet, setGroupingSet] = useState(new Set());
    const [lastCreatedGroupId, setLastCreatedGroupId] = useState(null); // For UX highlighting

    const toggleGroupingMode = () => {
        setIsGroupingMode(prev => {
            if (prev) {
                setGroupingSet(new Set()); // Clear on exit
            }
            return !prev;
        });
    };

    const toggleOptionInGroup = (id) => {
        setGroupingSet(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const createGroupFromSelection = () => {
        if (groupingSet.size < 2) return; // Need at least 2 items

        // Find items in modules or customModules
        const itemsToGroup = [];

        // Helper to find item
        const findItem = (id) => {
            // Check custom
            const custom = customModules.find(c => c.id === id);
            if (custom) return custom;

            // Check tutorial
            if (tutorialData) {
                const tut = tutorialData.find(t => t.id === id);
                if (tut) return tut;
            }

            // Check standard
            for (const mod of modules) {
                const sub = mod.submodules.find(s => s.id === id);
                if (sub) return sub;
            }
            return null;
        };

        groupingSet.forEach(id => {
            const item = findItem(id);
            if (item) itemsToGroup.push(item);
        });

        // Create new Group Item
        const newGroup = {
            id: `group-${Date.now()}`,
            title: 'Merged Row',
            type: 'row',
            content: itemsToGroup, // Array of sub-items
            parentTitle: 'Custom'
        };

        addCustomModule(newGroup);
        setLastCreatedGroupId(newGroup.id);

        // Auto-select the new group and unselect the original items
        setSelectedItems(prev => {
            const next = new Set(prev);
            // Unselect originals
            groupingSet.forEach(id => next.delete(id));
            // Select new group
            next.add(newGroup.id);
            return next;
        });

        // Reset
        setIsGroupingMode(false);
        setGroupingSet(new Set());
    };

    // Tutorial Data Injection
    const [tutorialData, setTutorialData] = useState([]);

    const value = useMemo(() => ({
        modules,
        customModules,
        tutorialData, setTutorialData, // Tutorial Ephemeral
        selectedItems,
        weights,
        toggleSelection,
        toggleModuleSelection,
        updateWeight,
        addCustomModule,
        removeCustomModule,
        updateCustomModule,
        // Grouping
        isGroupingMode, // Expose
        groupingSet,    // Expose
        toggleGroupingMode,
        toggleOptionInGroup,
        createGroupFromSelection,
        lastCreatedGroupId,
        sheetName, setSheetName,
        highlightNameInput, setHighlightNameInput
    }), [selectedItems, weights, customModules, isGroupingMode, groupingSet, lastCreatedGroupId, sheetName, highlightNameInput, tutorialData]);

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
