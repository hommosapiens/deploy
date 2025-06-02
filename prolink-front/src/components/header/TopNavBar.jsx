import React, {useContext, useState} from "react";
import {HiMenu, HiOutlineLink, HiX} from "react-icons/hi";
import {UserContext} from "../main/user/UserProvider.jsx";

export const TopNavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {user, role, setActiveSection} = useContext(UserContext);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };


    return (
        <div id={"TopNavBar"} className="w-full text-white shadow-lg">
            <nav className="relative px-4 py-2">

                <div id={"Navigation display"} className="flex items-center justify-between">
                    {/* Logo with Tooltip */}
                    <div className="relative group">
                        <div className="flex items-center gap-2 p-4 text-2xl font-bold text-cyan-300 cursor-pointer">
                            <HiOutlineLink/>
                            <span className="text-shadow-[0_0px_25px_cyan]">PROLINK</span>
                        </div>

                        {/* Tooltip */}
                        <div
                            className="absolute z-50 hidden group-hover:block top-full left-0 mt-2 px-4 py-2 bg-gray-800 rounded-lg shadow-lg border border-cyan-300">
                            <div className="text-sm whitespace-nowrap">
                                <p className="font-semibold text-cyan-300">Usuario: <span
                                    className="text-white">{user}</span>
                                </p>
                                <p className="font-semibold text-cyan-300">Versión: <span
                                    className="text-white">v1.0.0-alpha</span></p>
                            </div>

                            {/* Flecha del tooltip */}
                            <div
                                className="absolute -top-2 left-8 w-4 h-4 bg-gray-800 border-l border-t border-cyan-300 transform rotate-45"></div>
                        </div>
                    </div>

                    {/* Small screen display menu button */}
                    {role !== "USER" && (
                        <button className="md:hidden text-2xl hover:text-cyan-300 transition" onClick={toggleMenu}>
                            {isMenuOpen ? <HiX/> : <HiMenu/>}
                        </button>
                    )}

                    {/* Big screen menu */}
                    <div className="hidden md:flex flex-1 items-center justify-between px-8">

                        {role !== "USER" && (
                            <>
                                <button
                                    onClick={() => setActiveSection("orders")}
                                    className="flex-1 text-center hover:text-cyan-300 transition py-2 px-4 border-b-2 border-transparent hover:border-cyan-300">
                                    Pedidos
                                </button>
                                <button
                                    onClick={() => setActiveSection("products")}
                                    className="flex-1 text-center hover:text-cyan-300 transition py-2 px-4 border-b-2 border-transparent hover:border-cyan-300">
                                    Productos
                                </button>
                                <button
                                    onClick={() => setActiveSection("processes")}
                                    className="flex-1 text-center hover:text-cyan-300 transition py-2 px-4 border-b-2 border-transparent hover:border-cyan-300">
                                    Procesos
                                </button>
                                <button
                                    onClick={() => setActiveSection("states")}
                                    className="flex-1 text-center hover:text-cyan-300 transition py-2 px-4 border-b-2 border-transparent hover:border-cyan-300">
                                    Estados
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Small screen menu */}
                <div
                    id={"Navigation mobile"}
                    className={`${isMenuOpen ? "flex" : "hidden"} md:hidden flex-col w-full absolute left-0 right-0  top-full shadow-lg bg-neutral-800 z-50`}
                >

                    <button
                        onClick={() => {
                            setActiveSection("orders");
                            toggleMenu();
                        }}
                        className="w-full hover:text-cyan-300 transition py-4 hover:bg-gray-700 border-b border-gray-700">
                        Pedidos
                    </button>
                    <button
                        onClick={() => {
                            setActiveSection("products");
                            toggleMenu();
                        }}
                        className="w-full hover:text-cyan-300 transition py-4 hover:bg-gray-700 border-b border-gray-700">
                        Productos
                    </button>
                    <button
                        onClick={() => {
                            setActiveSection("processes");
                            toggleMenu();
                        }}
                        className="w-full hover:text-cyan-300 transition py-4 hover:bg-gray-700 border-b border-gray-700">
                        Procesos
                    </button>
                    <button
                        onClick={() => {
                            setActiveSection("states");
                            toggleMenu();
                        }}
                        className="w-full hover:text-cyan-300 transition py-4 hover:bg-gray-700 border-b border-gray-700">
                        Estados
                    </button>
                </div>
            </nav>

        </div>);
};

TopNavBar.propTypes = {}

export default TopNavBar;