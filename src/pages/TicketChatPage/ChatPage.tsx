import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { CircleLoader } from 'react-spinners';

import { ChatStatusComponent, MessageComponent } from '../../components';
import { getUser } from '../../services/locastorage.service';
import {
  createChat,
  getChatById,
  getMessagesFromChat,
} from '../../services/chat.service';

import arrowLeft from '../../assets/ticket/arrow-sm-left.svg';

import styles from './ChatPage.module.css';

interface IMessages {
  content: string;
  id: number;
  room: number;
  timestamp: string;
  user: number;
}

const ChatPage: React.FC = () => {
  const { id } = useParams();

  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<IMessages[] | []>([]);
  const [message, setMessage] = useState<string>('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [userId, setUserId] = useState<null | number>(null);
  const [isRoom, setIsRoom] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const msgWarpperRef = useRef<HTMLDivElement | null>(null);

  const fetchData = useCallback(async (id: number | string) => {
    setIsLoading(true);
    try {
      const data = await getChatById(+id);
      if (!data) {
        const room = await createChat(id);
        room.id ? setIsRoom(true) : setIsRoom(false);
        setIsLoading(false);
      } else {
        setIsRoom(true);
      }
    } catch (error) {
      console.error(error, 'error');
    }
  }, []);

  const fetchMessages = useCallback(async (id: number | string) => {
    try {
      const data = await getMessagesFromChat(+id);
      if (data.length > 0) {
        const newMessages = data.map((message: IMessages) => ({
          id: message.id,
          content: message.content,
          user_id: message.user,
        }));

        setChatMessages(newMessages);
      }
    } catch (error) {
      console.error(error, 'error');
    }
  }, []);

  useEffect(() => {
    id && fetchData(id);
    id && fetchMessages(id);
  }, [fetchData, id]);

  useEffect(() => {
    const user = getUser();
    user?.id && setUserId(user?.id);
  }, []);

  useEffect(() => {
    if (isRoom) {
      const CHAT_SERVER_URL = `ws://157.230.50.75:8000/ws/chat/${id}/`;

      const newSocket = new WebSocket(CHAT_SERVER_URL);
      setSocket(newSocket);

      newSocket.onopen = () => {
        console.log('WebSocket Client Connected');
        setIsLoading(false);
      };

      newSocket.onclose = () => {
        console.log('WebSocket connection closed');
      };
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [isRoom]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && socket.readyState === WebSocket.OPEN && userId && id) {
      setIsButtonLoading(true);
      const messageToSend = {
        message: message,
        user_id: userId,
      };

      socket.send(JSON.stringify(messageToSend));
      setMessage('');
    }
  };

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event: MessageEvent) => {
        if (id) {
          const messageData = JSON.parse(event.data);
          const newMessage: IMessages = {
            id: chatMessages.length + 1,
            content: messageData.message,
            user: messageData.user_id,
            room: +id,
            timestamp: new Date().toISOString(),
          };

          setIsButtonLoading(false);

          setChatMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      };
    }
  }, [socket, chatMessages]);

  useEffect(() => {
    console.log(isButtonLoading);
  }, [isButtonLoading]);

  useEffect(() => {
    if (msgWarpperRef.current) {
      msgWarpperRef.current.scrollTop = msgWarpperRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className={styles.wrapper}>
      <Link
        className={styles.btnBack}
        onClick={() => window.history.back()}
        to='#'
      >
        <img src={arrowLeft} alt='back' />
        back
      </Link>

      <div className={styles.chatWrapper}>
        {isLoading ? (
          <CircleLoader loading={isLoading} color={'#556EE6'} size={20} />
        ) : (
          <>
            <div className={styles.leftWrapper}>
              <p className={styles.ticketId}>Request 931123</p>
              <p className={styles.awgTitle}>AVG.Respone Time</p>
              <div>
                <div className={styles.msgWarpper} ref={msgWarpperRef}>
                  {chatMessages.map((msg) => (
                    <MessageComponent key={msg.id} {...msg} />
                  ))}
                </div>

                <form onSubmit={sendMessage} className={styles.textAreaForm}>
                  <p className={styles.inputTitle}>Reply to Ticket</p>
                  <textarea
                    className={styles.textArea}
                    placeholder='Text Area'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className={styles.buttonWrapper}>
                    {isButtonLoading ? (
                      <CircleLoader
                        loading={isButtonLoading}
                        className={styles.sendButtonLoader}
                        color={'#556EE6'}
                        size={20}
                      />
                    ) : (
                      <input
                        type='submit'
                        value='Send'
                        className={styles.sendButton}
                      />
                    )}
                  </div>
                </form>
              </div>
            </div>

            <ChatStatusComponent />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
