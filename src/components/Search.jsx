import React, { useContext, useState } from 'react'
import {
	collection,
	query,
	where,
	getDocs,
	doc,
	setDoc,
	updateDoc,
	serverTimestamp,
	getDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { AuthContext } from '../context/AuthContext'

const Search = () => {
	const [username, setUsername] = useState('')
	const [searchUser, setUser] = useState(null)
	const [err, setErr] = useState(false)

	const { user } = useContext(AuthContext)

	const handleSearch = async () => {
		const q = query(collection(db, 'users'), where('name', '==', username))

		try {
			const querySnapshot = await getDocs(q)
			querySnapshot.forEach(doc => {
				setUser(doc.data())
				console.log(doc.data(), 'doc data')
			})
		} catch (err) {
			console.log(err)
			setErr(true)
		}
	}

	const handleKey = e => {
		e.code === 'Enter' && handleSearch()
	}

	const handleClick = async () => {
		if (searchUser) {
			console.log(searchUser, 'SEARCH USER')
			const combined =
				user.uid > searchUser.uid
					? user.uid + searchUser.uid
					: searchUser.uid + user.uid
			console.log(combined, 'combined')
			try {
				const res = await getDoc(doc(db, 'chats', combined))
				console.log(res.data(), 'res')

				if (!res.exists()) {
					await setDoc(doc(db, 'chats', combined), { messages: [] })

					await setDoc(doc(db, 'usersChat', user.uid), {
						[combined + '.userInfo']: {
							name: user.displayName,
							uid: user.uid,
							photoURL: user.photoURL,
						},
						[combined + '.date']: serverTimestamp(),
					})
					await setDoc(doc(db, 'usersChat', searchUser.uid), {
						[combined + '.userInfo']: {
							name: searchUser.name,
							uid: searchUser.uid,
							photoURL: searchUser.photoURL,
						},
						[combined + '.date']: serverTimestamp(),
					})
				}
				setUsername('')
				setUser(null)
			} catch (err) {
				console.log(err)
			}
		}
	}

	console.log(searchUser, 'SEARCH USER')
	console.log(username, 'username')
	return (
		<div className='search'>
			<div className='searchForm'>
				<input
					type='text'
					placeholder='Find a user'
					onChange={e => setUsername(e.target.value)}
					onKeyDown={handleKey}
					value={username}
				/>
			</div>

			{err && <span>User not found!</span>}
			{searchUser && (
				<div className='userChat' onClick={handleClick}>
					<img src={searchUser.photoURL} alt='' />
					<div className='userChatInfo'>
						<span>{searchUser.name}</span>
					</div>
				</div>
			)}
		</div>
	)
}

export default Search
