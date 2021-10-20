import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import io from 'socket.io-client';
import logo from '../../assets/logo.svg';
import styles from './styles.module.scss';

type Message = {
    id: string;
    text: string;
    user: {
        name: string;
        avatar_url: string;
    }
}

let messagesQueue: Message[] = [];

const socket = io('http://localhost:3333');

socket.on('new_message', (newMessage: Message) => {
    messagesQueue.push(newMessage);
});

const MessageList = () => {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        (async () => {
            const resultado = (await api.get<Message[]>('/messages/last3')).data;

            setMessages(resultado)
        })();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            if (messagesQueue.length > 0) {
                setMessages(prevState => [
                    messagesQueue[0],
                    prevState[0],
                    prevState[1],
                ].filter(Boolean));

                messagesQueue.shift();
            }
        }, 3000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className={styles.messageListWrapper}>
            <img src={logo} alt="DOWhile 2021" />
            <ul className={styles.messageList}>
                {messages.map(message => {
                    return (
                        <li className={styles.message} key={message.id}>
                            <p className={styles.messageContent}>
                                {message.text}
                            </p>
                            <div className={styles.messageUser}>
                                <div className={styles.userImage}>
                                    <img src={message.user.avatar_url} alt={message.user.name} />
                                </div>
                                <span>{message.user.name}</span>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export { MessageList };