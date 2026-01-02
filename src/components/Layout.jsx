import React from 'react';
import Sidebar from './Sidebar';
import SheetPreview from './SheetPreview';

const Layout = () => {
    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30">
            <Sidebar />
            <SheetPreview />
        </div>
    );
};

export default Layout;
