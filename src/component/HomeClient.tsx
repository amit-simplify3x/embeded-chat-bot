"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import axios from 'axios';

const HomeClient = ({ email }: { email: string }) => {


    const [open, setOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);


    const handleLogin = () => {
        window.location.href = '/api/auth/login'
    }

    const handleDashboardClick = () => {
        if (email) {
            window.location.href = '/dashboard';
        } else {
            setShowLoginModal(true);
        }
    }

    const handleLogout = async () => {
        try {
            const result = await axios.get('/api/auth/logout')
            if (result.status === 200) {
                window.location.href = '/'
            }
        } catch (error) {

        }
    }


    const firstLetter = email?.split("@")[0]?.[0]?.toUpperCase() || ""

    return (
        <div className='min-h-screen bg-linear-to-br from-white to-zinc-50 text-zinc-900 overflow-x-hidden flex flex-col'>
            <motion.div
                initial={{ y: -60 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}

                className='fixed top-0 w-full left-0 z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-200'
            >
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex items-center justify-between h-16 w-full'>
                        <div className='flex items-center'>
                            <div className='flex-shrink-0'>
                                <span className='text-2xl font-bold'>Support <span className='text-zinc-400'>.ai</span> </span>
                            </div>
                        </div>
                        <motion.div ref={menuRef} className='relative flex items-center cursor-pointer'>
                            {
                                email ? (
                                    <div className='h-10 w-10 rounded-full flex items-center justify-center text-white bg-black'
                                        onClick={() => setOpen(!open)}
                                    >
                                        <span>{firstLetter}</span>
                                    </div>
                                ) : (
                                    <div className='flex-shrink-0'>
                                        <span className='text-2xl font-bold' onClick={handleLogin}>login</span>
                                    </div>
                                )
                            }
                            <AnimatePresence>
                                {
                                    open && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className='absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-zinc-100 py-1 flex flex-col z-50 origin-top-right'
                                        >
                                            <div className='px-4 py-2 hover:bg-zinc-50 cursor-pointer text-sm font-medium transition-colors'>Dashboard</div>
                                            <div className='px-4 py-2 hover:bg-zinc-50 cursor-pointer text-sm font-medium transition-colors text-red-500' onClick={handleLogout}>Logout</div>
                                        </motion.div>
                                    )
                                }
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
            <section className='pt-32 pb-20 px-6 grow flex items-center justify-center min-h-[calc(100vh-4rem)]'>
                <div className='max-w-7xl mx-auto w-full'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center'>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className='max-w-2xl'
                        >
                            <h1 className='text-5xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight'>
                                AI-Powered <br />
                                <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'>
                                    Customer Support
                                </span>
                            </h1>
                            <p className='text-xl text-zinc-600 mb-10 leading-relaxed'>
                                Deliver instant, intelligent support to your customers 24/7 with our advanced AI chatbot. Streamline your workflow and boost customer satisfaction.
                            </p>
                            <div className='flex flex-wrap gap-4'>
                                <button
                                    onClick={handleDashboardClick}
                                    className='px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-zinc-800 transition-all hover:scale-105 shadow-lg shadow-blue-500/20'
                                >
                                    Go To Dashboard
                                </button>
                                <button
                                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                                    className='px-8 py-4 bg-white text-zinc-900 border border-zinc-200 rounded-full font-semibold hover:bg-zinc-50 transition-all hover:border-zinc-300'
                                >
                                    Learn More
                                </button>
                            </div>
                        </motion.div>
                        <div className='rounded-2xl bg-white shadow-2xl border border-zinc-200 p-6'>
                            <div className='text-sm text-zinc-500 mb-3'>Live chat preview</div>
                            <div className='bg-black text-white rounded-lg text-sm px-4 py-2 ml-auto w-fit'>yes, cash on delviery is available</div>
                            <div className='bg-zinc-100 text-zinc-900 rounded-lg text-sm px-4 py-2 mr-auto w-fit'>yes, cash on delviery is available</div>

                        </div>

                    </div>
                </div>
            </section>

            <section id="features" className='bg-zinc-50 py-28 px-6 border-t border-zinc-200'>
                <div className='max-w-7xl mx-auto'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className='text-center max-w-3xl mx-auto mb-16'
                    >
                        <h2 className='text-3xl lg:text-4xl font-bold mb-6'>Why businesses choose SupportAI</h2>
                        <p className='text-xl text-zinc-600'>
                            Join thousands of businesses already delivering exceptional support with our advanced AI technology.
                        </p>
                    </motion.div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        {[
                            {
                                title: "Instant Responses",
                                description: "Our AI responds to customer queries instantly, 24/7, reducing wait times to zero and fixing problems faster.",
                                icon: "⚡",
                                color: "bg-amber-100 text-amber-600"
                            },
                            {
                                title: "Smart Knowledge Base",
                                description: "Automatically learns from your documentation and past conversations to provide accurate answers.",
                                icon: "📚",
                                color: "bg-blue-100 text-blue-600"
                            },
                            {
                                title: "Seamless Handoff",
                                description: "Intelligently escalates complex issues to human agents when empathy and nuance are needed.",
                                icon: "🤝",
                                color: "bg-green-100 text-green-600"
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className='bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 hover:shadow-md transition-shadow aspect-square flex flex-col items-center justify-center text-center'
                            >
                                <div className={`w-12 h-12 ${feature.color} rounded-2xl flex items-center justify-center text-2xl mb-4`}>
                                    {feature.icon}
                                </div>
                                <h3 className='text-lg font-bold mb-2'>{feature.title}</h3>
                                <p className='text-zinc-600 leading-relaxed text-xs'>
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            <footer className='bg-zinc-50 border-t border-zinc-200 mt-20'>
                <div className='max-w-7xl mx-auto px-6 py-12'>
                    <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
                        <div className='flex items-center gap-2'>
                            <span className='text-xl font-bold'>Support <span className='text-zinc-400'>.ai</span></span>
                            <span className='text-zinc-300 mx-2'>|</span>
                            <p className='text-zinc-500 text-sm'>
                                © {new Date().getFullYear()} Support.ai. All rights reserved.
                            </p>
                        </div>

                        <div className='flex items-center gap-8 text-sm text-zinc-500 font-medium hidden lg:flex'>
                            <span className='hover:text-zinc-900 cursor-pointer transition-colors'>Features</span>
                            <span className='hover:text-zinc-900 cursor-pointer transition-colors'>Pricing</span>
                            <span className='hover:text-zinc-900 cursor-pointer transition-colors'>About Us</span>
                            <span className='hover:text-zinc-900 cursor-pointer transition-colors'>Privacy</span>
                            <span className='hover:text-zinc-900 cursor-pointer transition-colors'>Terms</span>
                        </div>

                        <div className='flex gap-4'>
                            {['twitter', 'github', 'discord'].map((social) => (
                                <div key={social} className='w-9 h-9 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors cursor-pointer'>
                                    <span className='capitalize text-xs'>{social}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>

            <AnimatePresence>
                {showLoginModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={() => setShowLoginModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                                🔒
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Login Required</h3>
                            <p className="text-zinc-600 mb-8">
                                Please log in to access your dashboard and manage your account.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleLogin}
                                    className="w-full py-3 bg-black text-white rounded-xl font-semibold hover:bg-zinc-800 transition-colors"
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={() => setShowLoginModal(false)}
                                    className="w-full py-3 bg-white text-zinc-500 rounded-xl font-semibold hover:bg-zinc-50 transition-colors border border-zinc-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}

export default HomeClient