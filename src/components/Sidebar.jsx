import React from 'react';
import { Settings, FileText, ChevronRight, ChevronDown, CheckSquare, Square } from 'lucide-react';
import { useSheet } from '../context/SheetContext';

const Sidebar = () => {
    const { modules, selectedItems, toggleSelection, weights, updateWeight } = useSheet();
    const [expanded, setExpanded] = React.useState({});

    const toggleExpand = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <aside className="w-80 h-screen bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 overflow-hidden z-10 shadow-xl">
            <div className="p-4 border-b border-slate-800 bg-slate-900 z-20">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
                    <FileText className="text-blue-400" size={20} />
                    SheetGen
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
                {modules.map(mod => (
                    <div key={mod.id} className="rounded-lg overflow-hidden border border-slate-800/50 bg-slate-800/20">
                        <button
                            onClick={() => toggleExpand(mod.id)}
                            className="w-full flex items-center justify-between p-3 hover:bg-slate-800 transition-colors text-left"
                        >
                            <span className="font-medium text-slate-300 text-sm truncate pr-2">{mod.title}</span>
                            {expanded[mod.id] ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
                        </button>

                        {expanded[mod.id] && (
                            <div className="bg-slate-900/50 p-2 space-y-1 border-t border-slate-800/50">
                                {mod.submodules.map(sub => {
                                    const isSelected = selectedItems.has(sub.id);
                                    const weight = weights[sub.id] || 1;

                                    return (
                                        <div
                                            key={sub.id}
                                            className={`
                        flex flex-col gap-2 p-2 rounded transition-all border border-transparent
                        ${isSelected ? 'bg-blue-500/10 border-blue-500/20' : 'hover:bg-slate-800/50'}
                      `}
                                        >
                                            <div className="flex items-start gap-3 cursor-pointer" onClick={() => toggleSelection(sub.id)}>
                                                <div className={`mt-0.5 ${isSelected ? 'text-blue-400' : 'text-slate-600'}`}>
                                                    {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className={`text-xs ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                                                        {sub.title}
                                                    </div>
                                                    <div className="text-[10px] text-slate-600 uppercase font-bold tracking-wider mt-0.5">{sub.type}</div>
                                                </div>
                                            </div>

                                            {isSelected && (
                                                <div className="flex items-center gap-2 pl-7">
                                                    <span className="text-[10px] text-slate-500">Size:</span>
                                                    <div className="flex items-center bg-slate-800 rounded border border-slate-700">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); updateWeight(sub.id, Math.max(0.5, weight - 0.5)); }}
                                                            className="px-2 py-0.5 text-xs text-slate-400 hover:text-white border-r border-slate-700"
                                                        >-</button>
                                                        <span className="px-2 text-[10px] text-blue-300 min-w-[30px] text-center">{weight}x</span>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); updateWeight(sub.id, Math.min(3, weight + 0.5)); }}
                                                            className="px-2 py-0.5 text-xs text-slate-400 hover:text-white border-l border-slate-700"
                                                        >+</button>
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
