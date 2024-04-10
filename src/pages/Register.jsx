import React, { useState } from 'react'
import Add from '../img/addAvatar.png'
import { Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, db, storage } from '../firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

const Register = () => {
	const [err, setErr] = useState(false)
	const navigate = useNavigate()

	const handleSubmit = async e => {
		e.preventDefault()
		const name = e.target[0].value
		const email = e.target[1].value
		const password = e.target[2].value
		const file = e.target[3].files[0]

		try {
			const res = await createUserWithEmailAndPassword(auth, email, password)
			await updateProfile(res.user, {
				displayName: name,
			})

			console.log(res, 'res')
			const storageRef = ref(storage, name)

			const uploadTask = uploadBytesResumable(storageRef, file)

			uploadTask.on(
				error => {
					setErr(true)
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
						await updateProfile(res.user, { name, photoURL: downloadURL })

						await setDoc(doc(db, 'users', res.user.uid), {
							uid: res.user.uid,
							name,
							email,
							photoURL: downloadURL,
						})

						await setDoc(doc(db, 'usersChat', res.user.uid), {})
						navigate('/')
					})
				}
			)
		} catch (err) {
			setErr(true)
			console.log(err)
		}
	}

	return (
		<div className='formContainer'>
			<div className='formWrapper'>
				<span className='logo'>Real-Time Chat</span>
				<span className='title'>Register</span>
				<form onSubmit={handleSubmit}>
					<input required name='name' type='text' placeholder='display name' />
					<input required type='email' placeholder='email' />
					<input required type='password' placeholder='password' />
					<input
						required
						name='file'
						style={{ display: 'none' }}
						type='file'
						id='file'
					/>
					<label htmlFor='file'>
						<img src={Add} alt='' />
						<span>Add an avatar</span>
					</label>
					<button>Sign up</button>
					<span>Uploading and compressing the image please wait...</span>
					<span>Something went wrong</span>
					{err & <span>Something went wrong</span>}
				</form>
				<p>
					You do have an account? <Link to='/login'>Login</Link>
				</p>
			</div>
		</div>
	)
}

export default Register
