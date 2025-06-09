import React from 'react'
import Home from './pages/Home'
import { Route,Routes } from 'react-router-dom'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import EmailVerify from './pages/EmailVerify'
import FormBuilderApp from './pages/BuilderPage'
import PreviewFormPage from './pages/PreviewFormPage'
import { ToastContainer} from 'react-toastify';
import { FormProvider } from './context/FormContext'


function App() {
  return (
    <>
    <ToastContainer/>

    <FormProvider>
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/resetPassword' element={<ResetPassword/>}/>
        <Route path='/emailVerify' element={<EmailVerify/>}/>
        <Route path="/builder/:id?" element={<FormBuilderApp />} />
        <Route path="/form/:shareId" element={<PreviewFormPage />} />
    </Routes>
    </FormProvider>
  
    </>
  )
}

export default App
