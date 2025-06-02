import React, {createContext, useEffect, useState} from 'react';
import {jwtDecode} from 'jwt-decode';
import PropTypes from "prop-types";

export const UserContext = createContext();

export function UserProvider({children}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState('');
    const [role, setRole] = useState('');
    const [activeSection, setActiveSection] = useState('orders');
    const [isLoading, setIsLoading] = useState(true);

    const setRoleAndUser = () => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            setIsAuthenticated(false);
            setUser('');
            setRole('');
            setIsLoading(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const cleanedRole = decoded.role?.replace("ROLE_", "");
            setUser(decoded.sub || '');
            setRole(cleanedRole || '');
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Token inválido:", error);
            setIsAuthenticated(false);
            setUser('');
            setRole('');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setRoleAndUser();
    }, []);

    return (
        <UserContext.Provider value={{
            isAuthenticated,
            isLoading,
            setIsAuthenticated,
            user,
            role,
            activeSection,
            setActiveSection,
            setRoleAndUser
        }}>
            {children}
        </UserContext.Provider>
    );
}

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};