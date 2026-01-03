import React from 'react';
import { X, Book, FileText, MousePointer, Layout, PenTool, Terminal, Printer, Search, Layers } from 'lucide-react';
import { APP_VERSION } from '../constants';

const ManualModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="w-full max-w-4xl bg-[#0a0a0a] border border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.15)] flex flex-col font-mono relative overflow-hidden h-[85vh]" onClick={(e) => e.stopPropagation()}>

                {/* Scanlines */}
                <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-size-[100%_4px] z-10"></div>

                {/* Header */}
                <div className="flex justify-between items-center p-3 border-b border-amber-900 bg-[#1a1205]">
                    <div className="flex items-center gap-2 text-amber-500">
                        <Book size={18} />
                        <span className="font-bold text-sm tracking-wider">OPERATOR_HANDBOOK_V{APP_VERSION}</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-amber-700 hover:text-amber-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 text-amber-400/90 space-y-10 scrollbar-thin scrollbar-thumb-amber-900 scrollbar-track-transparent">

                    <div className="border-l-2 border-amber-600 pl-4 py-1">
                        <h1 className="text-2xl font-bold text-amber-500 mb-2">System Overview</h1>
                        <p className="text-sm leading-relaxed text-amber-300/80">
                            The Cheatsheet Generator is a specialized environment for creating dense, high-utility operational documents.
                            It focuses on information density, layout verification, and export fidelity.
                        </p>
                    </div>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2 border-b border-amber-900/50 pb-2">
                            <Terminal size={20} />
                            1.0 // CORE_OVERRIDES
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border border-amber-900/30 bg-amber-900/5 hover:bg-amber-900/10 transition-colors">
                                <h3 className="font-bold text-amber-300 mb-2 flex items-center gap-2"><Layout size={14} /> Layout Strategies</h3>
                                <ul className="list-disc list-inside text-xs space-y-2">
                                    <li><strong className="text-amber-200">DEFAULT:</strong> Standard flow based on sidebar hierarchy. Best for predictable ordering.</li>
                                    <li><strong className="text-amber-200">COMPACT:</strong> AI-assisted packing algorithm (First-Fit Decreasing). Optimizes space usage but changes order.</li>
                                    <li><strong className="text-amber-200">TYPE:</strong> Automatically groups content by category (Code, Text, Images).</li>
                                    <li><strong className="text-amber-200">MANUAL:</strong> <span className="bg-amber-900/40 text-amber-100 px-1 rounded">RESTRICTED MODE</span> Unlocks Drag & Drop. Use this to fine-tune placement.</li>
                                </ul>
                            </div>
                            <div className="p-4 border border-amber-900/30 bg-amber-900/5 hover:bg-amber-900/10 transition-colors">
                                <h3 className="font-bold text-amber-300 mb-2 flex items-center gap-2"><MousePointer size={14} /> Interaction Protocol</h3>
                                <div className="text-xs space-y-2">
                                    <p><strong className="text-amber-200">DRAG & DROP:</strong></p>
                                    <p className="pl-2 border-l border-amber-700/50">
                                        Only active in <strong>MANUAL</strong> mode.
                                        Drag items on the preview sheet to reorder them.
                                        Drag logic overrides automatic sorting.
                                    </p>
                                    <p><strong className="text-amber-200">TEXT SELECTION:</strong></p>
                                    <p className="pl-2 border-l border-amber-700/50">
                                        Active in <strong>DEFAULT / COMPACT / TYPE</strong> modes.
                                        Allows you to copy code snippets or text directly from the preview verification layer.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2 border-b border-amber-900/50 pb-2">
                            <PenTool size={20} />
                            2.0 // CONTENT_INJECTION
                        </h2>
                        <div className="space-y-4">
                            <h3 className="font-bold text-xs uppercase tracking-widest text-amber-600">User Defined Modules</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div className="p-3 border border-amber-900/20">
                                    <strong className="block text-amber-300 mb-1 text-sm">[ CODE_BLOCK ]</strong>
                                    Preserves whitespace/identation. Auto-detects language. Renders in a high-contrast terminal theme.
                                </div>
                                <div className="p-3 border border-amber-900/20">
                                    <strong className="block text-amber-300 mb-1 text-sm">[ LATEX_FORMULA ]</strong>
                                    <p className="mb-2">Mathematical typesetting via KaTeX. Supports standard LaTeX syntax.</p>

                                    <div className="space-y-2 bg-black p-2 border border-amber-900/30 font-mono text-[10px]">
                                        <div>
                                            <span className="text-slate-500 block">Inline Math: (Single $)</span>
                                            <code className="bg-amber-900/30 px-1 text-amber-200 block mt-1">$ E = mc^2 $</code>
                                        </div>
                                        <div className="pt-2 border-t border-amber-900/20">
                                            <span className="text-slate-500 block">Block Math: (Double $$)</span>
                                            <code className="bg-amber-900/30 px-1 text-amber-200 block mt-1">{`$$ \\sum_{i = 0}^n i^2 = \\frac{n(n + 1)(2n + 1)}{6} $$`}</code>
                                        </div>
                                        <div className="pt-2 border-t border-amber-900/20">
                                            <span className="text-slate-500 block">Complex Example:</span>
                                            <code className="bg-amber-900/30 px-1 text-amber-200 block mt-1">{`$$ J(\\theta) = - \\frac{1}{m} \\sum_{i = 1}^m [ y^{(i)} \\log h_\\theta(x^{(i)}) + (1 - y^{(i)}) \\log (1 - h_\\theta(x^{(i)})) ] $$`}</code>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 border border-amber-900/20">
                                    <strong className="block text-amber-300 mb-1 text-sm">[ DATA_TABLE ]</strong>
                                    Pipe-delimited CSV format. Double spacing creates new rows.
                                    <br /><code className="bg-amber-900/30 px-1 my-1 block w-fit">Header | Value</code>
                                </div>
                                <div className="p-3 border border-amber-900/20">
                                    <strong className="block text-amber-300 mb-1 text-sm">[ IMAGES ]</strong>
                                    Upload local assets. Images are stored in volatile RAM and will vanish on session refresh.
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2 border-b border-amber-900/50 pb-2">
                            <Layers size={20} />
                            3.0 // ADVANCED_OPERATIONS
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div className="col-span-1 p-3 bg-amber-900/10 border border-amber-800/20">
                                <strong className="block text-amber-300 mb-2">MERGE MODE</strong>
                                Allows selecting multiple sidebar items and collapsing them into a single "Group" module. Useful for keeping related concepts strictly adjacent.
                            </div>
                            <div className="col-span-1 p-3 bg-amber-900/10 border border-amber-800/20">
                                <strong className="block text-amber-300 mb-2">BUFFER OVERFLOW</strong>
                                If content exceeds the physical dimensions of an A4 page (minus margins), it is automatically rejected into the Overflow Buffer to preventing printing errors.
                            </div>
                            <div className="col-span-1 p-3 bg-amber-900/10 border border-amber-800/20">
                                <strong className="block text-amber-300 mb-2">PROJECT ID</strong>
                                Set a unique <strong>PROJECT_ID</strong> (Sheet Name) in the top-left sidebar. This is required for printing and will be the filename of your exported PDF.
                            </div>
                        </div>

                        <div className="mt-6 p-4 border border-green-900/30 bg-green-900/5">
                            <h3 className="font-bold text-green-400 mb-2 flex items-center gap-2">
                                <Printer size={16} /> PRINT CONFIGURATION
                            </h3>
                            <ul className="list-disc list-inside text-xs space-y-1 text-green-300/80">
                                <li><strong>Paper Size:</strong> A4</li>
                                <li><strong>Margins:</strong> None / Minimum</li>
                                <li><strong>Scale:</strong> Fit to Page Width (or 100%)</li>
                                <li><strong>Destination:</strong> Save as PDF</li>
                                <li><strong>Headers/Footers:</strong> Uncheck (OFF)</li>
                            </ul>
                        </div>
                    </section>

                </div>

                {/* Footer */}
                <div className="p-3 border-t border-amber-900 bg-[#0a0a0a] text-[10px] text-amber-700 flex justify-between uppercase font-bold tracking-wider">
                    <span>DOC_ID: MAN_701_REV_B</span>
                    <span>AUTHORIZATION: LEVEL_1 // UNCLASSIFIED</span>
                </div>
            </div>
        </div>
    );
};

export default ManualModal;
