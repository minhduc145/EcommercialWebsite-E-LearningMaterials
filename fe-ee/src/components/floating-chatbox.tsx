'use client'
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import MarkdownRenderer from "./ui/MarkdownRenderer";
export default function ChatBox() {
    const [openBox, setOpenBox] = useState(false)
    const [messages, setMessages] = useState<{ from: string; text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage = { from: 'You', text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        await getAnswer(userMessage.text.concat(", ưu tiên trả lời bằng tiếng Việt, ngắn gọn"));
    };

    const getAnswer = async (userText: string) => {
        setIsTyping(true);
        const result = await handleSubmit(userText);
        setMessages((prev) => [...prev, { from: 'Bot', text: result }]);
        setIsTyping(false);
    };

    const handleSubmit = async (message: string) => {
        const res = await fetch("/api/groq", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: message, model: "meta-llama/llama-4-maverick-17b-128e-instruct" }),
        });
        const data = await res.json();
        return (data.content);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col ">
            {openBox &&
                <>
                    <div className="min-h-[70dvh] max-h-[70dvh] fixed bottom-20 right-4 w-80 bg-white border border-gray-300 rounded-xl shadow-xl z-50 flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="bg-blue-600 text-white px-4 py-2 font-semibold flex justify-between">
                            Hỗ trợ <span className="hover:cursor-pointer" onClick={() => setOpenBox(!openBox)}>&times;</span>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 px-4 py-2 space-y-2 h-64 overflow-y-auto text-sm">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.from === 'You' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`px-2 py-2 rounded-lg max-w-[80%] break-words whitespace-pre-wrap ${msg.from === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                                            }`}
                                    >
                                        <MarkdownRenderer content={msg.text} />
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                            {isTyping && <>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-gray-200 border border-gray-300 sh-ani-typing-1 dark:bg-gray-800 dark:border-gray-700 dark:border-gray-800 animate-bounce float-left" />
                                    <div className="w-2 h-2 rounded-full bg-gray-200 border border-gray-300 sh-ani-typing-2 dark:bg-gray-800 dark:border-gray-700 dark:border-gray-800 animate-bounce float-left" />
                                    <div className="w-2 h-2 rounded-full bg-gray-200 border border-gray-300 sh-ani-typing-3 dark:bg-gray-800 dark:border-gray-700 dark:border-gray-800 animate-bounce float-left" />
                                </div>
                            </>}
                        </div>

                        {/* Input */}
                        <div className="flex items-center border-t px-2 py-2">
                            <input
                                className="flex-1 px-3 py-1 border border-gray-300 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-300"
                                placeholder="Nhập tin nhắn..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button
                                onClick={handleSend}
                                className="ml-2 text-blue-600 hover:text-blue-800 transition"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </>
            }
            <Button className="bg-orange-400 text-white p-5 rounded-full shadow-lg hover:bg-orange-200 transition-all" onClick={() => setOpenBox(!openBox)}>
                <MessageCircle className="w-5 h-5" />
            </Button>
        </div>
    );
}
