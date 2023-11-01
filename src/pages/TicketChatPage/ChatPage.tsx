import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import styles from './ChatPage.module.css';

import arrowLeft from '../../assets/ticket/arrow-sm-left.svg';
import userIcon from '../../assets/ticket/user.jpeg';

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
                        <div className={styles.messageWrapper}>
                            <img src={userIcon} alt='avatar' className={styles.userAvatar} />
                            <div className={styles.messageData}>
                                <p className={styles.userName}>Jon Dow</p>
                                <p className={styles.messageText}>consectetur adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula ipsum a arcu cursus vitae congue</p>

                            </div>
                            <p className={styles.date}>March 20, 2023 10:06</p>
                        </div>

                        <div className={styles.textAreaWrapper}>
                            <p className={styles.userName}>Reply to Ticket</p>
                            <textarea className={styles.textArea} placeholder='Text Area' />
                            <div className={styles.buttonWrapper}>
                                <button className={styles.sendButton}>send</button>
                            </div>

                        </div>

                    </div>
                </div>

                <div className={styles.rightWrapper}>
                    <p className={styles.status}>Status</p>
                    <p className={styles.statusChips}>In Progress</p>
                    <p className={styles.reason}>Reason:</p>
                    <p className={styles.reasonDescription}>amet commodo nulla facilisi nullam vehicula ipsum a arcu cursus vitae congue</p>
                </div>

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
