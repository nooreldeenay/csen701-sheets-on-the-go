import React from 'react';
import Sidebar from './Sidebar';
import SheetPreview from './SheetPreview';

import AboutModal from './AboutModal';

const Layout = () => {
    const [isAboutOpen, setIsAboutOpen] = React.useState(false);

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30">
            <Sidebar onOpenAbout={() => setIsAboutOpen(true)} />
            <SheetPreview />
            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
        </div>
    );
};

export default Layout;
