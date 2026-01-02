
import React from 'react';
import { Settings, FileText, ChevronRight, ChevronDown, CheckSquare, Square, Plus, Trash, Image as ImageIcon, Type, Code, Layers, X, Check } from 'lucide-react';
import { useSheet } from '../context/SheetContext';

const Sidebar = () => {
    const {
        modules, customModules, selectedItems, toggleSelection, toggleModuleSelection, weights, updateWeight,
        addCustomModule, removeCustomModule, updateCustomModule,
        isGroupingMode, groupingSet, toggleGroupingMode, toggleOptionInGroup, createGroupFromSelection,
        lastCreatedGroupId
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

    return (
        <aside className="w-80 h-screen bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 overflow-hidden z-10 shadow-xl">
            <div className="p-4 border-b border-slate-800 bg-slate-900 z-20 space-y-3">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
                        <FileText className="text-blue-400" size={20} />
                        SheetGen
                    </h2>

                    <button
                        onClick={toggleGroupingMode}
                        className={`text-xs px-2 py-1 rounded border transition-colors flex items-center gap-1 ${isGroupingMode
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'}`}
                    >
                        {isGroupingMode ? <X size={12} /> : <Layers size={12} />}
                        {isGroupingMode ? 'Cancel' : 'Group Merge'}
                    </button>
                </div>

                {isGroupingMode && (
                    <div className="bg-purple-900/20 border border-purple-500/30 rounded p-2">
                        <p className="text-[10px] text-purple-200 mb-2">Select items to merge into one row ({groupingSet.size} selected)</p>
                        <button
                            onClick={createGroupFromSelection}
                            disabled={groupingSet.size < 2}
                            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs py-1 rounded flex items-center justify-center gap-1"
                        >
                            <Check size={12} /> Merge Selected
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
                            <p className="text-[10px] text-orange-400 bg-orange-900/20 p-1 rounded border border-orange-900/50">
                                Warning: Custom items are lost when you close the tab.
                            </p>

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
                                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] px-2 py-1 rounded border border-slate-600 flex-1"
                                >+ Text</button>

                                <label className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] px-2 py-1 rounded border border-slate-600 flex-1 cursor-pointer text-center">
                                    + Img
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
                                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] px-2 py-1 rounded border border-slate-600 flex-1"
                                >+ Math</button>
                            </div>

                            {/* List Custom Items */}
                            {customModules.map(item => (
                                <div key={item.id} className={`flex flex-col gap-2 p-2 rounded border border-slate-700 transition-all duration-500
                                            ${item.id === lastCreatedGroupId ? 'bg-purple-500/30 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-slate-800'}
                                        `}>
                                    <div className="flex items-start gap-2">
                                        {/* Selection Checkbox */}
                                        <button
                                            onClick={() => isGroupingMode ? toggleOptionInGroup(item.id) : toggleSelection(item.id)}
                                            className={`mt-1 ${isGroupingMode
                                                    ? (groupingSet.has(item.id) ? "text-purple-400" : "text-slate-600")
                                                    : (selectedItems.has(item.id) ? "text-blue-400" : "text-slate-600")
                                                }`}
                                        >
                                            {isGroupingMode
                                                ? (groupingSet.has(item.id) ? <CheckSquare size={14} /> : <Square size={14} />)
                                                : (selectedItems.has(item.id) ? <CheckSquare size={14} /> : <Square size={14} />)
                                            }
                                        </button>

                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex justify-between items-center gap-2">
                                                <input
                                                    className="bg-transparent text-xs text-white w-full border-none focus:ring-0 p-0 font-bold placeholder-slate-500"
                                                    value={item.title}
                                                    placeholder="Title..."
                                                    onChange={(e) => updateCustomModule(item.id, { title: e.target.value })}
                                                />
                                                <button onClick={() => removeCustomModule(item.id)} className="text-red-400 hover:text-red-300">
                                                    <Trash size={12} />
                                                </button>
                                            </div>

                                            {/* Type label + Size Control */}
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] text-slate-500 uppercase">{item.type}</span>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[9px] text-slate-500">px:</span>
                                                    <input
                                                        type="number"
                                                        min="6"
                                                        max="40"
                                                        className="w-8 bg-slate-900 text-[10px] text-center text-white rounded border border-slate-600 p-0.5"
                                                        value={item.weight || 10}
                                                        onChange={(e) => {
                                                            const val = parseInt(e.target.value) || 10;
                                                            updateCustomModule(item.id, { weight: val });
                                                            updateWeight(item.id, val);
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Content Editor */}
                                            {item.type === 'text' && (
                                                <textarea
                                                    className="w-full bg-slate-900/50 text-[10px] text-slate-300 border border-slate-700 rounded p-1 resize-y min-h-[40px]"
                                                    value={item.content}
                                                    onChange={(e) => updateCustomModule(item.id, { content: e.target.value })}
                                                />
                                            )}
                                            {item.type === 'formula' && (
                                                <input
                                                    className="w-full bg-slate-900/50 text-[10px] text-slate-300 border border-slate-700 rounded p-1 font-mono"
                                                    value={item.content}
                                                    onChange={(e) => updateCustomModule(item.id, { content: e.target.value })}
                                                />
                                            )}
                                            {/* Image doesn't need content editor, just view */}
                                            {item.type === 'image' && (
                                                <div className="text-[9px] text-slate-500 italic truncate max-w-[150px]">
                                                    {item.title} (Image)
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
                    <div key={mod.id} className="rounded-lg overflow-hidden border border-slate-800/50 bg-slate-800/20">
                        <div className="flex items-center w-full hover:bg-slate-800 transition-colors pr-2">
                            <button
                                onClick={() => toggleExpand(mod.id)}
                                className="flex-1 flex items-center justify-between p-3 text-left"
                            >
                                <span className="font-medium text-slate-300 text-sm truncate pr-2">{mod.title}</span>
                                {expanded[mod.id] ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Check if all are selected
                                    const allSelected = mod.submodules.every(sub => selectedItems.has(sub.id));
                                    toggleModuleSelection(mod.submodules.map(s => s.id), !allSelected);
                                }}
                                className="p-2 text-slate-500 hover:text-blue-400"
                                title={mod.submodules.every(sub => selectedItems.has(sub.id)) ? "Unselect All" : "Select All"}
                            >
                                {mod.submodules.every(sub => selectedItems.has(sub.id)) ? <CheckSquare size={16} /> : <Square size={16} />}
                            </button>
                        </div>

                        {expanded[mod.id] && (
                            <div className="bg-slate-900/50 p-2 space-y-1 border-t border-slate-800/50">
                                {mod.submodules.map(sub => {
                                    const isSelected = selectedItems.has(sub.id);
                                    const weight = weights[sub.id] || 10;

                                    return (
                                        <div
                                            key={sub.id}
                                            className={`
                        flex flex-col gap-2 p-2 rounded transition-all border border-transparent
                        ${isSelected ? 'bg-blue-500/10 border-blue-500/20' : 'hover:bg-slate-800/50'}
                        ${isGroupingMode && groupingSet.has(sub.id) ? 'ring-1 ring-purple-500 bg-purple-500/10' : ''}
                      `}
                                        >
                                            <div className="flex items-start gap-3 cursor-pointer"
                                                onClick={() => isGroupingMode ? toggleOptionInGroup(sub.id) : toggleSelection(sub.id)}>

                                                <div className={`mt-0.5 ${isGroupingMode
                                                    ? (groupingSet.has(sub.id) ? 'text-purple-400' : 'text-slate-600')
                                                    : (isSelected ? 'text-blue-400' : 'text-slate-600')
                                                    }`}>
                                                    {isGroupingMode
                                                        ? (groupingSet.has(sub.id) ? <CheckSquare size={16} /> : <Square size={16} />)
                                                        : (isSelected ? <CheckSquare size={16} /> : <Square size={16} />)
                                                    }
                                                </div>
                                                <div className="flex-1">
                                                    <div className={`text-xs ${isGroupingMode
                                                        ? (groupingSet.has(sub.id) ? 'text-purple-200' : 'text-slate-400')
                                                        : (isSelected ? 'text-blue-200' : 'text-slate-400')
                                                        }`}>
                                                        {sub.title}
                                                    </div>
                                                    <div className="text-[10px] text-slate-600 uppercase font-bold tracking-wider mt-0.5">{sub.type}</div>
                                                </div>
                                            </div>

                                            {isSelected && (
                                                <div className="flex items-center gap-2 pl-7 mt-1">
                                                    <span className="text-[10px] text-slate-500">Size (px):</span>
                                                    <div className="flex items-center bg-slate-800 rounded border border-slate-700 w-16">
                                                        <input
                                                            type="number"
                                                            min="6"
                                                            max="30"
                                                            value={weight || 10}
                                                            onClick={(e) => e.stopPropagation()}
                                                            onChange={(e) => {
                                                                const val = parseInt(e.target.value) || 10;
                                                                updateWeight(sub.id, val);
                                                            }}
                                                            className="w-full bg-transparent text-[10px] text-white text-center p-0.5 border-none focus:ring-0 appearance-none"
                                                        />
                                                    </div>
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
