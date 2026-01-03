import React from 'react';
import Sidebar from './Sidebar';
import SheetPreview from './SheetPreview';

import AboutModal from './AboutModal';
import ManualModal from './ManualModal';
import ChangelogModal from './ChangelogModal';

const Layout = () => {
    const [isAboutOpen, setIsAboutOpen] = React.useState(false);
    const [isManualOpen, setIsManualOpen] = React.useState(false);
    const [isChangelogOpen, setIsChangelogOpen] = React.useState(false);

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30">
            <Sidebar
                onOpenAbout={() => setIsAboutOpen(true)}
                onOpenManual={() => setIsManualOpen(true)}
                onOpenChangelog={() => setIsChangelogOpen(true)}
            />
            <SheetPreview />
            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
            <ManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
            <ChangelogModal isOpen={isChangelogOpen} onClose={() => setIsChangelogOpen(false)} />
        </div>
    );
};

export default Layout;
