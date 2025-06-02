import React, {useContext, useState} from 'react';
import {HiOutlineLink} from "react-icons/hi";
import {UserContext} from "./UserProvider.jsx";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {setRoleAndUser, setIsAuthenticated} = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password})
            });

            if (!response.ok) throw new Error('Usuario o contraseña incorrectos');

            const data = await response.json();
            sessionStorage.setItem('token', data.token);
            setRoleAndUser();
            setIsAuthenticated(true);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center animated-gradient-bg px-4">

            {/* Capa de opacidad para resaltar el contenido */}
            <div className="absolute inset-0 bg-black bg-opacity-40 z-0"/>

            {/* Tarjeta de login */}
            <div className="relative z-10 bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
                {/* Logo */}
                <div
                    className="flex items-center justify-center gap-2 mb-6 text-3xl font-bold text-cyan-600 drop-shadow-[0_0_15px_cyan]">
                    <HiOutlineLink className="text-cyan-400 text-4xl"/>
                    <span>PROLINK</span>
                </div>

                {/* Título */}
                <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">Iniciar sesión</h2>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Usuario</label>
                        <input
                            type="text"
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Contraseña</label>
                        <input
                            type="password"
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );


}

Login.propTypes = {};

export default Login;
