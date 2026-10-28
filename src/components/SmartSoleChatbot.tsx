import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  ShoppingBag, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  RotateCcw,
  Tag,
  Truck,
  ExternalLink,
  Plus,
  HelpCircle,
  Flame,
  Check
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, ChatMessage } from '../types';
import { api } from '../services/api';

interface SmartSoleChatbotProps {
  products: Product[];
  onSelectProduct: (id: string) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-msg',
    role: 'assistant',
    content: `Hello! I'm **SmartSole AI**, your personal footwear stylist and shopping assistant. 

I can help you:
- Find the perfect sneakers, running shoes, or formals for your foot type and budget
- Check live inventory and available UK sizes (UK 6–11)
- Apply student discounts with coupon **COLLEGE2026**
- Track your recent Ekart shipments

What are you looking to step into today?`,
    timestamp: 'Just now',
    suggestedActions: [
      '🏃 Running shoes under ₹10,000',
      '👟 Trending college sneakers',
      '🏷️ Active discount coupons',
      '📦 Track my order'
    ],
    recommendedShoeIds: ['prod-nike-air-jordan-1', 'prod-adidas-ultraboost-light']
  }
];

export const SmartSoleChatbot: React.FC<SmartSoleChatbotProps> = ({ products, onSelectProduct }) => {
  const { 
    isAiChatOpen, 
    setIsAiChatOpen, 
    aiInitialPrompt, 
    addToCart, 
    navigateTo, 
    showToast 
  } = useShop();

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiChatOpen) {
      scrollToBottom();
    }
  }, [messages, isAiChatOpen]);

  // Handle incoming initial prompt trigger from other components
  useEffect(() => {
    if (aiInitialPrompt && isAiChatOpen) {
      handleSendMessage(aiInitialPrompt);
    }
  }, [aiInitialPrompt, isAiChatOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await api.askAiChatbot(text, history);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: response.suggestedActions,
        recommendedShoeIds: response.recommendedShoeIds
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content: "I'm having a slight hitch connecting to the neural network. You can explore all our sneakers in the **Shop Footwear** page or use coupon **COLLEGE2026** for 15% off!",
        timestamp: 'Just now',
        suggestedActions: ['Browse Sneakers', 'View Cart', 'Track Orders']
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isAiChatOpen && (
        <button
          onClick={() => setIsAiChatOpen(true)}
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 group ring-2 ring-white/30"
          aria-label="Open SmartSole AI Chatbot"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-blue-700 animate-pulse" />
          </div>
          <span className="font-extrabold text-xs sm:text-sm tracking-wide hidden sm:inline">
            SmartSole AI Stylist
          </span>
          <span className="bg-yellow-400 text-blue-950 text-[10px] font-black uppercase px-1.5 py-0.2 rounded-full hidden sm:inline">
            AI
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isAiChatOpen && (
        <div className={`fixed z-50 transition-all duration-300 shadow-2xl ${
          isExpanded 
            ? 'inset-3 sm:inset-10' 
            : 'bottom-4 sm:bottom-6 right-3 sm:right-6 w-full max-w-sm sm:max-w-md h-[560px] max-h-[85vh]'
        }`}>
          <div className="bg-white rounded-xl flex flex-col h-full overflow-hidden border border-slate-200 shadow-2xl">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white p-3.5 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Bot className="w-5 h-5 text-yellow-300" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm leading-tight">SmartSole AI</h3>
                    <span className="bg-yellow-400 text-blue-950 text-[9px] font-black uppercase px-1 rounded">
                      Gemini 3.8
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                    Online Footwear Stylist & Assistant
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1 text-slate-300">
                <button
                  onClick={handleResetChat}
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded transition-colors"
                  title="Clear conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded transition-colors hidden sm:block"
                  title={isExpanded ? 'Minimize' : 'Expand window'}
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsAiChatOpen(false)}
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded transition-colors"
                  title="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 text-xs">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1">
                      {isUser ? (
                        <>
                          <span>You</span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-blue-600" />
                          <span className="font-semibold text-slate-600">SmartSole AI</span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </>
                      )}
                    </div>

                    {/* Chat Bubble */}
                    <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                      isUser 
                        ? 'bg-[#2874f0] text-white rounded-br-xs shadow-sm font-medium' 
                        : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200 shadow-xs'
                    }`}>
                      <div className="whitespace-pre-line prose-xs">
                        {msg.content}
                      </div>
                    </div>

                    {/* Recommended Shoe Cards rendered directly in chat! */}
                    {!isUser && msg.recommendedShoeIds && msg.recommendedShoeIds.length > 0 && (
                      <div className="w-full pt-2 space-y-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block px-1">
                          Recommended Shoe Matches:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.recommendedShoeIds.map((shoeId) => {
                            const shoe = products.find(p => p.id === shoeId);
                            if (!shoe) return null;
                            return (
                              <div
                                key={shoe.id}
                                className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-xs flex items-center gap-2.5 hover:border-blue-400 transition-all group"
                              >
                                <img
                                  src={shoe.images[0]}
                                  alt={shoe.name}
                                  className="w-12 h-12 object-cover rounded bg-slate-50 border border-slate-100 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase">{shoe.brand}</p>
                                  <p className="font-semibold text-slate-900 truncate text-[11px]">{shoe.name}</p>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="font-bold text-slate-900 text-xs">₹{shoe.price.toLocaleString('en-IN')}</span>
                                    <span className="text-[10px] text-green-700 font-bold">{shoe.discountPercent}% off</span>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <button
                                    onClick={() => {
                                      onSelectProduct(shoe.id);
                                      setIsAiChatOpen(false);
                                    }}
                                    className="p-1 bg-blue-50 hover:bg-[#2874f0] hover:text-white text-blue-700 rounded transition-colors text-[10px] font-bold"
                                    title="View Product Details"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() => {
                                      const size = shoe.sizes.find(s => s.stock > 0)?.size || 8;
                                      addToCart(shoe, size);
                                    }}
                                    className="p-1 bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-700 rounded transition-colors text-[10px] font-bold"
                                    title="Add to Cart"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Action Suggestion Chips */}
                    {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestedActions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(action)}
                            className="bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors shadow-2xs hover:border-blue-400"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-center gap-2 text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200 w-fit shadow-xs">
                  <Bot className="w-4 h-4 text-blue-600 animate-spin" />
                  <span className="text-xs font-medium">SmartSole AI is consulting the footwear catalog...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-white border-t border-slate-200 space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask for shoe advice, sizing, orders, discounts..."
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-full px-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || loading}
                  className="bg-[#2874f0] hover:bg-blue-700 disabled:bg-slate-300 text-white p-2 rounded-full transition-colors shadow-sm cursor-pointer disabled:cursor-not-allowed"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span>Powered by Google Gemini AI & SmartSole Engine</span>
                <button 
                  onClick={() => handleSendMessage("What are the best discount coupons?")} 
                  className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Tag className="w-3 h-3" />
                  Coupons
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
