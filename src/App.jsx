import { useContext, useState } from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import './index.scss'
import { AuthContext } from './context/AuthContext'

function App() {
	const { user } = useContext(AuthContext)

	const ProtectedRoute = ({ children }) => {
		if (!user) {
			return <Navigate to='/login'></Navigate>
		}

		return <Home></Home>
	}

	console.log(user)
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route
						index
						element={
							<ProtectedRoute>
								<Home></Home>
							</ProtectedRoute>
						}
					></Route>
					<Route path='login' element={<Login></Login>}></Route>
					<Route path='register' element={<Register></Register>}></Route>
				</Routes>
			</BrowserRouter>
		</>
	)
}

export default App
