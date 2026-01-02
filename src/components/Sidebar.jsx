
import React from 'react';
import { Settings, FileText, ChevronRight, ChevronDown, CheckSquare, Square, Plus, Trash, Image as ImageIcon, Type, Code, Layers, X, Check, Edit2, Minus, Terminal } from 'lucide-react';
import { useSheet } from '../context/SheetContext';

import { useTutorial } from '../context/TutorialContext';

const Sidebar = ({ onOpenAbout }) => {
    const {
        modules, customModules, selectedItems, toggleSelection, toggleModuleSelection, weights, updateWeight,
        addCustomModule, removeCustomModule, updateCustomModule,
        isGroupingMode, groupingSet, toggleGroupingMode, toggleOptionInGroup, createGroupFromSelection,
        lastCreatedGroupId, sheetName, setSheetName, highlightNameInput, setTutorialData,
        overflow, mergeDirection, toggleMergeDirection
    } = useSheet();
    const { sidebarMode, tutorialStep, setTutorialStep, handleTutorialAction } = useTutorial();
    const [expanded, setExpanded] = React.useState({});

    // Tutorial Helper: Example Module
    const exampleModule = React.useMemo(() => ({
        id: 'tut-basics',
        title: 'TUTORIAL_BASICS',
        submodules: [
            { id: 'tut-1', title: 'Intro to Nodes', type: 'text', content: '## Welcome to Nodes\nThis is a standard text node. You can use it to write notes, explanations, or documentation for your cheat sheet.', parentTitle: 'Basics' },
            { id: 'tut-2', title: 'Code Block', type: 'code', content: 'def greeting():\n    print("Hello, World!")\n    return True', parentTitle: 'Basics' }
        ]
    }), []);

    // Register tutorial data on mount
    React.useEffect(() => {
        if (setTutorialData) setTutorialData(exampleModule.submodules);
    }, [exampleModule, setTutorialData]);

    // Determine what modules to show
    // Determine what modules to show
    // PARTIAL: Only Custom Items (handled separately in render), so Standard Lib list should be empty or hidden.
    // FULL: All modules.
    // EXAMPLE: Example module.
    let displayModules = [];
    if (sidebarMode === 'FULL') displayModules = modules;
    else if (sidebarMode === 'EXAMPLE' || sidebarMode === 'PARTIAL') displayModules = [exampleModule];

    React.useEffect(() => {
        if (lastCreatedGroupId) {
            setExpanded(prev => ({ ...prev, 'custom': true }));
        }
    }, [lastCreatedGroupId]);

    const toggleExpand = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

        if (id === 'custom') {
            handleTutorialAction('EXPAND_CUSTOM');
        }
        if (id === 'tut-basics') {
            handleTutorialAction('EXPAND_TUTORIAL');
        }

        // Tutorial Progression: If expanding the example module
        if (tutorialStep === 1 && id === 'tut-basics') {
            // Maybe auto-advance if they open example? 
            // Actually, step 2 requires opening 'custom'. 
        }
    };

    // Component for Retro Size Control
    const SizeControl = ({ value, onChange }) => (
        <div className="flex items-center border border-slate-600 bg-black">
            <button
                onClick={(e) => { e.stopPropagation(); onChange((value || 10) - 1); }}
                className="px-2 py-0.5 hover:bg-green-500 hover:text-black text-green-500 transition-colors border-r border-slate-600"
            >
                -
            </button>
            <input
                type="number"
                value={value || 10}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) onChange(val);
                }}
                className="w-10 text-[10px] text-center text-green-400 font-bold select-none font-mono bg-transparent border-none focus:ring-0 focus:outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
                onClick={(e) => { e.stopPropagation(); onChange((value || 10) + 1); }}
                className="px-2 py-0.5 hover:bg-green-500 hover:text-black text-green-500 transition-colors border-l border-slate-600"
            >
                +
            </button>
        </div>
    );

    if (sidebarMode === 'HIDDEN') {
        return <aside className="w-96 h-screen bg-black border-r-2 border-slate-900 fixed left-0 top-0 z-10 font-mono flex items-center justify-center">
            {/* Blank State */}
        </aside>;
    }

    return (
        <aside className="w-96 h-screen bg-[#0a0a0a] border-r-2 border-slate-800 flex flex-col fixed left-0 top-0 overflow-hidden z-10 font-mono">
            {/* Header Area */}
            <div className={`p-4 border-b-2 border-slate-800 z-20 space-y-4 ${isGroupingMode ? 'bg-[#1a051a] border-purple-500' : 'bg-[#0a0a0a]'}`}>

                {/* Brand & Project Name */}
                <div className="space-y-2">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <h1 className="text-sm font-bold text-green-500 tracking-wider flex items-center gap-2">
                                <Terminal size={14} /> SHEET_GEN_V1.0
                            </h1>
                            <span className="text-[10px] text-slate-500">:: SYSTEM READY ::</span>
                        </div>

                        <button
                            onClick={() => {
                                toggleGroupingMode();
                                if (!isGroupingMode) handleTutorialAction('TOGGLE_MERGE');
                            }}
                            className={`text-[10px] px-3 py-1.5 border transition-all flex items-center gap-1 uppercase tracking-wider font-bold shadow-[0_0_10px_transparent] ${isGroupingMode
                                ? 'bg-purple-600 text-black border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                                : 'bg-[#1a1a1a] text-slate-400 border-slate-600 hover:border-green-500 hover:text-green-500 hover:bg-[#222]'}`}
                        >
                            {isGroupingMode ? '[ STOP_MERGE ]' : '[ MERGE_MODE ]'}
                        </button>
                    </div>

                    <div className="relative group">
                        <span className={`absolute left-2 top-1.5 text-xs font-bold select-none transition-colors ${highlightNameInput ? 'text-orange-500' : 'text-slate-600'}`}>{'>'}</span>
                        <input
                            value={sheetName}
                            onChange={(e) => setSheetName(e.target.value)}
                            className={`w-full bg-[#111] border pl-6 pr-2 py-1 text-sm placeholder-slate-700 focus:outline-none transition-all duration-300 uppercase
                                ${highlightNameInput
                                    ? 'border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)] text-orange-400 animate-pulse'
                                    : 'border-slate-700 hover:border-green-500 focus:border-green-400 text-green-400'
                                }
                            `}
                            placeholder="NAME YOUR SHEET"
                        />
                    </div>
                </div>

                {isGroupingMode && (
                    <div className="border border-purple-500 bg-[#1a051a] p-2 space-y-2">
                        <div className="flex justify-between items-center border-b border-purple-900 pb-1">
                            <span className="text-[10px] text-purple-400 font-bold uppercase blink">!! MERGE SEQUENCE ACTIVE !!</span>
                            <span className="text-[10px] text-purple-300">{groupingSet.size} SELECTED</span>
                        </div>
                        
                        <div className="flex gap-2">
                            <button
                                onClick={toggleMergeDirection}
                                className={`flex-1 text-[10px] px-2 py-1.5 border transition-all uppercase tracking-wider font-bold ${
                                    mergeDirection === 'horizontal'
                                        ? 'bg-purple-500 text-black border-purple-300'
                                        : 'bg-purple-900/50 text-purple-300 border-purple-600 hover:bg-purple-800/50'
                                }`}
                            >
                                {mergeDirection === 'horizontal' ? '[ H ]' : '[ - ]'}
                            </button>
                            <button
                                onClick={toggleMergeDirection}
                                className={`flex-1 text-[10px] px-2 py-1.5 border transition-all uppercase tracking-wider font-bold ${
                                    mergeDirection === 'vertical'
                                        ? 'bg-purple-500 text-black border-purple-300'
                                        : 'bg-purple-900/50 text-purple-300 border-purple-600 hover:bg-purple-800/50'
                                }`}
                            >
                                {mergeDirection === 'vertical' ? '[ V ]' : '[ | ]'}
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                createGroupFromSelection();
                                handleTutorialAction('CONFIRM_MERGE');
                            }}
                            disabled={groupingSet.size < 2}
                            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed text-black text-xs py-2 font-bold uppercase tracking-widest border border-purple-400"
                        >
                            {groupingSet.size < 2 ? 'SELECT ITEMS...' : '>> EXECUTE MERGE <<'}
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin">
                {/* Automatic Ordering Warning */}
                <div className="bg-yellow-900/20 border border-yellow-700/50 p-2 text-[9px] font-mono leading-tight flex items-start gap-2">
                    <span className="text-yellow-500 font-bold">⚠️</span>
                    <span className="text-yellow-200/70">
                        <strong className="text-yellow-500 uppercase">Notice:</strong> MODULE ORDER IS AUTOMATICALLY CONTROLLED TO MAXIMIZE PAGE PACKING EFFICIENCY.
                    </span>
                </div>

                {/* Space Reduction Tip */}
                <div className="bg-blue-900/20 border border-blue-700/50 p-2 text-[9px] font-mono leading-tight flex items-start gap-2">
                    <span className="text-blue-500 font-bold">💡</span>
                    <span className="text-blue-200/70">
                        <strong className="text-blue-500 uppercase">Tip:</strong> MERGING LARGE CODE BLOCKS OFFERS THE LARGEST AMOUNT OF SPACE REDUCTION.
                    </span>
                </div>

                {/* Custom Content Section - Show in FULL and PARTIAL modes */}
                {(sidebarMode === 'FULL' || sidebarMode === 'PARTIAL') && (
                    <div className="border border-slate-700 bg-[#0e0e0e]">
                        <button
                            onClick={() => toggleExpand('custom')}
                            className="w-full flex items-center justify-between p-2 hover:bg-slate-900 transition-colors text-left group"
                        >
                            <span className="font-bold text-xs text-slate-400 group-hover:text-green-400 uppercase tracking-wider">
                                ./USER_DEFINED
                            </span>
                            <span className="text-slate-600 group-hover:text-green-500">
                                {expanded['custom'] ? '[-]' : '[+]'}
                            </span>
                        </button>

                        {expanded['custom'] && (
                            <div className="p-2 space-y-3 border-t border-slate-800">
                                <div className="bg-orange-500/10 border border-orange-900/50 p-2 text-[9px] font-mono leading-tight">
                                    <span className="text-orange-500 font-bold uppercase blink mr-1">[!] MEMORY_VOLATILE:</span>
                                    <span className="text-slate-400">USER_DATA IS STORED IN RAM ONLY. SESSION WILL BE CLEARED ON EXIT.</span>
                                </div>

                                {/* Controls */}
                                <div className="grid grid-cols-4 gap-2">
                                    <button
                                        onClick={() => addCustomModule({
                                            id: `custom-${Date.now()}`,
                                            title: 'NOTE_01',
                                            type: 'text',
                                            content: 'TYPE_HERE...',
                                            parentTitle: 'CUSTOM',
                                            weight: 10
                                        })}
                                        className="bg-[#111] hover:bg-green-900/30 text-green-500 text-[9px] py-1 border border-green-900 hover:border-green-500 uppercase font-bold"
                                    >
                                        TEXT
                                    </button>

                                    <label className="bg-[#111] hover:bg-green-900/30 text-green-500 text-[9px] py-1 border border-green-900 hover:border-green-500 uppercase font-bold cursor-pointer text-center block">
                                        IMG
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        addCustomModule({
                                                            id: `custom-${Date.now()}`,
                                                            title: file.name,
                                                            type: 'image',
                                                            src: reader.result,
                                                            parentTitle: 'CUSTOM',
                                                            weight: 10
                                                        });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </label>

                                    <button
                                        onClick={() => addCustomModule({
                                            id: `custom-${Date.now()}`,
                                            title: 'CODE_01',
                                            type: 'code',
                                            content: '// code here',
                                            parentTitle: 'CUSTOM',
                                            weight: 10
                                        })}
                                        className="bg-[#111] hover:bg-green-900/30 text-green-500 text-[9px] py-1 border border-green-900 hover:border-green-500 uppercase font-bold"
                                    >
                                        CODE
                                    </button>

                                    <button
                                        onClick={() => addCustomModule({
                                            id: `custom-${Date.now()}`,
                                            title: 'EQ_01',
                                            type: 'formula',
                                            content: 'x = y^2',
                                            parentTitle: 'CUSTOM',
                                            weight: 10
                                        })}
                                        className="bg-[#111] hover:bg-green-900/30 text-green-500 text-[9px] py-1 border border-green-900 hover:border-green-500 uppercase font-bold"
                                    >
                                        MATH
                                    </button>
                                </div>

                                {/* List Custom Items */}
                                {customModules.map(item => (
                                    <div key={item.id} className={`flex flex-col gap-2 p-2 border transition-all
                                            ${item.id === lastCreatedGroupId ? 'border-purple-500 bg-purple-900/10' : 'border-slate-800 bg-[#111]'}
                                            ${overflow?.some(o => o.id === item.id) ? 'animate-pulse-red' : ''}
                                        `}>
                                        <div className="flex items-start gap-2">
                                            {/* Checkbox */}
                                            <button
                                                onClick={() => isGroupingMode ? toggleOptionInGroup(item.id) : toggleSelection(item.id)}
                                                className={`mt-1 font-mono text-xs ${isGroupingMode
                                                    ? (groupingSet.has(item.id) ? "text-purple-400" : "text-slate-600 hover:text-purple-300")
                                                    : (selectedItems.has(item.id) ? "text-green-400" : "text-slate-600 hover:text-green-300")
                                                    }`}
                                            >
                                                {isGroupingMode
                                                    ? (groupingSet.has(item.id) ? '[x]' : '[ ]')
                                                    : (selectedItems.has(item.id) ? '[x]' : '[ ]')
                                                }
                                            </button>

                                            <div className="flex-1 min-w-0 space-y-2">
                                                {/* Header */}
                                                <div className="flex justify-between items-center gap-2 border-b border-slate-800 pb-1">
                                                    <div className="flex-1 flex items-center gap-1">
                                                        <Edit2 size={10} className="text-slate-600" />
                                                        <input
                                                            className="bg-transparent text-xs text-cyan-400 w-full border-none focus:ring-0 p-0 font-bold placeholder-slate-700 uppercase"
                                                            value={item.title}
                                                            onChange={(e) => updateCustomModule(item.id, { title: e.target.value })}
                                                        />
                                                    </div>
                                                    <button onClick={() => removeCustomModule(item.id)} className="text-slate-700 hover:text-red-500">
                                                        <Trash size={12} />
                                                    </button>
                                                </div>

                                                {/* Meta */}
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] text-slate-500 uppercase tracking-tighter font-bold">TYPE: {item.type}</span>
                                                    <div className="flex items-center gap-1">
                                                        <SizeControl
                                                            value={item.weight}
                                                            onChange={(val) => {
                                                                const validVal = Math.max(6, Math.min(40, val));
                                                                updateCustomModule(item.id, { weight: validVal });
                                                                updateWeight(item.id, validVal);
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Editor */}
                                                {item.type === 'text' && (
                                                    <textarea
                                                        className="w-full bg-black text-xs text-slate-300 border border-slate-800 p-2 font-mono focus:border-green-500 focus:outline-none"
                                                        value={item.content}
                                                        onChange={(e) => updateCustomModule(item.id, { content: e.target.value })}
                                                        rows={2}
                                                    />
                                                )}
                                                {item.type === 'code' && (
                                                    <textarea
                                                        className="w-full bg-[#111] text-xs text-blue-300 border border-slate-800 p-2 font-mono focus:border-blue-500 focus:outline-none"
                                                        value={item.content}
                                                        onChange={(e) => updateCustomModule(item.id, { content: e.target.value })}
                                                        rows={3}
                                                        placeholder="// Code here"
                                                    />
                                                )}
                                                {item.type === 'formula' && (
                                                    <input
                                                        className="w-full bg-black text-xs text-yellow-500 border border-slate-800 p-2 font-mono focus:border-green-500 focus:outline-none"
                                                        value={item.content}
                                                        onChange={(e) => updateCustomModule(item.id, { content: e.target.value })}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Modules List */}
                <div className="space-y-4">
                    <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest pl-1 mb-1">
                        root/standard_lib
                    </div>
                    {displayModules.map(mod => (
                        <div key={mod.id} className="border border-slate-800 bg-[#0a0a0a]">
                            <div className="flex items-center w-full hover:bg-[#111] transition-colors pr-2">
                                <button
                                    onClick={() => toggleExpand(mod.id)}
                                    className="flex-1 flex items-center justify-between p-2 text-left group min-w-0"
                                >
                                    <span className="font-bold text-xs text-slate-400 group-hover:text-white uppercase truncate pr-2">
                                        ./{mod.title.replace(/\s+/g, '_')}
                                    </span>
                                    <span className="text-slate-700 group-hover:text-green-500 text-[10px]">
                                        {expanded[mod.id] ? '[-]' : '[+]'}
                                    </span>
                                </button>

                                {!isGroupingMode && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const allSelected = mod.submodules.every(sub => selectedItems.has(sub.id));
                                            const idsToToggle = mod.submodules.map(s => s.id);
                                            toggleModuleSelection(idsToToggle, !allSelected);

                                            // Tutorial Step 8 Check (Bulk Toggle)
                                            if (tutorialStep === 8 && mod.id === 'tut-basics') {
                                                // Start with current selection
                                                const nextSelection = new Set(selectedItems);
                                                idsToToggle.forEach(id => {
                                                    if (!allSelected) nextSelection.add(id); // selecting all
                                                    else nextSelection.delete(id); // deselecting all
                                                });
                                                handleTutorialAction('SELECT_TUTORIAL_ITEM', Array.from(nextSelection));
                                            }
                                        }}
                                        className={`p-1 font-mono text-[10px] transition-colors ${mod.submodules.every(sub => selectedItems.has(sub.id)) ? 'text-green-500 font-bold' : 'text-slate-600 hover:text-green-400'}`}
                                        title="TOGGLE_ALL"
                                    >
                                        {mod.submodules.every(sub => selectedItems.has(sub.id)) ? '[#]' : '[_]'}
                                    </button>
                                )}
                            </div>

                            {expanded[mod.id] && (
                                <div className="bg-[#050505] p-2 space-y-1 border-t border-slate-800">
                                    {mod.submodules.map(sub => {
                                        const isSelected = selectedItems.has(sub.id);
                                        const weight = weights[sub.id] || 10;
                                        const isGrouped = groupingSet.has(sub.id);

                                        const isTutItem = (sub.id === 'tut-1' || sub.id === 'tut-2');
                                        const shouldPulse = tutorialStep === 5 && isTutItem && !selectedItems.has(sub.id);

                                        return (
                                            <div
                                                key={sub.id}
                                                className={`
                            flex flex-col gap-2 p-1.5 border
                            ${isGroupingMode
                                                        ? (isGrouped ? 'border-purple-500 bg-purple-900/10' : 'border-transparent opacity-50 hover:opacity-100 hover:border-purple-900')
                                                        : (isSelected ? 'border-green-800 bg-green-900/10' : 'border-transparent hover:border-slate-800')
                                                    }
                            ${shouldPulse ? 'animate-pulse ring-1 ring-green-500 bg-green-900/20' : ''}
                            ${overflow?.some(o => o.id === sub.id) ? 'animate-pulse-red' : ''}
                          `}
                                            >
                                                <div className="flex items-start gap-2 cursor-pointer"
                                                    onClick={() => {
                                                        if (isGroupingMode) {
                                                            toggleOptionInGroup(sub.id);
                                                            // For tutorial step 4: Select 2 items
                                                            // Logic: If user just selected an item, new count is current + 1. 
                                                            // We can just rely on the count being updated in context, but payload is safer.
                                                            // Actually, let's just pass a high number or rely on effect. 
                                                            // For now, let's pass the potential new size.
                                                            // Since state updates are async, we aren't sure of new size yet. 
                                                            // Simple hack: handleTutorialAction verifies if 'Select' action happened, 
                                                            // then we can check count inside context or just accept it if we trust user logic.
                                                            // Better: Pass nothing and let Context check actual state if it can, 
                                                            // but context might not have latest state immediately.

                                                            // Let's manually estimate:
                                                            const currentlySelected = groupingSet.has(sub.id);
                                                            const newCount = groupingSet.size + (currentlySelected ? -1 : 1);
                                                            handleTutorialAction('SELECT_ITEM', newCount);
                                                        } else {
                                                            toggleSelection(sub.id);
                                                            // Tutorial Step 8 Check (Individual Toggle)
                                                            if (tutorialStep === 8) {
                                                                const nextSelection = new Set(selectedItems);
                                                                if (selectedItems.has(sub.id)) nextSelection.delete(sub.id);
                                                                else nextSelection.add(sub.id);
                                                                handleTutorialAction('SELECT_TUTORIAL_ITEM', Array.from(nextSelection));
                                                            }
                                                        }
                                                    }}>

                                                    <div className={`mt-0.5 font-mono text-xs font-bold ${isGroupingMode
                                                        ? (isGrouped ? 'text-purple-400' : 'text-slate-700')
                                                        : (isSelected ? 'text-green-400' : 'text-slate-700')
                                                        }`}>
                                                        {isGroupingMode
                                                            ? (isGrouped ? '[x]' : '[ ]')
                                                            : (isSelected ? '[x]' : '[ ]')
                                                        }
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className={`text-sm ${isGroupingMode
                                                            ? (isGrouped ? 'text-purple-100' : 'text-slate-500')
                                                            : (isSelected ? 'text-green-100' : 'text-slate-500')
                                                            }`}>
                                                            {sub.title}
                                                        </div>
                                                        <div className="text-[10px] text-slate-600 uppercase tracking-tighter mt-0.5">{sub.type}</div>
                                                    </div>
                                                </div>

                                                {isSelected && !isGroupingMode && (
                                                    <div className="flex items-center gap-2 pl-6 mt-1">
                                                        <span className="text-[8px] text-slate-600 uppercase">sz:</span>
                                                        <SizeControl
                                                            value={weight}
                                                            onChange={(val) => {
                                                                const validVal = Math.max(6, Math.min(30, val));
                                                                updateWeight(sub.id, validVal);
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-3 border-t-2 border-slate-800 bg-[#0a0a0a] z-20">
                <div className="flex justify-between items-center text-slate-500 text-[10px] font-mono uppercase">
                    <div>
                        <span className="text-green-500 font-bold">{selectedItems.size}</span> UNITS_ACTIVE
                    </div>
                    <button
                        onClick={onOpenAbout}
                        className="hover:text-green-400 cursor-pointer transition-colors"
                    >
                        [ ABOUT_SYS ]
                    </button>
                </div>
            </div>
        </aside >
    );
};

export default Sidebar;
