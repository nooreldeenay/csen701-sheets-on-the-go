
import React from 'react';
import { Settings, FileText, ChevronRight, ChevronDown, CheckSquare, Square, Plus, Trash, Image as ImageIcon, Type, Code, Layers, X, Check, Edit2, Minus, Terminal } from 'lucide-react';
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

    // Component for Retro Size Control
    const SizeControl = ({ value, onChange }) => (
        <div className="flex items-center border border-slate-600 bg-black">
            <button
                onClick={(e) => { e.stopPropagation(); onChange((value || 10) - 1); }}
                className="px-2 py-0.5 hover:bg-green-500 hover:text-black text-green-500 transition-colors border-r border-slate-600"
            >
                -
            </button>
            <span className="w-8 text-[10px] text-center text-green-400 font-bold select-none font-mono">{value || 10}</span>
            <button
                onClick={(e) => { e.stopPropagation(); onChange((value || 10) + 1); }}
                className="px-2 py-0.5 hover:bg-green-500 hover:text-black text-green-500 transition-colors border-l border-slate-600"
            >
                +
            </button>
        </div>
    );

    return (
        <aside className="w-80 h-screen bg-[#0a0a0a] border-r-2 border-slate-800 flex flex-col fixed left-0 top-0 overflow-hidden z-10 font-mono">
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
                            onClick={toggleGroupingMode}
                            className={`text-[10px] px-2 py-1 border transition-all flex items-center gap-1 uppercase tracking-wider font-bold ${isGroupingMode
                                ? 'bg-purple-600 text-black border-purple-400'
                                : 'bg-transparent text-slate-400 border-slate-600 hover:border-green-500 hover:text-green-500'}`}
                        >
                            {isGroupingMode ? '[ STOP_MERGE ]' : '[ MERGE_MODE ]'}
                        </button>
                    </div>

                    <div className="relative group">
                        <span className="absolute left-2 top-1.5 text-xs text-slate-600 font-bold select-none">{'>'}</span>
                        <input
                            value={sheetName}
                            onChange={(e) => setSheetName(e.target.value)}
                            className="w-full bg-[#111] border border-slate-700 hover:border-green-500 focus:border-green-400 pl-6 pr-2 py-1 text-sm text-green-400 placeholder-slate-700 focus:outline-none transition-colors uppercase"
                            placeholder="PROJECT_NAME"
                        />
                    </div>
                </div>

                {isGroupingMode && (
                    <div className="border border-purple-500 bg-[#1a051a] p-2">
                        <div className="flex justify-between items-center mb-2 border-b border-purple-900 pb-1">
                            <span className="text-[10px] text-purple-400 font-bold uppercase blink">!! MERGE SEQUENCE ACTIVE !!</span>
                            <span className="text-[10px] text-purple-300">{groupingSet.size} SELECTED</span>
                        </div>
                        <button
                            onClick={createGroupFromSelection}
                            disabled={groupingSet.size < 2}
                            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed text-black text-xs py-2 font-bold uppercase tracking-widest border border-purple-400"
                        >
                            {groupingSet.size < 2 ? 'SELECT ITEMS...' : '>> EXECUTE MERGE <<'}
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin">
                {/* Custom Content Section */}
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

                            {/* Controls */}
                            <div className="grid grid-cols-3 gap-2">
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
                                                <input
                                                    className="bg-transparent text-xs text-cyan-400 w-full border-none focus:ring-0 p-0 font-bold placeholder-slate-700 uppercase"
                                                    value={item.title}
                                                    onChange={(e) => updateCustomModule(item.id, { title: e.target.value })}
                                                />
                                                <button onClick={() => removeCustomModule(item.id)} className="text-slate-700 hover:text-red-500">
                                                    <Trash size={10} />
                                                </button>
                                            </div>

                                            {/* Meta */}
                                            <div className="flex justify-between items-center">
                                                <span className="text-[8px] text-slate-500 uppercase tracking-tighter">TYPE: {item.type}</span>
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
                                                    className="w-full bg-black text-[10px] text-slate-300 border border-slate-800 p-1 font-mono focus:border-green-500 focus:outline-none"
                                                    value={item.content}
                                                    onChange={(e) => updateCustomModule(item.id, { content: e.target.value })}
                                                    rows={2}
                                                />
                                            )}
                                            {item.type === 'formula' && (
                                                <input
                                                    className="w-full bg-black text-[10px] text-yellow-500 border border-slate-800 p-1 font-mono focus:border-green-500 focus:outline-none"
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

                {/* Modules List */}
                <div className="space-y-1">
                    <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest pl-1 mb-1">
                        root/standard_lib
                    </div>
                    {modules.map(mod => (
                        <div key={mod.id} className="border border-slate-800 bg-[#0a0a0a]">
                            <div className="flex items-center w-full hover:bg-[#111] transition-colors pr-2">
                                <button
                                    onClick={() => toggleExpand(mod.id)}
                                    className="flex-1 flex items-center justify-between p-2 text-left group"
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
                                            toggleModuleSelection(mod.submodules.map(s => s.id), !allSelected);
                                        }}
                                        className="p-1 text-slate-600 hover:text-green-400 font-mono text-[10px]"
                                        title="TOGGLE_ALL"
                                    >
                                        {mod.submodules.every(sub => selectedItems.has(sub.id)) ? '[*]' : '[_]'}
                                    </button>
                                )}
                            </div>

                            {expanded[mod.id] && (
                                <div className="bg-[#050505] p-2 space-y-1 border-t border-slate-800">
                                    {mod.submodules.map(sub => {
                                        const isSelected = selectedItems.has(sub.id);
                                        const weight = weights[sub.id] || 10;
                                        const isGrouped = groupingSet.has(sub.id);

                                        return (
                                            <div
                                                key={sub.id}
                                                className={`
                            flex flex-col gap-2 p-1.5 border
                            ${isGroupingMode
                                                        ? (isGrouped ? 'border-purple-500 bg-purple-900/10' : 'border-transparent opacity-50 hover:opacity-100 hover:border-purple-900')
                                                        : (isSelected ? 'border-green-800 bg-green-900/10' : 'border-transparent hover:border-slate-800')
                                                    }
                          `}
                                            >
                                                <div className="flex items-start gap-2 cursor-pointer"
                                                    onClick={() => isGroupingMode ? toggleOptionInGroup(sub.id) : toggleSelection(sub.id)}>

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
                                                        <div className={`text-xs ${isGroupingMode
                                                            ? (isGrouped ? 'text-purple-100' : 'text-slate-500')
                                                            : (isSelected ? 'text-green-100' : 'text-slate-500')
                                                            }`}>
                                                            {sub.title}
                                                        </div>
                                                        <div className="text-[8px] text-slate-600 uppercase tracking-tighter mt-0.5">{sub.type}</div>
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
                    <div>MEM_USAGE: LOW</div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
