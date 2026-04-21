import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function AIChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Chào Khiêm! Mình là trợ lý AI của shop. Bạn cần mình tư vấn mẫu quần áo nào không?' }
    ]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            // Đảm bảo port 3000 khớp với Backend của bạn
            const res = await axios.post("http://localhost:3000/api/ai/chat", { message: input });
            setMessages(prev => [...prev, { role: 'bot', text: res.data.reply }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'bot', text: "Hic, server AI đang bận một chút. Bạn thử lại sau nhé!" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center w-14 h-14"
            >
                {isOpen ? "✖" : "💬"}
            </button>

            {isOpen && (
                <div className="bg-white border shadow-2xl w-80 h-[450px] mt-3 rounded-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
                    <div className="p-4 bg-black text-white font-bold shadow-md">
                        Trợ lý AI Bán Hàng
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                    m.role === 'user' 
                                    ? 'bg-black text-white rounded-tr-none' 
                                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                                }`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="text-xs text-gray-400 italic animate-pulse px-2">AI đang suy nghĩ...</div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="p-3 border-t bg-white flex gap-2">
                        <input 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:border-black"
                            placeholder="Hỏi về sản phẩm..." 
                        />
                        <button 
                            onClick={handleSend} 
                            className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}