import React, { useContext } from 'react'
import avatar from '.././img/avatar.jpg'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
	const { user } = useContext(AuthContext)

	return (
		<div className='navbar'>
			<span className='logo'>Chat</span>
			<div className='user'>
				<img src={user.photoURL} alt='' />
				<span>{user.displayName}</span>
				<button onClick={() => signOut(auth)}>logout</button>
			</div>
		</div>
	)
}

export default Navbar
