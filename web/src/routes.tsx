import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';

import { Home } from './pages/Home';
import { CreatePoint } from './pages/CreatePoint';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path='/' />
        <Route element={<CreatePoint />} path='/create-point' />
      </Routes>
    </BrowserRouter>
  )
}