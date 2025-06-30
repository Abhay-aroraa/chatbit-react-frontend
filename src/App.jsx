import { useState, useEffect, useRef } from "react";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([{ from: "ai", text: "Hey dude 🫶🏻" }]);
    }
  }, []);

  // Save messages
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => {
      const limited = [...prev, userMessage].slice(-50);
      return limited;
    });

    setInput("");
    setLoading(true);
    setShowEmoji(false);

    try {
      const res = await axios.post("https://chatbotnew-backend.onrender.com/api/chat", {
        message: input,
      });
      const aiReply = res.data;
      setMessages((prev) => {
        const limited = [...prev, { from: "ai", text: aiReply }].slice(-50);
        return limited;
      });
    } catch (err) {
      setMessages((prev) => {
        const limited = [...prev, { from: "ai", text: "Oops! Something went wrong 😢" }].slice(-50);
        return limited;
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  const clearChat = () => {
    localStorage.removeItem("chatMessages");
    setMessages([{ from: "ai", text: "Hey dude 🫶🏻" }]);
    setMenuOpen(false);
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-screen-md mx-auto bg-gradient-to-br from-pink-100 via-rose-200 to-pink-100 overflow-hidden">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-pink-500 to-rose-400 text-white py-4 px-4 flex items-center justify-between shadow-md">
        <div className="flex-1 text-center text-lg font-bold">Abhay 🫶🏻</div>
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl font-bold">⋮</button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded shadow-md text-sm w-32 z-50">
              <button
                onClick={clearChat}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Clear Chat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-2xl px-4 py-3 max-w-[85%] text-sm leading-relaxed shadow-md ${
                msg.from === "user"
                  ? "bg-gradient-to-br from-pink-400 to-pink-600 text-white rounded-br-md"
                  : "bg-white text-gray-800 rounded-bl-md"
              }`}
            >
              {msg.text}
              <div className="text-[10px] text-right text-gray-400 mt-1">
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-600 px-4 py-2 rounded-2xl text-sm shadow animate-pulse">
              Typing...
            </div>
          </div>
        )}

        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Section */}
      <div className="sticky bottom-0 z-10 p-2 bg-white border-t border-gray-300 flex items-center justify-center gap-2">
        <div className="relative flex items-center w-full max-w-screen-md px-2">
          <button
            className="text-xl mr-2"
            onClick={() => setShowEmoji((prev) => !prev)}
          >
            😊
          </button>

          {showEmoji && (
            <div className="absolute bottom-16 left-0 z-50 w-[90vw] max-w-xs">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}

          <input
            ref={inputRef}
            type="text"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            disabled={loading}
            onClick={sendMessage}
            className={`ml-2 px-4 py-2 rounded-full text-sm text-white ${
              loading ? "bg-gray-400" : "bg-pink-500 hover:bg-pink-600"
            }`}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
