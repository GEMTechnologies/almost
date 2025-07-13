import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User } from 'lucide-react';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

interface UserData {
  fullName: string;
  email: string;
  organizationName: string;
  organizationType: string;
  focusArea: string;
  fundingRange: string;
  phone?: string;
  country: string;
}

const OnboardingChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const conversationSteps = [
    {
      message: "Welcome to Granada OS! 👋",
      delay: 1000
    },
    {
      message: "My name is Granada OS, your intelligent funding assistant.",
      delay: 2000
    },
    {
      message: "I'm here to help you discover funding opportunities and create winning proposals for your organization.",
      delay: 3000
    },
    {
      message: "Let's get started! What's your full name?",
      delay: 1500,
      waitForInput: true,
      field: 'fullName'
    },
    {
      message: (userData: Partial<UserData>) => `Nice to meet you, ${userData.fullName?.split(' ')[0]}! What's your email address?`,
      delay: 1000,
      waitForInput: true,
      field: 'email',
      validation: (input: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
    },
    {
      message: "What's the name of your organization?",
      delay: 1000,
      waitForInput: true,
      field: 'organizationName'
    },
    {
      message: "What type of organization do you represent?",
      delay: 1000,
      waitForInput: true,
      field: 'organizationType',
      suggestions: ['NGO', 'University', 'Hospital', 'Research Institution', 'Government Agency', 'Foundation', 'Other']
    },
    {
      message: "What's your primary focus area or sector?",
      delay: 1000,
      waitForInput: true,
      field: 'focusArea',
      suggestions: ['Education', 'Healthcare', 'Environment', 'Agriculture', 'Technology', 'Social Development', 'Research', 'Arts & Culture', 'Other']
    },
    {
      message: "What funding range are you typically looking for?",
      delay: 1000,
      waitForInput: true,
      field: 'fundingRange',
      suggestions: ['Under $10,000', '$10,000 - $50,000', '$50,000 - $100,000', '$100,000 - $500,000', '$500,000 - $1M', 'Over $1M']
    },
    {
      message: (userData: Partial<UserData>) => `Perfect, ${userData.fullName?.split(' ')[0]}! I'm setting up your personalized dashboard now...`,
      delay: 1500
    },
    {
      message: "Welcome to your Granada OS dashboard! Let's start discovering funding opportunities.",
      delay: 2000,
      final: true
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentStep < conversationSteps.length) {
      const step = conversationSteps[currentStep];
      setIsTyping(true);
      
      setTimeout(() => {
        const messageText = typeof step.message === 'function' 
          ? step.message(userData) 
          : step.message;
        
        const newMessage: ChatMessage = {
          id: Date.now(),
          text: messageText,
          sender: 'bot',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setIsTyping(false);

        if (step.final) {
          setIsComplete(true);
          setTimeout(async () => {
            // Save user data to database
            try {
              const response = await fetch('/api/users/create-profile', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  ...userData,
                  onboardingCompleted: true,
                  credits: 100, // Welcome bonus
                  userType: 'standard'
                })
              });
              
              if (response.ok) {
                localStorage.setItem('granadaUserData', JSON.stringify(userData));
                localStorage.setItem('onboardingCompleted', 'true');
                navigate('/dashboard');
              }
            } catch (error) {
              console.error('Error saving user profile:', error);
              // Fallback to localStorage
              localStorage.setItem('granadaUserData', JSON.stringify(userData));
              localStorage.setItem('onboardingCompleted', 'true');
              navigate('/dashboard');
            }
          }, 3000);
        } else if (!step.waitForInput) {
          setTimeout(() => {
            setCurrentStep(prev => prev + 1);
          }, 1000);
        }
      }, step.delay);
    }
  }, [currentStep, userData, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const currentStepData = conversationSteps[currentStep];
    
    // Validate input if validation function exists
    if (currentStepData.validation && !currentStepData.validation(currentInput)) {
      const errorMessage: ChatMessage = {
        id: Date.now(),
        text: "Please enter a valid format. Try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now(),
      text: currentInput,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Update user data
    if (currentStepData.field) {
      setUserData(prev => ({
        ...prev,
        [currentStepData.field]: currentInput
      }));
    }

    setCurrentInput('');
    setCurrentStep(prev => prev + 1);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentInput(suggestion);
  };

  const currentStepData = conversationSteps[currentStep];
  const showInput = currentStepData?.waitForInput && !isComplete;
  const showSuggestions = currentStepData?.suggestions && showInput;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Granada OS</h1>
            <p className="text-sm text-gray-400">Intelligent Funding Assistant</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-2xl ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'bot' 
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' 
                    : 'bg-gray-600'
                }`}>
                  {message.sender === 'bot' ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                
                <div className={`rounded-2xl px-4 py-3 ${
                  message.sender === 'bot'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                }`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className="text-xs opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-3 max-w-2xl">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-800 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {showSuggestions && (
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-2">
            {currentStepData.suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm border border-gray-600 hover:border-emerald-500 transition-colors"
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      {showInput && (
        <div className="p-6 border-t border-gray-800">
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Type your response..."
              className="flex-1 bg-gray-800 border border-gray-600 rounded-full px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              autoFocus
            />
            <button
              type="submit"
              disabled={!currentInput.trim()}
              className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center hover:from-emerald-600 hover:to-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </form>
        </div>
      )}

      {/* Completion Animation */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full w-32 h-32 flex items-center justify-center"
          >
            <Bot className="w-16 h-16 text-white" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default OnboardingChat;