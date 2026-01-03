import React, { useState } from 'react';
import { X, Github, ExternalLink, Cpu, Code, Coffee, Calendar, MapPin, Terminal, User, Mail } from 'lucide-react';
import { APP_VERSION, APP_DATE } from '../constants';

const AboutModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [activeTab, setActiveTab] = useState('SYSTEM');

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="w-full max-w-2xl bg-[#0a0a0a] border border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.15)] flex flex-col font-mono relative overflow-hidden" onClick={(e) => e.stopPropagation()}>

                {/* Scanlines */}
                <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-size-[100%_4px] z-10"></div>

                {/* Header */}
                <div className="flex justify-between items-center p-2 border-b border-green-900 bg-[#0f1a0f]">
                    <div className="flex items-center gap-2 text-green-500">
                        <Terminal size={16} />
                        <span className="font-bold text-sm tracking-wider">SYS_INFO_V{APP_VERSION}.exe</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-green-700 hover:text-green-400 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-green-900 text-xs">
                    <button
                        onClick={() => setActiveTab('SYSTEM')}
                        className={`flex-1 p-2 text-center transition-colors uppercase font-bold
                            ${activeTab === 'SYSTEM' ? 'bg-green-900/20 text-green-400' : 'text-green-800 hover:text-green-600 hover:bg-green-900/10'}`}
                    >
                        [ PROJECT_OVERVIEW ]
                    </button>
                    <button
                        onClick={() => setActiveTab('USER')}
                        className={`flex-1 p-2 text-center transition-colors uppercase font-bold
                            ${activeTab === 'USER' ? 'bg-green-900/20 text-green-400' : 'text-green-800 hover:text-green-600 hover:bg-green-900/10'}`}
                    >
                        [ CREATOR_PROFILE ]
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 h-[400px] overflow-y-auto text-sm text-green-400 scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-transparent">

                    {activeTab === 'SYSTEM' && (
                        <div className="space-y-6 animate-in slide-in-from-left duration-300">
                            <div>
                                <h3 className="text-green-500 font-bold mb-2 uppercase border-b border-green-900/50 pb-1 w-fit">
                                    {">>"} EXECUTION_CONTEXT
                                </h3>
                                <p className="leading-relaxed opacity-90">
                                    Sheet-On-The-Go is a specialized compilation tool serving the CSEN701 directive.
                                    Targeting maximum efficiency in information retrieval, it transforms raw data nodes into formatted, printable artifacts.
                                    <br /><br />
                                    The interface mimics legacy terminal protocols to minimize cognitive load through nostalgia-induced dopamine release.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="border border-green-900/50 p-2 bg-green-900/5">
                                    <div className="text-[10px] text-green-600 uppercase mb-1">Stack_Core</div>
                                    <div className="font-bold">REACT_19</div>
                                </div>
                                <div className="border border-green-900/50 p-2 bg-green-900/5">
                                    <div className="text-[10px] text-green-600 uppercase mb-1">Rendering</div>
                                    <div className="font-bold">TAILWIND_V4</div>
                                </div>
                                <div className="border border-green-900/50 p-2 bg-green-900/5">
                                    <div className="text-[10px] text-green-600 uppercase mb-1">Build_Engine</div>
                                    <div className="font-bold">VITE_TURBO</div>
                                </div>
                                <div className="border border-green-900/50 p-2 bg-green-900/5">
                                    <div className="text-[10px] text-green-600 uppercase mb-1">State_Logic</div>
                                    <div className="font-bold">CONTEXT_API</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'USER' && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-20 h-20 bg-green-900/20 border border-green-500 flex items-center justify-center shrink-0">
                                    <User size={40} className="text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-green-400">NOORELDEENAY</h3>
                                    <div className="text-xs text-green-700 uppercase mt-1">ENGINEERING_OPERATIVE // 58- // NEOVIMMER</div>
                                    <div className="mt-2 text-xs border border-green-800 inline-block px-2 py-0.5 rounded-full text-green-600 bg-green-900/10">
                                        LVL_99 ENGINEER
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-green-500 font-bold mb-2 uppercase border-b border-green-900/50 pb-1 w-fit flex items-center gap-2">
                                    {">>"} BIO_DATA_RECORD
                                </h3>

                                <div className="w-full bg-[#050505] border border-green-900/50 text-green-400 p-3 font-mono text-sm leading-relaxed opacity-90 mb-4">
                                    Passionate developer crafting digital experiences with code.
                                    <br></br>
                                    Owns a pet parrot.
                                </div>

                                {/* Design/Contact Grid */}
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-center gap-3 p-2 border border-green-900/40 bg-green-900/5 hover:bg-green-900/10 transition-colors">
                                        <Mail size={16} className="text-green-600" />
                                        <div className="flex-1">
                                            <div className="text-[10px] text-green-700 uppercase">Comm_Link [EMAIL]</div>
                                            <a href="mailto:nooredeen.ay@gmail.com" className="hover:underline decoration-green-500 underline-offset-4">
                                                nooredeen.ay@gmail.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-2 border border-green-900/40 bg-green-900/5 hover:bg-green-900/10 transition-colors">
                                        <LinkIcon size={16} className="text-green-600" />
                                        <div className="flex-1">
                                            <div className="text-[10px] text-green-700 uppercase">Net_Link [LINKEDIN]</div>
                                            <a
                                                href="https://www.linkedin.com/in/nooreldeen-amr-4105762bb/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 hover:underline decoration-green-500 underline-offset-4"
                                            >
                                                linkedin.com/in/nooreldeen-amr <ExternalLink size={10} />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-2 border border-green-900/40 bg-green-900/5 hover:bg-green-900/10 transition-colors">
                                        <Github size={16} className="text-green-600" />
                                        <div className="flex-1">
                                            <div className="text-[10px] text-green-700 uppercase">Code_Repo [GITHUB]</div>
                                            <a
                                                href="https://github.com/nooreldeenay"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 hover:underline decoration-green-500 underline-offset-4"
                                            >
                                                github.com/nooreldeenay <ExternalLink size={10} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-2 text-xs text-green-700 pt-2 border-t border-green-900/30'>
                                <div>COMMITS: 517</div>
                                <div>UPTIME: 99.9%</div>
                                <div>COFFEE: INFINITE</div>
                                <div>BUGS: 0 (KNOWN)</div>
                            </div>

                            {/* Contributors */}
                            <h3 className="text-green-500 font-bold mt-6 mb-2 uppercase border-b border-green-900/50 pb-1 w-fit">
                                {">>"} CONTRIBUTORS
                            </h3>
                            <div className="space-y-2">
                                <div className="p-2 border border-green-900/30 bg-green-900/5 flex justify-between items-center group hover:bg-green-900/10 transition-colors">
                                    <div>
                                        <div className="font-bold text-green-400 text-xs">itsfadymate</div>
                                        <div className="text-[10px] text-green-700 uppercase">Feature: Vertical Merge & Drag/Drop</div>
                                    </div>
                                    <a href="https://github.com/itsfadymate" target="_blank" rel="noopener noreferrer" className="text-green-800 group-hover:text-green-500">
                                        <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Status */}
                <div className="p-2 border-t border-green-900 bg-[#050505] text-[10px] text-green-800 flex justify-between uppercase">
                    <span>STATUS: READ_ONLY_MODE</span>
                    <span>MEM: 64KB FREE</span>
                </div>
            </div>
        </div>
    );
};

export default AboutModal;
