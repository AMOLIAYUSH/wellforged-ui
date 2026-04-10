import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
    id: string;
    full_name?: string;
    email: string;
    role: string;
}

interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // Frontend customer auth is disabled; retain only minimal admin session support.
    useEffect(() => {
        const storedToken = localStorage.getItem("wellforged_admin_token");
        const storedUser = localStorage.getItem("wellforged_admin_user");

        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser) as User);
                setIsLoggedIn(true);
            } catch (error) {
                console.error("Failed to restore admin session:", error);
                localStorage.removeItem("wellforged_admin_token");
                localStorage.removeItem("wellforged_admin_user");
            }
        }
    }, []);

    const login = (token: string, user: User) => {
        setIsLoggedIn(true);
        setUser(user);
        setToken(token);
        localStorage.setItem("wellforged_admin_token", token);
        localStorage.setItem("wellforged_admin_user", JSON.stringify(user));
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        setToken(null);
        localStorage.removeItem("wellforged_admin_token");
        localStorage.removeItem("wellforged_admin_user");
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                user,
                token,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
