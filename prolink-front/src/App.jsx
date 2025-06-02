import React, {useContext} from 'react';
import {UserContext, UserProvider} from "./components/main/user/UserProvider.jsx";
import Login from "./components/main/user/Login.jsx";
import Body from "./components/main/Body.jsx";
import TopNavBar from "./components/header/TopNavBar.jsx";

function LoadingScreen() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
            <p>Cargando...</p>
            {/* Aquí podrías poner un spinner o animación */}
        </div>
    );
}

function AppContent() {
    const {isAuthenticated, isLoading} = useContext(UserContext);

    if (isLoading) {
        return <LoadingScreen/>;
    }

    if (!isAuthenticated) {
        return <Login/>;
    }

    return (
        <div className="bg-neutral-900">
            <TopNavBar/>
            <Body/>
        </div>
    );
}

export default function App() {
    return (
        <UserProvider>
            <AppContent />
        </UserProvider>
    );
}
