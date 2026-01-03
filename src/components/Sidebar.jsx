import React from 'react';
import { Settings, FileText, ChevronRight, ChevronDown, CheckSquare, Square, Plus, Trash, Image as ImageIcon, Type, Code, Layers, X, Check, Edit2, Minus, Terminal } from 'lucide-react';
import { useSheet } from '../context/SheetContext';
import { useTutorial } from '../context/TutorialContext';
import { APP_VERSION } from '../constants';

const Sidebar = ({ onOpenAbout, onOpenManual, onOpenChangelog }) => {
    const {
        modules, customModules, selectedItems, toggleSelection, toggleModuleSelection, weights, updateWeight,
        addCustomModule, removeCustomModule, updateCustomModule,
        isGroupingMode, groupingSet, toggleGroupingMode, toggleOptionInGroup, createGroupFromSelection,
        lastCreatedGroupId, sheetName, setSheetName, highlightNameInput, setTutorialData,
        overflow, mergeDirection, toggleMergeDirection, groupingStrategy, setGroupingStrategy,
        resetToAutoOrder
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
                                <Terminal size={14} /> SHEET_GEN_V{APP_VERSION}
                            </h1>
                            <span className="text-[10px] text-slate-400">:: SYSTEM READY ::</span>
                        </div>

                        <button
                            onClick={() => {
                                toggleGroupingMode();
                                if (!isGroupingMode) handleTutorialAction('TOGGLE_MERGE');
                            }}
                            className={`px-3 py-1 flex items-center gap-2 text-[10px] font-bold uppercase border transition-all
                                ${isGroupingMode
                                    ? 'bg-purple-900/50 border-purple-500 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                                    : 'bg-[#111] border-slate-700 text-slate-400 hover:text-green-400 hover:border-green-500'
                                }`}
                        >
                            {isGroupingMode ? (
                                <>
                                    <Layers size={12} className="animate-pulse" /> MERGE_ACTIVE
                                </>
                            ) : (
                                <>
                                    <Layers size={12} /> MERGE_MODE
                                </>
                            )}
                        </button>
                    </div>

                    {/* Project Name Input */}
                    <div className="relative group">
                        <label className="text-[9px] text-slate-400 uppercase font-bold absolute -top-1.5 left-2 bg-[#0a0a0a] px-1">
                            PROJECT_ID
                        </label>
                        <div className={`flex items-center border transition-all duration-200 bg-[#0f0f0f]
                            ${highlightNameInput
                                ? 'animate-pulse border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]'
                                : 'border-slate-800 group-hover:border-green-500/50'}`}>
                            <input
                                type="text"
                                value={sheetName}
                                onChange={(e) => {
                                    setSheetName(e.target.value);
                                    handleTutorialAction('NAME_SHEET');
                                }}
                                className="w-full bg-transparent text-xs text-green-400 p-2 font-mono focus:outline-none placeholder-slate-800 uppercase"
                                placeholder="ENTER_SHEET_NAME..."
                            />
                            {sheetName && <Check size={12} className="text-green-500 mr-2" />}
                        </div>
                    </div>
                </div>

                {/* Controls Grid */}
                {isGroupingMode ? (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center justify-between text-[10px] text-purple-300 font-bold uppercase border-b border-purple-900/50 pb-1">
                            <span>Merge Configuration</span>
                            <span className="bg-purple-900/20 px-1">{groupingSet.size} SELECTED</span>
                        </div>

                        {/* Orientation Toggle */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => toggleMergeDirection()}
                                className={`flex-1 flex items-center justify-center gap-2 text-[10px] py-1.5 border transition-all uppercase font-bold
                                    ${mergeDirection === 'vertical'
                                        ? 'bg-purple-900/40 text-purple-300 border-purple-500'
                                        : 'bg-[#111] text-slate-500 border-slate-700 hover:border-slate-500'
                                    }`}
                            >
                                <ChevronDown size={12} /> VERTICAL
                            </button>
                            <button
                                onClick={() => toggleMergeDirection()}
                                className={`flex-1 flex items-center justify-center gap-2 text-[10px] py-1.5 border transition-all uppercase font-bold
                                    ${mergeDirection === 'horizontal'
                                        ? 'bg-purple-900/40 text-purple-300 border-purple-500'
                                        : 'bg-[#111] text-slate-500 border-slate-700 hover:border-slate-500'
                                    }`}
                            >
                                <ChevronRight size={12} /> HORIZONTAL
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                createGroupFromSelection();
                                handleTutorialAction('CONFIRM_MERGE');
                            }}
                            disabled={groupingSet.size < 2}
                            className={`w-full py-2 text-xs font-bold uppercase tracking-widest transition-all
                                ${groupingSet.size >= 2
                                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]'
                                    : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
                                }`}
                        >
                            [ EXECUTE_MERGE ]
                        </button>
                    </div>
                ) : (
                    // Standard Controls
                    <div className="space-y-3">
                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest pl-1">
                            Layout / Sorting
                        </div>
                        <div className="flex gap-2">
                            {['default', 'compact', 'type', 'manual'].map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => {
                                        setGroupingStrategy(mode);
                                        // This syncs the UI warning in the preview
                                        if (resetToAutoOrder) resetToAutoOrder();
                                    }}
                                    className={`flex-1 text-[9px] py-1 border transition-all uppercase font-bold
                                        ${groupingStrategy === mode
                                            ? 'bg-blue-900/40 text-blue-400 border-blue-500'
                                            : 'bg-[#111] text-slate-400 border-slate-700 hover:border-slate-500'
                                        }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin">

                {/* Custom Content Section */}
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

                                    <button
                                        onClick={() => addCustomModule({
                                            id: `custom-${Date.now()}`,
                                            title: 'TBL_01',
                                            type: 'table',
                                            content: 'Col1 | Col2\nVal1 | Val2',
                                            parentTitle: 'CUSTOM',
                                            weight: 10
                                        })}
                                        className="bg-[#111] hover:bg-green-900/30 text-green-500 text-[9px] py-1 border border-green-900 hover:border-green-500 uppercase font-bold"
                                    >
                                        TABLE
                                    </button>
                                </div>

                                {/* List Custom Items */}
                                {customModules.map(item => (
                                    <div key={item.id} className={`flex flex-col gap-2 p-2 border transition-all
                                            ${item.id === lastCreatedGroupId ? 'border-purple-500 bg-purple-900/10' : 'border-slate-800 bg-[#111]'}
                                            ${(isGroupingMode && groupingSet.has(item.id)) ? 'bg-purple-900/20 border-purple-500' : ''}
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
                                                <div className="flex items-center gap-2">
                                                    <Edit2 size={10} className="text-slate-600" />
                                                    <input
                                                        className="bg-transparent text-xs text-cyan-400 w-full border-none focus:ring-0 p-0 font-bold placeholder-slate-700 uppercase"
                                                        value={item.title}
                                                        onChange={(e) => updateCustomModule(item.id, { title: e.target.value })}
                                                    />
                                                </div>
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
                                        {item.type === 'image' && (
                                            <div className="bg-black p-2 border border-slate-800 text-center">
                                                <img src={item.src} className="max-h-20 max-w-full mx-auto" />
                                            </div>
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
                                        {item.type === 'table' && (
                                            <textarea
                                                className="w-full bg-black text-xs text-purple-300 border border-slate-800 p-2 font-mono focus:border-purple-500 focus:outline-none"
                                                value={item.content}
                                                onChange={(e) => updateCustomModule(item.id, { content: e.target.value })}
                                                rows={3}
                                                placeholder="Header1 | Header2&#10;Val1 | Val2"
                                            />
                                        )}
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

                                            if (tutorialStep === 8 && mod.id === 'tut-basics') {
                                                const nextSelection = new Set(selectedItems);
                                                idsToToggle.forEach(id => {
                                                    if (!allSelected) nextSelection.add(id);
                                                    else nextSelection.delete(id);
                                                });
                                                if (nextSelection.has('tut-1') && nextSelection.has('tut-2')) {
                                                    handleTutorialAction('SELECT_ALL_MODULES');
                                                }
                                            }
                                        }}
                                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 transition-colors
                                            ${mod.submodules.every(sub => selectedItems.has(sub.id))
                                                ? "text-green-500 bg-green-900/10"
                                                : "text-slate-700 hover:text-green-500"
                                            }`}
                                    >
                                        {mod.submodules.every(sub => selectedItems.has(sub.id)) ? '[ ALL ]' : '[ SEL ]'}
                                    </button>
                                )}
                            </div>

                            {expanded[mod.id] && (
                                <div className="border-t border-slate-800">
                                    {mod.submodules.map(sub => (
                                        <div
                                            key={sub.id}
                                            onClick={() => {
                                                if (isGroupingMode) {
                                                    toggleOptionInGroup(sub.id);
                                                    // Tutorial Check for Selection Step (Step 5) - context: Merge Mode Active
                                                    if (tutorialStep === 5 && (sub.id === 'tut-1' || sub.id === 'tut-2')) {
                                                        const nextSize = groupingSet.has(sub.id) ? groupingSet.size - 1 : groupingSet.size + 1;
                                                        if (nextSize >= 2) {
                                                            handleTutorialAction('SELECT_ITEM', nextSize);
                                                        }
                                                    }
                                                }
                                                else {
                                                    toggleSelection(sub.id);
                                                    // Tutorial Check (Step 8: Enable content)
                                                    if (tutorialStep === 8 && mod.id === 'tut-basics') {
                                                        const nextSelection = new Set(selectedItems);
                                                        if (selectedItems.has(sub.id)) nextSelection.delete(sub.id);
                                                        else nextSelection.add(sub.id);

                                                        // Check if both are selected
                                                        if (nextSelection.has('tut-1') && nextSelection.has('tut-2')) {
                                                            handleTutorialAction('SELECT_TUTORIAL_ITEM', ['tut-1', 'tut-2']);
                                                        }
                                                    }
                                                }
                                            }}
                                            className={`p-2 flex items-start gap-2 border-b border-slate-800/50 last:border-0 hover:bg-[#111] group cursor-pointer transition-all
                                                ${overflow?.some(o => o.id === sub.id) ? 'bg-red-900/10' : ''}
                                                ${(isGroupingMode && groupingSet.has(sub.id))
                                                    ? 'bg-purple-900/20 shadow-[inset_2px_0_0_0_rgb(168,85,247)]'
                                                    : ((tutorialStep === 5 && (sub.id === 'tut-1' || sub.id === 'tut-2'))
                                                        ? 'border border-green-500 shadow-[0_0_10px_rgba(74,222,128,0.2)] bg-green-900/20'
                                                        : '')}
                                            `}
                                        >
                                            <button
                                                className={`mt-1 font-mono text-xs ${isGroupingMode
                                                    ? (groupingSet.has(sub.id) ? "text-purple-400" : "text-slate-700 hover:text-purple-300")
                                                    : (selectedItems.has(sub.id) ? "text-green-400" : "text-slate-700 hover:text-green-300")
                                                    }`}
                                            >
                                                {isGroupingMode
                                                    ? (groupingSet.has(sub.id) ? '[x]' : '[ ]')
                                                    : (selectedItems.has(sub.id) ? '[x]' : '[ ]')
                                                }
                                            </button>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <span className={`text-[10px] font-bold uppercase truncate
                                                        ${selectedItems.has(sub.id) ? 'text-slate-200' : 'text-slate-500 group-hover:text-slate-400'}`}>
                                                        {sub.title}
                                                    </span>
                                                    <span className="text-[9px] text-slate-700 font-mono uppercase">{sub.type}</span>
                                                </div>
                                                <div className="text-[9px] text-slate-600 line-clamp-2 leading-tight font-serif">
                                                    {sub.content}
                                                </div>
                                            </div>

                                            {/* Retro Size Control for Standard Modules */}
                                            {selectedItems.has(sub.id) && !isGroupingMode && (
                                                <div className="pt-1">
                                                    <SizeControl
                                                        value={weights[sub.id]}
                                                        onChange={(val) => {
                                                            const validVal = Math.max(6, Math.min(40, val));
                                                            updateWeight(sub.id, validVal);
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-3 border-t-2 border-slate-800 bg-[#0a0a0a] z-20">
                <div className="flex justify-between items-center text-slate-500 text-[10px] font-mono uppercase">
                    <div className="flex items-center gap-3">
                        <div>
                            <span className="text-green-500 font-bold">{selectedItems.size}</span> UNITS_ACTIVE
                        </div>
                        <button onClick={onOpenManual} className="hover:text-amber-500 transition-colors">[MANUAL]</button>
                        <button onClick={onOpenChangelog} className="hover:text-blue-500 transition-colors">[LOGS]</button>
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
