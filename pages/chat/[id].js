import Head from 'next/head'
import { useAuthState } from 'react-firebase-hooks/auth';
import Chatscreen from '../../components/Chatscreen'
import Sidebar from '../../components/Sidebar'
import { db,auth } from '../../firebase';
import getRecipientEmail from '../../utils/getRecipientEmail';

function Chat({chat , messages}) {
    const [user] = useAuthState(auth);
    return (
        
        <div className="flex">
            <Head><title>Chat with {getRecipientEmail(chat.users, user)}</title></Head>
            <Sidebar/>
            <div className="flex-1 overflow-scroll h-screen hide-scrollbar">
                <Chatscreen chat={chat} messages={messages}  />
            </div>

        </div>
    )
}

export default Chat

export async function getServerSideProps(context) {
	const ref = db.collection('chats').doc(context.query.id);
	// Prep the messages on the server side
	const messagesRes = await ref
		.collection('messages')
		.orderBy('timestamp', 'asc')
		.get();
	const messages = messagesRes.docs
		.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}))
		.map((messages) => ({
			...messages,
			timestamp: messages.timestamp.toDate().getTime(),
		}));

	// PREP the chats
	const chatRes = await ref.get();
	const chat = {
		id: chatRes.id,
		...chatRes.data(),
	};
	return {
		props: {
			messages: JSON.stringify(messages),
			chat: chat,
		},
	};
}
