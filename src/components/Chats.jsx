import React, { useContext, useEffect, useState } from 'react'
import { db } from '../firebase'
import {
	getDocs,
	collection,
	onSnapshot,
	doc,
	query,
	where,
} from 'firebase/firestore'
import avatar from '.././img/avatar.jpg'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

const Chats = () => {
	const [chats, setChats] = useState([])
	const [users, setUsers] = useState([])

	const { user } = useContext(AuthContext)
	const { dispatch } = useContext(ChatContext)

	useEffect(() => {
		const getChats = () => {
			const unsub = onSnapshot(doc(db, 'usersChat', user.uid), doc => {
				setChats(doc.data())
			})

			return () => {
				unsub()
			}
		}
		user.uid && getChats()
	}, [user.uid])

	useEffect(() => {
		if (user.uid) {
			const getUsers = async () => {
				const q = query(collection(db, 'users'), where('uid', '!=', user.uid))

				try {
					const querySnapshot = await getDocs(q)
					let usersData = []
					querySnapshot.forEach(doc => {
						usersData.push(doc.data())
					})
					setUsers(usersData)
				} catch (err) {
					console.log(err)
				}
			}
			getUsers()
		}
	}, [user.uid])

	const handleSelect = i => {
		dispatch({ type: 'CHANGE_USER', payload: i })
	}

	// console.log(users[0], 'users')
	// console.log(user, 'user')
	// console.log(Object.entries(chats))
	// console.log(users, 'users')
	// console.log(chats, 'chats')
	return (
		// <div className='chats'>
		// 	{Object.entries(chats)?.map(chat => (
		// 		<div
		// 			key={chat[0]}
		// 			className='chatsChat'
		// 			onClick={() => handleSelect(chat[1].userInfo)}
		// 		>
		// 			<img src={chat[1].userInfo.photoURL} alt='' />
		// 			<div className='chatsChatInfo'>
		// 				<span>{chat[1].userInfo.name}</span>
		// 				<p>{chat[1].userInfo?.lastMessage?.text}</p>
		// 			</div>
		// 		</div>
		// 	))}
		// </div>
		<div className='chats'>
			{users &&
				users.map(item => {
					const userLastMessage = chats[user.uid + item.uid]
					console.log(userLastMessage, 'userlastmessage')
					return (
						<div
							key={item.uid}
							className='chatsChat'
							onClick={() => handleSelect(item)}
						>
							<img src={item.photoURL || avatar} alt='' />
							<div className='chatsChatInfo'>
								<span>{item.name}</span>
								<p>{userLastMessage && userLastMessage.lastMessage.text}</p>
							</div>
						</div>
					)
				})}
		</div>
	)
}

export default Chats
