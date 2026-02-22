"use client"
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

function DashBoardClient({ ownerid }: { ownerid: string }) {
    const [businessName, setBusinessName] = useState("")
    const [supportEmail, setSupportEmail] = useState("")
    const [knowledgeBase, setKnowledgeBase] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [showEmbed, setShowEmbed] = useState(false)
    const [justSaved, setJustSaved] = useState(false)


    useEffect(() => {
        const handleGetDetails = async () => {
            setLoading(true)
            try {
                const response = await fetch(`/api/settings/get?ownerid=${ownerid}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                if (!response.ok) {
                    throw new Error("Failed to get settings")
                }
                const data = await response.json()
                if (data.settings) {
                    setBusinessName(data.settings.businessname || "")
                    setSupportEmail(data.settings.supportEmail || "")
                    setKnowledgeBase(data.settings.knowledgebase || "")
                }
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.error(error)
                setError("Failed to get settings")
            }
        }
        if (ownerid) handleGetDetails()
    }, [])

    const handleSettings = async () => {
        setLoading(true)
        setError("")
        try {
            const response = await fetch("/api/settings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    businessName,
                    supportEmail,
                    knowledgeBase,
                    ownerid
                })
            })
            if (!response.ok) {
                throw new Error("Failed to update settings")
            }
            setLoading(false)
            setJustSaved(true)
            setShowEmbed(true)
            setTimeout(() => setJustSaved(false), 3000)
        } catch (error) {
            setLoading(false)
            setError("Failed to update settings")
        }
    }

    const copyEmbedCode = () => {
        const script = `<script src="${window.location.origin}/chatBot.js" data-ownerid="${ownerid}"></script>`
        navigator.clipboard.writeText(script)
        alert("Embed code copied to clipboard!")
    }


    return (
        <div className="min-h-screen bg-zinc-50">
            <motion.div
                initial={{ y: -60 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className='fixed top-0 w-full left-0 z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-200'
            >
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex items-center justify-between h-16 w-full'>
                        <div className='flex items-center'>
                            <div className='shrink-0'>
                                <span className='text-2xl font-bold'>Support <span className='text-zinc-400'>.ai</span> </span>
                            </div>
                        </div>
                        <div className='flex items-center gap-4 cursor-pointer'>
                            <button
                                onClick={() => setShowEmbed(!showEmbed)}
                                className='bg-black cursor-pointer text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-800 transition-colors'>
                                {showEmbed ? "Hide Embed Code" : "Embed Chatbot"}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
            <div className="flex items-center justify-center min-h-screen pt-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='max-w-[1600px] w-full mx-auto px-6'
                >
                    <div className='flex items-center justify-between mb-8'>
                        <div>
                            <h1 className='text-3xl font-bold tracking-tight text-zinc-900'>Settings</h1>
                            <p className='text-zinc-500 mt-2'>Manage your chatbot's identity and business details.</p>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                        <div className='lg:col-span-2 space-y-8'>
                            <div className='bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden'>
                                <div className='p-6 border-b border-zinc-200 bg-zinc-50/50'>
                                    <h2 className='text-lg font-semibold text-zinc-900'>Business Profile</h2>
                                    <p className='text-sm text-zinc-500 mt-1'>These details will be visible to your customers during chats.</p>
                                </div>
                                <div className='p-8 space-y-8'>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                        <div className='space-y-3'>
                                            <label className='text-sm font-medium text-zinc-700 block'>Business Name</label>
                                            <input
                                                type="text"
                                                value={businessName}
                                                onChange={(e) => setBusinessName(e.target.value)}
                                                placeholder='e.g. Acme Corp'
                                                className='w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-zinc-400 transition-all placeholder:text-zinc-400'
                                            />
                                        </div>
                                        <div className='space-y-3'>
                                            <label className='text-sm font-medium text-zinc-700 block'>Support Email</label>
                                            <input
                                                type="email"
                                                value={supportEmail}
                                                onChange={(e) => setSupportEmail(e.target.value)}
                                                placeholder='support@example.com'
                                                className='w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-zinc-400 transition-all placeholder:text-zinc-400'
                                            />
                                        </div>
                                    </div>

                                    <div className='space-y-3'>
                                        <div className='flex items-center justify-between'>
                                            <label className='text-sm font-medium text-zinc-700 block'>Knowledge Base</label>
                                            <span className="text-xs text-zinc-500 bg-zinc-100 px-2 py-1 rounded-md">Training Data</span>
                                        </div>
                                        <p className="text-sm text-zinc-500">Add FAQs, policies, delivery times, and other essential information to train your AI.</p>
                                        <textarea
                                            value={knowledgeBase}
                                            onChange={(e) => setKnowledgeBase(e.target.value)}
                                            placeholder='Enter your knowledge base content here. The more specific you are, the better your AI will perform...'
                                            rows={12}
                                            className='w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-zinc-400 transition-all placeholder:text-zinc-400 resize-none font-mono text-sm leading-relaxed'
                                        />
                                    </div>
                                </div>
                                <div className='px-8 py-5 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between'>
                                    <p className="text-sm text-zinc-500 italic">Last updated: Just now</p>
                                    <div className="flex items-center gap-4">
                                        <button className='px-6 py-2.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors'>
                                            Cancel
                                        </button>
                                        <button onClick={handleSettings} className='bg-black text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95'>
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {showEmbed && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className='bg-zinc-900 rounded-2xl border border-zinc-700 p-8 text-white shadow-2xl relative overflow-hidden'
                                >
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h2 className='text-xl font-bold'>🚀 Your Chatbot is Ready!</h2>
                                                <p className='text-zinc-400 text-sm mt-1'>Copy the code below and paste it before the <code>&lt;/body&gt;</code> tag on any website.</p>
                                            </div>
                                            <button
                                                onClick={copyEmbedCode}
                                                className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-all active:scale-95"
                                            >
                                                Copy Code
                                            </button>
                                        </div>
                                        <div className='bg-black/50 border border-zinc-700 rounded-xl p-4 font-mono text-sm text-blue-400 break-all leading-relaxed'>
                                            &lt;script src="{typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/chatBot.js" data-ownerid="{ownerid}"&gt;&lt;/script&gt;
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
                                </motion.div>
                            )}

                            {justSaved && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 font-medium"
                                >
                                    <span>✅ Settings saved successfully!</span>
                                </motion.div>
                            )}
                        </div>

                        <div className='lg:col-span-1'>
                            <div className='bg-blue-50/50 rounded-2xl border border-blue-100 p-6 sticky top-24'>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                        💡
                                    </div>
                                    <h3 className='text-lg font-semibold text-blue-900'>AI Training Tips</h3>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-medium text-blue-900 mb-2 text-sm">Structure Your Data</h4>
                                        <p className="text-sm text-blue-800/80 leading-relaxed">
                                            Use clear headings and bullet points. The AI understands structured information better than walls of text.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-blue-900 mb-2 text-sm">Be Specific</h4>
                                        <p className="text-sm text-blue-800/80 leading-relaxed">
                                            Instead of "We have fast shipping", say "Shipping takes 2-3 business days within the US".
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-blue-900 mb-2 text-sm">Cover Edge Cases</h4>
                                        <p className="text-sm text-blue-800/80 leading-relaxed">
                                            Include details about return exceptions, holiday hours, and specific delivery conditions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    )
}

export default DashBoardClient
