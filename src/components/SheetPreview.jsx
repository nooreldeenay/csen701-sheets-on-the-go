
import React, { useMemo } from 'react';
import { useSheet } from '../context/SheetContext';
import { calculateLayout } from '../utils/layoutEngine';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const ModuleItem = ({ item }) => {
    // item.weight is now treated as font-size in px. Default to 10px if not set.
    const fontSize = item.weight || 10;

    return (
        <div className="mb-1 rounded p-[1px] break-inside-avoid" >
            <div className="font-bold text-slate-900 mb-0.5 flex justify-between items-baseline px-0.5 border-b border-slate-200">
                <span className="text-[9px] leading-tight">{item.title}</span>
                <span className="text-[7px] text-slate-400 font-normal truncate max-w-[40px] ml-1">{item.parentTitle}</span>
            </div>

            <div className="module-content overflow-hidden px-0.5" style={{ fontSize: `${fontSize}px` }}>
                {item.type === 'text' && (
                    <div className="whitespace-pre-wrap font-serif leading-tight text-slate-900" style={{ fontSize: '1em' }}>
                        {item.content}
                    </div>
                )}

                {item.type === 'image' && (
                    <div className="flex justify-center">
                        <img
                            src={item.src}
                            className="object-contain rounded"
                            // approximate image height scaling based on font size to keep ratio
                            style={{ maxHeight: `${fontSize * 15}px` }}
                        />
                    </div>
                )}

                {item.type === 'formula' && (
                    <div className="text-center my-0.5" style={{ fontSize: '1.2em' }}>
                        <InlineMath math={item.content} />
                    </div>
                )}

                {item.type === 'code' && (
                    <div className="font-mono text-slate-800 break-all whitespace-pre-wrap leading-tight border-l-2 border-slate-300 pl-1" style={{ fontSize: '0.9em' }}>
                        {item.content}
                    </div>
                )}

                {item.type === 'row' && (
                    <div className="flex gap-2">
                        {item.content.map((subItem, idx) => (
                            <div key={idx} className="flex-1 min-w-0">
                                <ModuleItem item={{ ...subItem, weight: item.weight }} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

const A4Page = ({ pageNumber, columns, sheetName }) => {
    return (
        <div id={`page-${pageNumber}`} className="bg-white w-[210mm] h-[297mm] shadow-[0_0_20px_rgba(0,0,0,0.5)] relative mx-auto mb-16 transition-all duration-300 origin-top flex flex-col overflow-hidden group print:shadow-none print:mb-0 print:w-full print:h-full">
            {/* Helper Grid Overlay (Hover only) */}
            <div className="absolute inset-0 pointer-events-none border border-red-500/0 group-hover:border-red-500/20 transition-colors z-50 print:hidden" />

            {/* Page Content */}
            <div className="flex-1 p-[4mm] text-slate-900">
                <div className="grid grid-cols-2 gap-2 h-full items-start">
                    {/* Column 1 */}
                    <div className="h-full flex flex-col">
                        {columns[0].map((item, i) => (
                            <ModuleItem key={`${item.id}-col1-${i}`} item={item} />
                        ))}
                    </div>

                    {/* Column 2 */}
                    <div className="h-full flex flex-col">
                        {columns[1].map((item, i) => (
                            <ModuleItem key={`${item.id}-col2-${i}`} item={item} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-1 w-full px-4 flex justify-between items-end border-t border-slate-100 pt-0.5">
                <span className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">CSEN701 Datasheet - {sheetName}</span>
                <span className="text-[8px] text-slate-400 font-mono">{pageNumber}</span>
            </div>
        </div>
    );
};

const SheetPreview = () => {
    const { modules, customModules, selectedItems, weights, sheetName, isGroupingMode } = useSheet();

    const { pages, overflow } = useMemo(() => {
        // Let's create a virtual module for Custom items
        const allModules = [...modules];
        if (customModules.length > 0) {
            allModules.push({
                id: 'custom-group',
                title: 'Custom Items',
                submodules: customModules
            });
        }

        return calculateLayout(allModules, selectedItems, weights);
    }, [modules, customModules, selectedItems, weights]);

    // Handle Print
    const handlePrint = () => {
        // optional validation
        if (sheetName.trim() === '' || sheetName === 'Student Name') {
            const name = prompt("Enter Sheet Name:", sheetName);
            // Ignoring set logic, just proceed
        }
        window.print();
    };

    return (
        <main className="ml-80 flex-1 min-h-screen bg-[#111] p-8 overflow-y-auto print:ml-0 print:p-0 print:overflow-visible relative font-mono text-slate-300">

            {/* Background Decor */}
            <div className="absolute inset-0 z-0 opacity-5 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            ></div>

            {/* Grouping Mode Overlay */}
            {isGroupingMode && (
                <div className="sticky top-0 z-50 mb-6 bg-purple-900/90 text-purple-100 border border-purple-500 p-4 shadow-[0_0_20px_rgba(168,85,247,0.3)] flex justify-between items-center print:hidden">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-500/20 p-2 border border-purple-400">
                            <span className="font-bold text-xl">!</span>
                        </div>
                        <div>
                            <h3 className="font-bold uppercase tracking-wider text-purple-300">>> MERGE_MODE_ENGAGED</h3>
                            <p className="text-xs font-mono text-purple-200">Select items from control panel to fuse.</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-[220mm] mx-auto relative z-10 print:max-w-none print:w-full print:mx-0">
                <div className="flex justify-between items-center mb-8 print:hidden">
                    <div className="space-y-1">
                        <h1 className="text-xl font-bold text-green-500 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-4 bg-green-500 animate-pulse inline-block"></span>
                            LIVE_PREVIEW_FEED
                        </h1>
                        {overflow.length > 0 && (
                            <div className="text-red-500 text-xs font-mono flex items-center gap-2 border border-red-900 bg-red-900/10 px-2 py-1">
                                [WARNING] BUFF_OVERFLOW: {overflow.length} ITEM(S)
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handlePrint}
                        className="px-6 py-2 bg-green-600 hover:bg-green-500 text-black font-bold uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] border border-green-400"
                    >
                        [ PRINT_ / SAVE_PDF ]
                    </button>
                </div>

                <div className="print-area drop-shadow-2xl">
                    {/* Page 1 */}
                    <A4Page pageNumber={1} columns={pages[0].columns} sheetName={sheetName} />

                    {/* Page 2 */}
                    <A4Page pageNumber={2} columns={pages[1].columns} sheetName={sheetName} />
                </div>
            </div>
        </main>
    );
};

export default SheetPreview;
