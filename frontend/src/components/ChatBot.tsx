import { useState } from "react";
import { X } from "lucide-react";

export const GeminiChat = () => {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
            const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
        });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "model", text: data.response }]);
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-blue-600 text-white text-2xl shadow-lg flex items-center justify-center hover:bg-blue-700"
          aria-label="Open Chat"
        >
          💬
        </button>
      )}

      {/* Chatbox */}
      {isOpen && (
        <div className="w-80 h-[450px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-300">
          {/* Header */}
          <div className="flex justify-between items-center p-3 border-b bg-blue-600 text-white rounded-t-lg">
            <h2 className="font-semibold text-sm">AidChain Assistant</h2>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">
              <X size={18} />
            </button>
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-2 text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${msg.role === "user" ? "text-right text-blue-600" : "text-left text-gray-700"}`}
              >
                <span className="block whitespace-pre-wrap">
                  <strong>{msg.role === "user" ? "You" : "AidBot"}:</strong> {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-2 p-2 border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
              placeholder="Ask something..."
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
