import styles from './styles.module.scss';
import { VscGithubInverted } from 'react-icons/vsc';
import { useContext } from 'react';
import { AuthContext } from '../../context/auth';

const LoginBox = () => {
    const { signInUrl } = useContext(AuthContext);

    return (
        <div className={styles.loginBoxWrapper}>
            <strong>Entre e compartilhe sua mensagem</strong>
            <a href={signInUrl} className={styles.signInWithGithub}>
                <VscGithubInverted size='24' />
                entrar com o github
            </a>
        </div>
    )
}

export { LoginBox };