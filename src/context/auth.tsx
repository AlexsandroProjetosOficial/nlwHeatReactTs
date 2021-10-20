import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type AuthResponse = {
    token: string;
    user: {
        id: string;
        avatar_url: string;
        name: string;
        login: string;
    }
}

type User = {
    id: string;
    name: string;
    login: string;
    avatar_url: string;
}

type AuthContextData = {
    user: User | null;
    signInUrl: string;
    signout: () => void;
}

type AuthProviderProps = {
    children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);

    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=240fd81685d8887ee593`;

    const signIn = async (githubCode: string) => {
        const { token, user } = (await api.post<AuthResponse>('/authenticate', {
            code: githubCode
        })).data;

        localStorage.setItem('@dowhile:token', token);

        api.defaults.headers.common.authorization = `Bearer ${token}`;

        setUser(user);
    };

    const signout = () => {
        setUser(null);
        localStorage.removeItem('@dowhile:token');
    }

    useEffect(() => {
        (async () => {
            const token = localStorage.getItem('@dowhile:token');

            if(token) {
                api.defaults.headers.common.authorization = `Bearer ${token}`;

                const result = (await api.get<User>('/profile')).data;
                
                setUser(result);
            }
        })();
    },[]);

    useEffect(() => {
        (async () => {
            const url = window.location.href;
            const hasGithubCode = url.includes('?code=');

            if (hasGithubCode) {
                const [urlWithoutCode, githubCode] = url.split('?code=');

                window.history.pushState({}, '', urlWithoutCode);

                signIn(githubCode);
            }
        })();
    });

    return (
        <AuthContext.Provider value={{ signInUrl, user, signout }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext }