import React from 'react';
import { X, GitCommit, Calendar, Tag } from 'lucide-react';
import { APP_VERSION } from '../constants';

const ChangelogModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const changelog = [
        {
            version: '1.22',
            date: '2026-01-03',
            changes: [
                'Maximized layout density (SAFE_HEIGHT: 1098px)',
                'Removed vertical module padding for tighter packing',
                'Optimized margin logic (last:mb-0)',
                'Removed floating Manual Mode banner',
                'Refined print preview margins'
            ]
        },
        {
            version: '1.21',
            date: '2026-01-03',
            changes: [
                'Fixed drag-drop reverting sort order',
                'Enabled text selection in non-manual modes',
                'Added print safety warning (Flash)',
                'Expanded Operator Handbook with LaTeX guide',
                'Fixed standard modal closing behavior',
                'Addressed critical launch bugs'
            ]
        },
        {
            version: '1.2',
            date: '2026-01-03',
            changes: [
                'Implemented MANUAL sorting mode (Exclusive Drag & Drop)',
                'Added Operator Handbook (Manual Modal)',
                'Added Changelog interface',
                'Refactored Sidebar: Cleaned up legacy tooltips',
                'Optimized sub-pixel module packing'
            ]
        },
        {
            version: '1.1',
            date: '2026-01-02',
            changes: [
                'Added TABLE module support (Pipe-separated input)',
                'Implemented Layout Grouping (Compact, Type)',
                'Added Contributors section to About System',
                'Fixed silent overflow on Page 2'
            ]
        },
        {
            version: '1.0',
            date: '2026-01-02',
            changes: [
                'Initial System Launch',
                'Core Module Types: Text, Image, Formula, Code',
                'PDF Export Capability',
                'Basic Tutorial Sequence'
            ]
        }
    ];

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="w-full max-w-lg bg-[#0a0a0a] border border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.15)] flex flex-col font-mono relative overflow-hidden h-[70vh]" onClick={(e) => e.stopPropagation()}>

                {/* Scanlines */}
                <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-size-[100%_4px] z-10"></div>

                {/* Header */}
                <div className="flex justify-between items-center p-2 border-b border-blue-900 bg-[#050a14]">
                    <div className="flex items-center gap-2 text-blue-500">
                        <GitCommit size={16} />
                        <span className="font-bold text-sm tracking-wider">CHANGE_LOG_HISTORY</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-blue-700 hover:text-blue-400 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-transparent">
                    {changelog.map((log, i) => (
                        <div key={log.version} className="relative pl-6 border-l border-blue-900/30">
                            {/* Dot */}
                            <div className={`absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full border-2 border-[#0a0a0a] ${i === 0 ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-blue-900'}`}></div>

                            <div className="flex items-baseline justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className={`font-bold text-lg ${i === 0 ? 'text-blue-400' : 'text-slate-500'}`}>v{log.version}</span>
                                    {i === 0 && <span className="text-[9px] bg-blue-900/30 text-blue-300 px-1 rounded border border-blue-500/30">LATEST</span>}
                                </div>
                                <div className="text-xs text-slate-600 font-mono flex items-center gap-1">
                                    <Calendar size={10} />
                                    {log.date}
                                </div>
                            </div>

                            <ul className="space-y-2">
                                {log.changes.map((change, idx) => (
                                    <li key={idx} className="text-xs text-slate-400 flex items-start gap-2 leading-relaxed">
                                        <span className="text-blue-900 mt-1">●</span>
                                        {change}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChangelogModal;
