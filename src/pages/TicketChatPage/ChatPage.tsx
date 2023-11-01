import React from 'react';
// import React, { useEffect, useState } from 'react';
// import { io, Socket } from 'socket.io-client';

import { ChatStatusComponent, MessageComponent } from '../../components';

import arrowLeft from '../../assets/ticket/arrow-sm-left.svg';

import styles from './ChatPage.module.css';
// const CHAT_SERVER_URL = 'ws://pdf-to-txt-back.onrender.com/ws/web-socket/';

const ChatPage: React.FC = () => {
    // const [message, setMessage] = useState('');
    // const [messages, setMessages] = useState<string[]>([]);
    // const [socket, setSocket] = useState<Socket | null>(null);

    // useEffect(() => {
    //     const newSocket = io(CHAT_SERVER_URL);
    //     setSocket(newSocket);

    //     newSocket.on('message', (msg: string) => {
    //         setMessages((prevMessages) => [...prevMessages, msg]);
    //     });

    //     newSocket.on('connect', () => {
    //         console.log('WebSocket connected');
    //     });

    //     return () => {
    //         newSocket.disconnect();
    //     };
    // }, []);

    // const sendMessage = () => {
    //     if (socket) {
    //         socket.emit('message', message);
    //         setMessage('');
    //     }
    // };
    return (
        <div className={styles.wrapper}>
            <div className={styles.btnBack}>
                <img src={arrowLeft} alt='back' />
                back
            </div>

            <div className={styles.chatWrapper}>
                <div className={styles.leftWrapper}>
                    <p className={styles.ticketId}>Request 931123</p>
                    <p className={styles.awgTitle}>AVG.Respone Time</p>

                    <div>
                        <MessageComponent />

                        <div className={styles.textAreaWrapper}>
                            <p className={styles.inputTitle}>Reply to Ticket</p>
                            <textarea className={styles.textArea} placeholder='Text Area' />
                            <div className={styles.buttonWrapper}>
                                <button className={styles.sendButton}>send</button>
                            </div>

                        </div>

                    </div>
                </div>

                <ChatStatusComponent />

            </div>
            {/* <div>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))}
                </ul>
            </div>
            <input
                type="text"
                placeholder="Enter a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button> */}
        </div>
    )
}

export default ChatPage;
