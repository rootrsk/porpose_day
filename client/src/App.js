import React from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import CreateProposal from './pages/CreateProposal'
import Homepage from './pages/Homepage'
function App() {
    return (
       <BrowserRouter>
            <Routes>
                <Route path="/" element={<Homepage />} exact/>
                <Route path="/create-new" element={<CreateProposal />} />
            </Routes>
       </BrowserRouter>
    )
}

export default App