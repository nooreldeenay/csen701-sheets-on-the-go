import React from 'react'
import Layout from './components/Layout'
import { SheetProvider } from './context/SheetContext'
import { TutorialProvider, useTutorial } from './context/TutorialContext'
import BootSequence from './components/BootSequence'
import TutorialManager from './components/TutorialManager'

const AppContent = () => {
  const { appState } = useTutorial();

  return (
    <>
      {(appState === 'BOOTING' || appState === 'PROMPT') && <BootSequence />}
      {/* Layout is always mounted but might be hidden/modified by CSS in tutorial mode, or we can just keep it mounted behind */}
      {(appState === 'READY' || appState === 'TUTORIAL') && (
        <>
          <Layout />
          <TutorialManager />
        </>
      )}
    </>
  );
};

// Main App Component
function App() {
  return (
    <TutorialProvider>
      <SheetProvider>
        <AppContent />
      </SheetProvider>
    </TutorialProvider>
  )
}

export default App
