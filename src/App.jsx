import { useState, useEffect, useRef } from "react";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";

function App() {
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: "Hey baby 💕 I'm your sweet boyfriend! How can I make you smile today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setShowEmoji(false);

    try {
      const res = await axios.post("http://localhost:8080/api/chat", {
        message: input,
      });
      console.log("Server Response:", res.data);


      const aiReply = res.data;
   
      setMessages((prev) => [...prev, { from: "ai", text: aiReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "Oops! Something went wrong 😢" },
      ]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-pink-100 via-rose-200 to-pink-100 shadow-inner rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-400 text-white text-center py-4 font-extrabold text-xl shadow-md">
       Abhay 💘 
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-2xl px-4 py-3 max-w-[80%] text-sm leading-relaxed shadow-md ${
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
      <div className="relative p-3 bg-white border-t border-gray-300 flex items-center gap-2">
        <button
          className="text-xl"
          onClick={() => setShowEmoji((prev) => !prev)}
        >
          😊
        </button>

        {showEmoji && (
          <div className="absolute bottom-16 left-2 z-50">
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
          className={`px-4 py-2 rounded-full text-sm text-white ${
            loading ? "bg-gray-400" : "bg-pink-500 hover:bg-pink-600"
          }`}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default App;
