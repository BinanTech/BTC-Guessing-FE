import { createContext, ReactNode, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import Router, { useRouter } from "next/router";

import { api } from "../services/apiClient";

export type User = {
  email: string;
  _id: string;
  username: string;
};

export type Guess = {
  _id: string;
  userId: string;
  score: string;
}

export type SignInCredentials = {
  email: string;
  password: string;
};

export type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  setInitialPrice: (price: string) => void;
  setGuess: (guess: Guess) => void;
  setUser: (user: User) => void;
  user: User;
  isError: boolean;
  isAuthenticated: boolean;
  guess: Guess;
  initialPrice: string;
};

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface ResponseData {
  tokens: Tokens
  user: User;
  guess: Guess;
  price: string;
}

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  destroyCookie(undefined, "nextauth.token");
  destroyCookie(undefined, "nextauth.refreshToken");

  // authChannel.postMessage('signOut');

  Router.push("/auth/login");
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>({} as User);
  const [isError, setIsError] = useState(false);
  const isAuthenticated = !!user;
  const router = useRouter();
  const [guess, setGuess] = useState<Guess>({} as Guess);
  const [initialPrice, setInitialPrice] = useState<string>('');

  useEffect(() => {
    if (router.asPath.split("/")[1] === "auth") return;

    const { "nextauth.token": token } = parseCookies();

    if (token) {
      api
        .get("/auth/me")
        .then((response) => {
          const { user, guess, price } = response.data as ResponseData;
          setGuess(guess);
          setInitialPrice(price);
          if (user) setUser(user);
          else signOut();
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { tokens, user, guess, price } = response.data as ResponseData;
      setGuess(guess);
      setInitialPrice(price);
      setCookie(undefined, "nextauth.token", tokens.accessToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 Dias
        path: "/",
      });

      setCookie(undefined, "nextauth.refreshToken", tokens.refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 Dias
        path: "/",
      });

      // const socket = io('http://localhost:1080', {query: {token: tokens.accessToken}, transports: ['websocket']});
      // setSocket(socket);

      setUser(user);

      api.defaults.headers["Authorization"] = `Bearer ${tokens.accessToken}`;

      setIsError(false);

      Router.push("/");
    } catch (error) {
      console.log("API ERROR:", error);
      setIsError(true);
      return;
    }
  }

  return (
    <AuthContext.Provider
      value={{ signIn, signOut, isAuthenticated, isError, user, guess, initialPrice, setInitialPrice, setGuess, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
