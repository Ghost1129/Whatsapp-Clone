import { Avatar, Button, IconButton } from '@mui/material'
import React from 'react'
import 'tailwindcss/tailwind.css'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatIcon from '@mui/icons-material/Chat';
import SearchIcon from '@mui/icons-material/Search';
import * as EmailValidator from 'email-validator';
import { auth,db } from '../firebase';
import {useAuthState} from "react-firebase-hooks/auth"
import {useCollection} from "react-firebase-hooks/firestore"
import Chat from '../components/Chat';



function Sidebar() {
    const [user] =useAuthState(auth);
    const userChatRef = db.collection('chats').where('users','array-contains',user.email);
    const [chatsSnapshot] = useCollection(userChatRef)

    const createChat = () =>{
        const input = prompt('Please Enter Email Address');

        if(!input) return null;
        if (EmailValidator.validate(input) && !ChatAlreadyExists(input) && input!==user.email) {
            db.collection("chats").add({
                users:[user.email,input]
            });

        }
    }
    const ChatAlreadyExists = (recipentemail) => 
        !!chatsSnapshot?.docs.find((chat) => chat.data().users.find((user) => user === recipentemail)?.length >0)

    return (
        //Container
        <div className="flex-1 border-r border-gray-200 w-8 h-screen max-w-sm hide-scrollbar">
            <div className="flex sticky top-0 bg-white z-1 justify-between items-center p-4 h-20 border-b border-gray-50">
                <Avatar src={user.photoURL} onClick={()=>auth.signOut()} className="cursor-pointer hover:o"></Avatar>
                <div className="">
                    <IconButton>
                    <ChatIcon></ChatIcon>
                    </IconButton>
                    <IconButton>
                    <MoreVertIcon></MoreVertIcon>
                    </IconButton>
                </div>

            </div>
            <div className="flex items-center p-5 rounded-sm">
                <SearchIcon></SearchIcon>
                <input placeholder="Search In Chats" className="outline-none border-none flex-1"></input>
            </div>
            <div>
                <Button onClick={createChat} className="w-full border-t border-b border-gray-50">Start A New Chat</Button>
            </div>
            {chatsSnapshot?.docs.map((chat)=>(
                <Chat key={chat.id} id = {chat.id} users={chat.data().users}  />
            ))}
            
        </div>
    )
}

export default Sidebar
