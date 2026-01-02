
import React from 'react';
import { Settings, FileText, ChevronRight, ChevronDown, CheckSquare, Square, Plus, Trash, Image as ImageIcon, Type, Code, Layers, X, Check, Edit2, Minus } from 'lucide-react';
import { useSheet } from '../context/SheetContext';

const Sidebar = () => {
    const {
        modules, customModules, selectedItems, toggleSelection, toggleModuleSelection, weights, updateWeight,
        addCustomModule, removeCustomModule, updateCustomModule,
        isGroupingMode, groupingSet, toggleGroupingMode, toggleOptionInGroup, createGroupFromSelection,
        lastCreatedGroupId, sheetName, setSheetName
    } = useSheet();
    const [expanded, setExpanded] = React.useState({});

    React.useEffect(() => {
        if (lastCreatedGroupId) {
            setExpanded(prev => ({ ...prev, 'custom': true }));
        }
    }, [lastCreatedGroupId]);

    const toggleExpand = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Component for Size Control
    const SizeControl = ({ value, onChange }) => (
        <div className="flex items-center bg-slate-900 rounded border border-slate-700 overflow-hidden">
            <button
                onClick={(e) => { e.stopPropagation(); onChange((value || 10) - 1); }}
                className="px-1.5 py-0.5 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
                <Minus size={10} />
            </button>
            <span className="w-6 text-[10px] text-center text-slate-200 select-none font-medium">{value || 10}</span>
            <button
                onClick={(e) => { e.stopPropagation(); onChange((value || 10) + 1); }}
                className="px-1.5 py-0.5 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
                <Plus size={10} />
            </button>
        </div>
    );

    return (
        <aside className="w-80 h-screen bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 overflow-hidden z-10 shadow-xl">
            <div className={`p-4 border-b border-slate-800 z-20 space-y-3 transition-colors duration-300 ${isGroupingMode ? 'bg-purple-900/10' : 'bg-slate-900'}`}>

                {/* Header & Sheet Name */}
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <FileText className="text-blue-400" size={18} />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project</span>
                        </div>

                        <button
                            onClick={toggleGroupingMode}
                            title={isGroupingMode ? "Cancel Merge" : "Start Merge Mode"}
                            className={`text-xs px-2 py-1 rounded border transition-all flex items-center gap-1 ${isGroupingMode
                                ? 'bg-purple-600 text-white border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'}`}
                        >
                            {isGroupingMode ? <X size={12} /> : <Layers size={12} />}
                            {isGroupingMode ? 'Cancel' : 'Merge'}
                        </button>
                    </div>

                    <input
                        value={sheetName}
                        onChange={(e) => setSheetName(e.target.value)}
                        className="w-full bg-slate-800/50 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded px-2 py-1 text-sm font-bold text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                        placeholder="Sheet Name..."
                    />
                </div>

                {isGroupingMode && (
                    <div className="bg-purple-900/20 border border-purple-500/30 rounded p-3 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-[10px] text-purple-200 font-medium">CHECK items to merge ({groupingSet.size})</p>
                            <span className="text-[9px] text-purple-300 bg-purple-500/10 px-1 rounded">Merging Mode</span>
                        </div>
                        <button
                            onClick={createGroupFromSelection}
                            disabled={groupingSet.size < 2}
                            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs py-1.5 rounded font-medium flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-purple-900/20"
                        >
                            <Check size={12} /> Create Merged Row
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
                {/* Custom Content Section */}
                <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-800/40 mb-2">
                    <button
                        onClick={() => toggleExpand('custom')}
                        className="w-full flex items-center justify-between p-3 hover:bg-slate-800 transition-colors text-left"
                    >
                        <span className="font-medium text-purple-300 text-sm truncate pr-2 flex items-center gap-2">
                            <Plus size={14} /> Custom Items
                        </span>
                        {expanded['custom'] ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
                    </button>

                    {expanded['custom'] && (
                        <div className="bg-slate-900/50 p-2 space-y-2 border-t border-slate-700">

                            {/* Add New Form */}
                            <div className="flex gap-1 flex-wrap">
                                <button
                                    onClick={() => addCustomModule({
                                        id: `custom-${Date.now()}`,
                                        title: 'New Note',
                                        type: 'text',
                                        content: 'Edit this text...',
                                        parentTitle: 'Custom',
                                        weight: 10
                                    })}
                                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] px-3 py-1.5 rounded border border-slate-600 flex-1 transition-colors"
                                >Text</button>

                                <label className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] px-3 py-1.5 rounded border border-slate-600 flex-1 cursor-pointer text-center transition-colors">
                                    Image
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
                                                        parentTitle: 'Custom',
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
                                        title: 'New Formula',
                                        type: 'formula',
                                        content: 'E = mc^2',
                                        parentTitle: 'Custom',
                                        weight: 10
                                    })}
                                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] px-3 py-1.5 rounded border border-slate-600 flex-1 transition-colors"
                                >Math</button>
                            </div>

                            {/* List Custom Items */}
                            {customModules.map(item => (
                                <div key={item.id} className={`flex flex-col gap-2 p-3 rounded border transition-all duration-500
                                            ${item.id === lastCreatedGroupId ? 'bg-purple-900/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-slate-800 border-slate-700'}
                                        `}>
                                    <div className="flex items-start gap-3">
                                        {/* Selection Checkbox */}
                                        <button
                                            onClick={() => isGroupingMode ? toggleOptionInGroup(item.id) : toggleSelection(item.id)}
                                            className={`mt-1.5 transition-colors ${isGroupingMode
                                                    ? (groupingSet.has(item.id) ? "text-purple-400" : "text-slate-600 hover:text-purple-300")
                                                    : (selectedItems.has(item.id) ? "text-blue-400" : "text-slate-600 hover:text-blue-300")
                                                }`}
                                        >
                                            {isGroupingMode
                                                ? (groupingSet.has(item.id) ? <CheckSquare size={16} /> : <Square size={16} />)
                                                : (selectedItems.has(item.id) ? <CheckSquare size={16} /> : <Square size={16} />)
                                            }
                                        </button>

                                        <div className="flex-1 min-w-0 space-y-2">
                                            {/* Header Row: Title & Delete */}
                                            <div className="flex justify-between items-center gap-2">
                                                <div className="relative flex-1 group/input">
                                                    <input
                                                        className="bg-transparent text-xs text-white w-full border-none focus:ring-0 p-0 font-bold placeholder-slate-500"
                                                        value={item.title}
                                                        placeholder="Title..."
                                                        onChange={(e) => updateCustomModule(item.id, { title: e.target.value })}
                                                    />
                                                    <Edit2 size={8} className="absolute -right-2 top-1 text-slate-600 opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none" />
                                                </div>
                                                <button onClick={() => removeCustomModule(item.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                                                    <Trash size={12} />
                                                </button>
                                            </div>

                                            {/* Info Row: Type & Size */}
                                            <div className="flex justify-between items-center">
                                                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">{item.type}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[9px] text-slate-500">px:</span>
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

                                            {/* Content Editor */}
                                            {item.type === 'text' && (
                                                <textarea
                                                    className="w-full bg-slate-900/50 text-[10px] text-slate-300 border border-slate-700/50 focus:border-blue-500/50 rounded p-1.5 resize-y min-h-[40px] focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                                    value={item.content}
                                                    onChange={(e) => updateCustomModule(item.id, { content: e.target.value })}
                                                />
                                            )}
                                            {item.type === 'formula' && (
                                                <input
                                                    className="w-full bg-slate-900/50 text-[10px] text-slate-300 border border-slate-700/50 focus:border-blue-500/50 rounded p-1.5 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                                    value={item.content}
                                                    onChange={(e) => updateCustomModule(item.id, { content: e.target.value })}
                                                />
                                            )}
                                            {item.type === 'image' && (
                                                <div className="text-[9px] text-slate-500 italic truncate max-w-[150px] bg-slate-900/30 p-1 rounded">
                                                    {item.title}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {modules.map(mod => (
                    <div key={mod.id} className="rounded-lg overflow-hidden border border-slate-800/50 bg-slate-800/20 mb-1">
                        <div className="flex items-center w-full hover:bg-slate-800 transition-colors pr-2">
                            <button
                                onClick={() => toggleExpand(mod.id)}
                                className="flex-1 flex items-center justify-between p-3 text-left"
                            >
                                <span className="font-medium text-slate-300 text-sm truncate pr-2">{mod.title}</span>
                                {expanded[mod.id] ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
                            </button>

                            {!isGroupingMode && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const allSelected = mod.submodules.every(sub => selectedItems.has(sub.id));
                                        toggleModuleSelection(mod.submodules.map(s => s.id), !allSelected);
                                    }}
                                    className="p-2 text-slate-500 hover:text-blue-400"
                                    title={mod.submodules.every(sub => selectedItems.has(sub.id)) ? "Unselect All" : "Select All"}
                                >
                                    {mod.submodules.every(sub => selectedItems.has(sub.id)) ? <CheckSquare size={16} /> : <Square size={16} />}
                                </button>
                            )}
                        </div>

                        {expanded[mod.id] && (
                            <div className="bg-slate-900/50 p-2 space-y-1 border-t border-slate-800/50">
                                {mod.submodules.map(sub => {
                                    const isSelected = selectedItems.has(sub.id);
                                    const weight = weights[sub.id] || 10;
                                    const isGrouped = groupingSet.has(sub.id);

                                    return (
                                        <div
                                            key={sub.id}
                                            className={`
                        flex flex-col gap-2 p-2 rounded transition-all border
                        ${isGroupingMode
                                                    ? (isGrouped ? 'bg-purple-500/10 border-purple-500/30' : 'border-transparent hover:bg-slate-800/50')
                                                    : (isSelected ? 'bg-blue-500/10 border-blue-500/20' : 'border-transparent hover:bg-slate-800/50')
                                                }
                      `}
                                        >
                                            <div className="flex items-start gap-3 cursor-pointer"
                                                onClick={() => isGroupingMode ? toggleOptionInGroup(sub.id) : toggleSelection(sub.id)}>

                                                <div className={`mt-0.5 ${isGroupingMode
                                                    ? (isGrouped ? 'text-purple-400' : 'text-slate-600')
                                                    : (isSelected ? 'text-blue-400' : 'text-slate-600')
                                                    }`}>
                                                    {isGroupingMode
                                                        ? (isGrouped ? <CheckSquare size={16} /> : <Square size={16} />)
                                                        : (isSelected ? <CheckSquare size={16} /> : <Square size={16} />)
                                                    }
                                                </div>
                                                <div className="flex-1">
                                                    <div className={`text-xs ${isGroupingMode
                                                        ? (isGrouped ? 'text-purple-200' : 'text-slate-400')
                                                        : (isSelected ? 'text-blue-200' : 'text-slate-400')
                                                        }`}>
                                                        {sub.title}
                                                    </div>
                                                    <div className="text-[10px] text-slate-600 uppercase font-bold tracking-wider mt-0.5">{sub.type}</div>
                                                </div>
                                            </div>

                                            {isSelected && !isGroupingMode && (
                                                <div className="flex items-center gap-2 pl-7 mt-1">
                                                    <span className="text-[10px] text-slate-500 bg-slate-800/50 px-1 rounded">Size</span>
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

            <div className="p-4 border-t border-slate-800 bg-slate-900/95 backdrop-blur z-20">
                <div className="flex justify-between items-center text-slate-400 text-xs">
                    <div>
                        <span className="text-blue-400 font-bold">{selectedItems.size}</span> items selected
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
