import { FormEvent, useContext, useState } from 'react';
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc';
import { AuthContext } from '../../context/auth';
import { api } from '../../services/api';
import styles from './styles.module.scss';

const SendMessageForm = () => {
    const [message, setMessage] = useState('');

    const { user, signout } = useContext(AuthContext);

    const handleSendMessage = async (e: FormEvent) => {

        e.preventDefault();
        
        if(!message.trim()) {
            return;
        }

        const result = await api.post('/messages', { message });

        setMessage('');
    }

    return (
        <div className={styles.sendMessageFormWrapper}>
            <button className={styles.signOutButton} onClick={signout}>
                <VscSignOut size="32" />
            </button>
            <header className={styles.userInformation}>
                <div className={styles.userImage}>
                    <img src={user?.avatar_url} alt={user?.name} />
                </div>
                <strong className={styles.userName}>{user?.name}</strong>
                <span className={styles.userGithub}>
                    <VscGithubInverted size="16" />
                    {user?.login}
                </span>
            </header>

            <form onSubmit={handleSendMessage} className={styles.sendMessageForm}>
                <label htmlFor="message"> Mensagem </label>
                <textarea
                    name="message"
                    id="message"
                    placeholder="Qual sua expectativa para o evento?"
                    onChange={e => setMessage(e.target.value)}
                    value={message}
                ></textarea>
                <button type="submit">Enivar mensagem</button>
            </form>
        </div>
    )
}

export { SendMessageForm };