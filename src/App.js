import React from 'react';
import { Box } from '@mui/material';
import Navbar from './components/NavBar.jsx';
import { ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/Home';
import RequireAuth from './components/RequireAuth';

import Profile from './components/Profile';
import { theme } from './components/theme.js'
import Main from './components/Main';
import Inventory from './components/Inventory';
import History from './components/History';

function App() {


  return (
    <ThemeProvider theme={theme}>
      <Box className="App" sx={{
        boxSizing: 'border-box',

        overflow: 'hidden',
        height: '100vh',
      }} display={'flex'} flexDirection={'column'} >
        <Router>
          <Routes>

            <Route path='/' element={<Home />} />

            <Route element={<RequireAuth />}>
              <Route path='/main' element={<><Navbar /><Main /></>} />
            </Route>
            <Route element={<RequireAuth />}>

              <Route path='/inventory' element={<><Navbar /><Inventory /></>} />
            </Route>
            <Route element={<RequireAuth />}>

              <Route path='/profile' element={<><Navbar /><Profile /></>} />
            </Route>
            <Route element={<RequireAuth />}>

              <Route path='/history' element={<><Navbar /><History /></>} />

            </Route>

          </Routes>
        </Router>

      </Box>

    </ThemeProvider>
  );


}

export default App;
