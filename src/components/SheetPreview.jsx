import React, { useMemo } from 'react';
import { useSheet } from '../context/SheetContext';
import { calculateLayout } from '../utils/layoutEngine';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const ModuleItem = ({ item }) => {
    // item.weight is now treated as font-size in px. Default to 10px if not set.
    const fontSize = item.weight || 10;

    return (
        <div className="mb-1 border border-slate-200 rounded p-[2px] break-inside-avoid bg-white" >
            <div className="font-bold text-slate-700 border-b border-slate-100 mb-0.5 flex justify-between items-center bg-slate-50 px-1">
                <span className="text-[9px] leading-tight">{item.title}</span>
                <span className="text-[7px] text-slate-400 font-normal truncate max-w-[40px]">{item.parentTitle}</span>
            </div>

            <div className="module-content overflow-hidden px-1" style={{ fontSize: `${fontSize}px` }}>
                {item.type === 'text' && (
                    <div className="whitespace-pre-wrap font-serif leading-tight text-slate-800" style={{ fontSize: '1em' }}>
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
                    <div className="bg-slate-50 p-0.5 rounded font-mono whitespace-pre overflow-x-auto leading-tight" style={{ fontSize: '0.9em' }}>
                        {item.content}
                    </div>
                )}
            </div>
        </div>
    )
}

const A4Page = ({ pageNumber, columns }) => {
    return (
        <div id={`page-${pageNumber}`} className="bg-white w-[210mm] h-[297mm] shadow-2xl relative mx-auto mb-8 transition-all duration-300 origin-top flex flex-col overflow-hidden group print:shadow-none print:mb-0 print:w-full print:h-full">
            {/* Helper Grid Overlay (Hover only) */}
            <div className="absolute inset-0 pointer-events-none border border-red-500/0 group-hover:border-red-500/20 transition-colors z-50 print:hidden" />

            {/* Page Content */}
            <div className="flex-1 p-[3mm] text-slate-900">
                <h3 className="font-bold text-[10px] mb-1 text-center border-b border-slate-300 pb-0.5 uppercase tracking-widest text-slate-500">
                    CSEN701 Cheatsheet <span className="mx-1">•</span> Page {pageNumber}
                </h3>

                <div className="grid grid-cols-2 gap-1.5 h-full items-start">
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
            <div className="absolute bottom-1 right-2 text-[6px] text-slate-300 font-mono">
                {pageNumber}
            </div>
        </div>
    );
};

const SheetPreview = () => {
    const { modules, selectedItems, weights } = useSheet();

    const { pages, overflow } = useMemo(() => {
        return calculateLayout(modules, selectedItems, weights);
    }, [modules, selectedItems, weights]);

    // Handle Print
    const handlePrint = () => {
        window.print();
    };

    return (
        <main className="ml-80 flex-1 min-h-screen bg-slate-950 p-8 overflow-y-auto print:ml-0 print:p-0 print:overflow-visible">
            <div className="max-w-[220mm] mx-auto print:max-w-none print:w-full print:mx-0">
                <div className="flex justify-between items-center mb-6 print:hidden">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Live Preview</h1>
                        {overflow.length > 0 && (
                            <div className="text-red-400 text-sm mt-1 flex items-center gap-1 animate-pulse">
                                ⚠️ {overflow.length} items overflowing! Decrease weights or remove items.
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2"
                        >
                            Print / Save PDF
                        </button>
                    </div>
                </div>

                <div className="print-area">
                    {/* Page 1 */}
                    <A4Page pageNumber={1} columns={pages[0].columns} />

                    {/* Page 2 */}
                    <A4Page pageNumber={2} columns={pages[1].columns} />
                </div>
            </div>
        </main>
    );
};

export default SheetPreview;
