
import React, { useMemo, useState, useLayoutEffect, useRef, useEffect } from 'react';
import { useSheet } from '../context/SheetContext';
import { useTutorial } from '../context/TutorialContext';
import { calculateLayout } from '../utils/layoutEngine';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const ModuleItem = ({ item, compact = false, mergeDirection = 'horizontal', isDragging = false, draggedId = null, dropTargetId = null, onDragStart = null, onDragOver = null, onDrop = null, groupingStrategy = 'default' }) => {
    // item.weight is now treated as font-size in px. Default to 10px if not set.
    const fontSize = item.weight || 10;
    const isCurrentlyDragged = draggedId === item.id;
    const isDropTarget = dropTargetId === item.id;

    return (
        <div
            className={`mb-px last:mb-0 rounded px-px py-0 break-inside-avoid transition-all relative
                ${isDragging ? 'cursor-grabbing' : (groupingStrategy === 'manual' ? 'cursor-grab' : 'cursor-text')}
                ${isCurrentlyDragged ? 'opacity-20 grayscale' : ''} 
                ${isDropTarget && draggedId && draggedId !== item.id ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-[#111] z-50 scale-[1.02]' : ''}
            `}
            style={{ pageBreakInside: 'avoid', breakInside: 'avoid-column' }}
            draggable={groupingStrategy === 'manual' && !isDragging}
            onDragStart={(e) => onDragStart && onDragStart(item.id, e)}
            onDragOver={(e) => {
                e.preventDefault();
                onDragOver && onDragOver(item.id, e);
            }}
            onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDrop && onDrop(item.id, e);
            }}
            onDragLeave={(e) => {
                e.preventDefault();
            }}
        >
            {isDropTarget && draggedId && draggedId !== item.id && (
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center z-50 pointer-events-none rounded">
                    <span className="text-green-900 font-bold bg-green-400 px-2 py-1 rounded text-[10px] shadow-sm uppercase tracking-wider">
                        Swap Here
                    </span>
                </div>
            )}
            {!compact && (
                <div className="font-bold text-slate-900 mb-0 flex justify-between items-baseline px-0.5 border-b border-slate-200">
                    <span className="text-[8px] leading-tight">{item.title}</span>
                    <span className="text-[7px] text-slate-400 font-normal truncate max-w-[60px] ml-1">{item.parentTitle}</span>
                </div>
            )}

            <div className="module-content overflow-hidden px-0.5" style={{ fontSize: `${fontSize}px` }}>
                {item.type === 'text' && (
                    <div className="whitespace-pre-wrap font-sans slashed-zero leading-tight text-slate-900" style={{ fontSize: '1em' }}>
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

                {item.type === 'table' && (
                    <div className="w-full overflow-hidden">
                        <table className="w-full border-collapse border border-slate-400 text-slate-900 leading-tight" style={{ fontSize: '0.9em' }}>
                            <tbody>
                                {item.content.split('\n').filter(r => r.trim()).map((row, rIdx) => (
                                    <tr key={rIdx}>
                                        {row.split('|').map((cell, cIdx) => (
                                            <td key={cIdx} className={`border border-slate-300 px-1 py-0.5 ${rIdx === 0 ? 'bg-slate-100 font-bold' : ''}`}>
                                                {cell.trim()}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {item.type === 'row' && (
                    <div className={(item.mergeDirection || mergeDirection) === 'vertical' ? 'flex flex-col gap-2' : 'flex gap-2'}>
                        {item.content.map((subItem, idx) => (
                            <div key={idx} className={(item.mergeDirection || mergeDirection) === 'vertical' ? 'w-full' : 'flex-1 min-w-0'}>
                                <ModuleItem item={{ ...subItem, weight: item.weight }} compact={true} mergeDirection={item.mergeDirection || mergeDirection} isDragging={isDragging} draggedId={draggedId} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

const A4Page = ({ pageNumber, items, sheetName, mergeDirection = 'horizontal', isDragging = false, draggedId = null, dropTargetId = null, onDragStart = null, onDragOver = null, onDrop = null, groupingStrategy }) => {
    return (
        <div
            id={`page-${pageNumber}`}
            className="bg-white w-[210mm] h-[297mm] shadow-[0_0_20px_rgba(0,0,0,0.5)] relative mx-auto mb-16 transition-all duration-300 origin-top flex flex-col group print:overflow-hidden print:shadow-none print:mb-0 print:mx-0 print:page-break-after-always"
            style={{ pageBreakAfter: 'always', breakAfter: 'page' }}
        >
            {/* Helper Grid Overlay (Hover only) */}
            <div className="absolute inset-0 pointer-events-none border border-red-500/0 group-hover:border-red-500/20 transition-colors z-50 print:hidden" />

            {/* Page Content */}
            <div
                className="flex-1 p-[1.5mm] pb-0 text-slate-900 overflow-hidden print:p-[1.5mm] print:h-[290mm] print:overflow-hidden"
                style={{ maxHeight: 'calc(297mm - 6mm)' }}
            >
                <div
                    className="columns-2 gap-[1mm] h-full"
                    style={{
                        columnFill: 'auto',
                        columnGap: '1mm',
                        height: '100%'
                    }}
                >
                    {items.map((item, i) => (
                        <ModuleItem key={`${item.id}-${i}`} item={item} mergeDirection={mergeDirection} isDragging={isDragging} draggedId={draggedId} dropTargetId={dropTargetId} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} groupingStrategy={groupingStrategy} />
                    ))}
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

const OverflowSection = ({ items, isDragging = false, draggedId = null, dropTargetId = null, onDragStart = null, onDragOver = null, onDrop = null, groupingStrategy }) => {
    if (items.length === 0) return null;
    return (
        <div className="mt-16 p-8 border border-dashed border-red-900 bg-red-950/10 relative print:hidden">
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6 border-b border-red-900/50 pb-4">
                    <div className="bg-red-600 text-white px-3 py-1 font-bold text-xl font-mono">!</div>
                    <div>
                        <h2 className="text-red-500 font-bold text-lg leading-tight uppercase tracking-widest font-mono">BUFFER_OVERFLOW_DETECTED</h2>
                        <p className="text-red-400/70 text-[10px] font-mono uppercase tracking-tighter">These units have been dropped from the primary 2-page memory sequence.</p>
                    </div>
                </div>
                <div className="columns-2 gap-6 space-y-4">
                    {items.map((item, i) => (
                        <div key={i} className="bg-white p-1 border border-slate-200 shadow-[2px_2px_0px_rgba(153,27,27,0.2)] break-inside-avoid">
                            <ModuleItem item={item} isDragging={isDragging} draggedId={draggedId} dropTargetId={dropTargetId} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} groupingStrategy={groupingStrategy} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Hidden container to measure exact heights of modules
const MeasurementContainer = ({ items, onMeasure, mergeDirection = 'horizontal' }) => {
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const measure = () => {
            const newHeights = {};
            const nodes = containerRef.current.children;

            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                const id = node.dataset.id;
                if (id) {
                    // Get height including margin (mb-px)
                    // mb-px is 1px.
                    const rect = node.getBoundingClientRect();
                    // Use Math.ceil to avoid sub-pixel underestimation errors which cause overflow
                    // +1 for the margin-bottom (mb-px)
                    newHeights[id] = Math.ceil(rect.height) + 1;
                }
            }
            onMeasure(newHeights);
        };

        // Small delay to ensure images/fonts load and layout stabilizes
        const timer = setTimeout(() => {
            measure();
        }, 200);

        return () => clearTimeout(timer);

    }, [items, onMeasure, mergeDirection]);

    // Width must match the column width of the A4 page exactly.
    // A4 Page width = 210mm
    // Padding = 1.5mm * 2 = 3mm
    // Content width = 207mm
    // 2 Columns with 1mm gap -> (207 - 1) / 2 = 103mm
    return (
        <div
            ref={containerRef}
            className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none bg-white text-slate-900 print:hidden"
            style={{
                width: '102.5mm', // Slightly narrower than 103mm to ensure text wrapping is conservative (over-estimates height)
                visibility: 'hidden',
                position: 'fixed'
            }}
        >
            {items.map((item, i) => (
                <div key={`${item.id}-measure`} data-id={item.id}>
                    <ModuleItem item={item} mergeDirection={mergeDirection} />
                </div>
            ))}
        </div>
    );
};

const SheetPreview = () => {
    const { sheetName, isGroupingMode, setHighlightNameInput, pages, overflow, itemsToMeasure, updateMeasuredHeights, mergeDirection, swapNodePositions, hasManualOrder, resetToAutoOrder, groupingStrategy } = useSheet();
    const { showPreview } = useTutorial();
    const [showTooltip, setShowTooltip] = useState(false);
    const [draggedId, setDraggedId] = useState(null);
    const [dragClonePos, setDragClonePos] = useState({ x: 0, y: 0 });
    const [draggedItem, setDraggedItem] = useState(null);
    const [dropTargetId, setDropTargetId] = useState(null);

    // Zoom State
    const [zoom, setZoom] = useState(1);
    const adjustZoom = (delta) => {
        setZoom(prev => {
            const newZoom = Math.round((prev + delta) * 10) / 10;
            return Math.max(0.5, Math.min(2.0, newZoom));
        });
    };

    // DEBUG: Monitor layout flow
    console.log(`[PREVIEW] P1:${pages[0].items.length} P2:${pages[1].items.length} OVER:${overflow.length}`);

    // Handle drag start
    const handleDragStart = (itemId, event) => {
        // Only allow drag if we are in Manual Sort mode
        // hasManualOrder might be true if we just engaged it, OR if explicitly set to 'manual' (which we need to ensure triggers hasManualOrder or check groupingStrategy)
        // Checking groupingStrategy is safer as per new requirement "4th sorting method called manual"
        if (groupingStrategy !== 'manual') {
            event.preventDefault();
            return;
        }

        const allItems = [...pages[0].items, ...pages[1].items, ...overflow];
        const item = allItems.find(i => i.id === itemId);
        if (!item) return;

        setDraggedId(itemId);
        setDraggedItem(item);
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/html', '<div></div>'); // Required for drag image
    };

    // Handle drag over
    const handleDragOver = (itemId, event) => {
        setDragClonePos({ x: event.clientX, y: event.clientY });
        if (itemId !== draggedId) {
            setDropTargetId(itemId);
        }
    };

    // Handle drop
    const handleDrop = (targetId, event) => {
        event.preventDefault();
        event.stopPropagation();

        if (draggedId && draggedId !== targetId) {
            swapNodePositions(draggedId, targetId);
        }

        setDraggedId(null);
        setDraggedItem(null);
        setDropTargetId(null);
    };

    // Handle ESC key or Drag End to cancel
    useEffect(() => {
        const handleCancel = (e) => {
            if ((e.type === 'keydown' && e.key === 'Escape') || e.type === 'dragend') {
                setDraggedId(null);
                setDraggedItem(null);
                setDropTargetId(null);
            }
        };

        window.addEventListener('keydown', handleCancel);
        window.addEventListener('dragend', handleCancel);
        return () => {
            window.removeEventListener('keydown', handleCancel);
            window.removeEventListener('dragend', handleCancel);
        };
    }, [draggedId]);

    // Handle Print
    const handlePrint = () => {
        setZoom(1);
        setTimeout(() => {
            window.print();
        }, 100);
    };

    if (!showPreview) {
        return <main className="ml-96 flex-1 min-h-screen bg-[#050505] p-8 flex items-center justify-center font-mono text-green-900">
            <div className="flex flex-col items-center gap-4 opacity-50">
                <div className="w-16 h-16 border-2 border-green-900 border-t-green-500 rounded-full animate-spin"></div>
                <p className="tracking-widest text-sm">WAITING FOR INPUT STREAM...</p>
            </div>
        </main>;
    }

    return (
        <main className="ml-96 flex-1 min-h-screen bg-[#111] p-8 overflow-y-auto print:ml-0 print:p-0 print:overflow-visible relative font-mono text-slate-300">

            {/* Background Decor */}
            <div className="absolute inset-0 z-0 opacity-5 pointer-events-none print:hidden"
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
                            <h3 className="font-bold uppercase tracking-wider text-purple-300">{">> "} MERGE_MODE_ENGAGED</h3>
                            <p className="text-xs font-mono text-purple-200">Select items from control panel to fuse.</p>
                        </div>
                    </div>
                </div>
            )}



            <div className="max-w-[220mm] mx-auto relative z-10 print:max-w-none print:w-full print:mx-0">

                {/* Header (Static) */}
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

                    <div className="flex items-center gap-4">
                        {/* Zoom Controls */}
                        <div className="flex items-center border border-slate-700 bg-black rounded overflow-hidden">
                            <button
                                onClick={() => adjustZoom(-0.1)}
                                className="px-3 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-mono text-xs"
                            >
                                [-]
                            </button>
                            <span className="px-2 text-xs font-bold text-green-500 font-mono min-w-[3rem] text-center select-none" onClick={() => setZoom(1)} cursor="pointer">
                                {Math.round(zoom * 100)}%
                            </span>
                            <button
                                onClick={() => adjustZoom(0.1)}
                                className="px-3 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-mono text-xs"
                            >
                                [+]
                            </button>
                        </div>

                        <div
                            className="relative inline-block"
                            onMouseEnter={() => {
                                if (!sheetName.trim()) {
                                    setHighlightNameInput(true);
                                    setShowTooltip(true);
                                }
                            }}
                            onMouseLeave={() => {
                                setHighlightNameInput(false);
                                setShowTooltip(false);
                            }}
                        >
                            <button
                                onClick={handlePrint}
                                disabled={!sheetName.trim()}
                                className={`flex items-center gap-2 px-6 py-2 border font-bold uppercase tracking-wider transition-all
                                    ${!sheetName.trim()
                                        ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                                        : 'bg-green-900/20 text-green-400 border-green-500/50 hover:bg-green-400 hover:text-black hover:shadow-[0_0_15px_rgba(74,222,128,0.5)]'
                                    }`}
                            >
                                <span>[ PRINT_SHEET ]</span>
                            </button>

                            {/* Tooltip */}
                            {showTooltip && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-black border border-orange-500 text-orange-500 text-xs p-2 shadow-lg z-50">
                                    <p className="font-bold">{">> "} ERROR: NAME_MISSING</p>
                                    <p>Please name your sheet in the sidebar to proceed.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Zoom Scalable Wrapper */}
                <div
                    className="zoom-wrapper"
                    style={{
                        transform: `scale(${zoom})`,
                        transformOrigin: 'top center',
                        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                    <div className="print-area drop-shadow-2xl">
                        {/* Page 1 */}
                        <A4Page pageNumber={1} items={pages[0].items} sheetName={sheetName} mergeDirection={mergeDirection} isDragging={!!draggedId} draggedId={draggedId} dropTargetId={dropTargetId} onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} groupingStrategy={groupingStrategy} />

                        {/* Page 2 */}
                        <A4Page pageNumber={2} items={pages[1].items} sheetName={sheetName} mergeDirection={mergeDirection} isDragging={!!draggedId} draggedId={draggedId} dropTargetId={dropTargetId} onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} groupingStrategy={groupingStrategy} />

                        {/* Overflow Section */}
                        <OverflowSection items={overflow} isDragging={!!draggedId} draggedId={draggedId} dropTargetId={dropTargetId} onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} groupingStrategy={groupingStrategy} />
                    </div>

                    {/* Drag Clone - Semi-transparent copy following cursor */}
                    {draggedItem && draggedId && (
                        <div
                            className="fixed pointer-events-none z-50 opacity-90 bg-slate-900 text-white border-2 border-green-500 shadow-[0_0_30px_rgba(74,222,128,0.3)] rounded"
                            style={{
                                left: `${dragClonePos.x}px`,
                                top: `${dragClonePos.y}px`,
                                transform: 'translate(-50%, -50%)',
                                maxWidth: '200px',
                                padding: '12px',
                            }}
                        >
                            <div className="font-bold text-xs text-green-400 mb-1 flex items-center gap-2">
                                <span>MOVE_MODULE</span>
                                <span className="text-[10px] bg-green-900/50 px-1 rounded">{draggedId}</span>
                            </div>
                            <div className="text-sm font-bold border-t border-slate-700 pt-1 mt-1">{draggedItem.title}</div>
                        </div>
                    )}
                </div>
            </div>


            {/* Hidden Measurement Layer */}
            {itemsToMeasure && itemsToMeasure.length > 0 && (
                <MeasurementContainer items={itemsToMeasure} onMeasure={updateMeasuredHeights} mergeDirection={mergeDirection} />
            )}
        </main >
    );
};

export default SheetPreview;
