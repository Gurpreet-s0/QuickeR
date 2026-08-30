import React from 'react'
import { Route, Routes } from 'react-router'
import Receiver from '../Receiver'
import Sender from '../Sender'
const Approutes = () => {
  return (
    <Routes>
        <Route path='/receiver' element={<Receiver />} /> 
        <Route path='/sender' element={<Sender />} />
    </Routes>
  )
}

export default Approutes