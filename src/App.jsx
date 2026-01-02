import React from 'react'
import Layout from './components/Layout'
import { SheetProvider } from './context/SheetContext'

function App() {
  return (
    <SheetProvider>
      <Layout />
    </SheetProvider>
  )
}

export default App
