import './App.css'
import { RouterProvider } from 'react-router-dom'
import router from './Components/router'
import { UserProvider } from './Context/userContext'
function App() {

  return <UserProvider>
    <RouterProvider router={router} />
  </UserProvider>
}

export default App
