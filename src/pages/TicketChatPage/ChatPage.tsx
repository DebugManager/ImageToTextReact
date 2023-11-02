import React, { useEffect, useState } from 'react';

import { ChatStatusComponent, MessageComponent } from '../../components';

import arrowLeft from '../../assets/ticket/arrow-sm-left.svg';

import styles from './ChatPage.module.css';

const ChatPage: React.FC = () => {
  const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  //   const SOCKET_URL = 'ws://pdf-to-txt-back.onrender.com/ws/chat/new/';
  const SOCKET_URL = 'ws://3.75.199.184:8000/ws/chat/new/';

  useEffect(() => {
    const newSocket = new WebSocket(SOCKET_URL);
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log('WebSocket connected');
    };

    // newSocket.onmessage = (event) => {
    //     const receivedMessage = event.data;
    //     setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    //   };

    // return () => {
    //   newSocket.onclose = () => {
    //     console.log('WebSocket closed');
    //   };
    // };
  }, []);

  const sendMessage = () => {
    console.log('aaa');
    // if (socket && socket.readyState === WebSocket.OPEN) {
      console.log('bbbb');
      if (message.trim() !== '') {
        socket?.send(message);
        setMessage('');
    //   }
    }
  };

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
              <textarea
                className={styles.textArea}
                placeholder='Text Area'
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className={styles.buttonWrapper}>
                <button className={styles.sendButton} onClick={sendMessage}>
                  send
                </button>
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
  );
};

export default ChatPage;
