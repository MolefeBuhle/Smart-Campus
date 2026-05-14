// src/components/common/GroqChat.jsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, Bot } from 'lucide-react';
import Groq from 'groq-sdk';
import { useAuth } from '../../contexts/AuthContext';
import { useAppointments } from '../../contexts/AppointmentContext';
import { useMaintenance } from '../../contexts/MaintenanceContext';

const GroqChat = () => {
  const { user, isAuthenticated } = useAuth();
  const { getStudentAppointments, getLecturerAppointments } = useAppointments();
  const { getUserIssues, getAllIssues, getIssueStats } = useMaintenance();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! 👋 I'm your AI Campus Assistant with real-time access to your portal data. Ask me about your appointments, issues, courses, or anything else!", sender: 'bot', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [groq, setGroq] = useState(null);

  // Initialize Groq client
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (apiKey) {
      const client = new Groq({ apiKey, dangerouslyAllowBrowser: true });
      setGroq(client);
    } else {
      console.error('Groq API key missing in .env');
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Helper functions to get real data
  const getUserAppointments = () => {
    if (!isAuthenticated) return [];
    if (user?.role === 'student') {
      return getStudentAppointments().map(apt => ({
        id: apt.id,
        lecturer: apt.lecturerName,
        date: apt.date,
        time: apt.timeSlot,
        status: apt.status,
        purpose: apt.purpose
      }));
    } else if (user?.role === 'lecturer') {
      return getLecturerAppointments().map(apt => ({
        id: apt.id,
        student: apt.studentName,
        date: apt.date,
        time: apt.timeSlot,
        status: apt.status,
        purpose: apt.purpose
      }));
    }
    return [];
  };

  const getUserIssuesList = () => {
    if (!isAuthenticated) return [];
    return getUserIssues().map(issue => ({
      id: issue.id,
      title: issue.title,
      description: issue.description,
      room: issue.roomName,
      priority: issue.priority,
      status: issue.status,
      createdAt: issue.createdAt
    }));
  };

  const getSystemStats = () => {
    if (user?.role !== 'admin') return null;
    const allIssues = getAllIssues();
    const stats = getIssueStats();
    const users = JSON.parse(localStorage.getItem('campus_users') || '[]');
    return {
      totalUsers: users.length,
      totalIssues: allIssues.length,
      reported: stats.reported,
      inProgress: stats.inProgress,
      fixed: stats.fixed,
      students: users.filter(u => u.role === 'student').length,
      lecturers: users.filter(u => u.role === 'lecturer').length
    };
  };

  const getUserInfo = () => {
    if (!isAuthenticated) return null;
    return {
      name: user.name,
      role: user.role,
      email: user.email,
      studentId: user.studentId || null,
      employeeId: user.employeeId || null
    };
  };

  // Define tools/functions for Groq
  const tools = [
    {
      type: "function",
      function: {
        name: "get_user_appointments",
        description: "Get the user's upcoming appointments with details like date, time, lecturer/student, status, and purpose.",
        parameters: { type: "object", properties: {} }
      }
    },
    {
      type: "function",
      function: {
        name: "get_user_issues",
        description: "Get the issues reported by the current user, including title, description, room, priority, and status.",
        parameters: { type: "object", properties: {} }
      }
    },
    {
      type: "function",
      function: {
        name: "get_user_info",
        description: "Get the current user's profile information: name, role, email, and ID.",
        parameters: { type: "object", properties: {} }
      }
    },
    {
      type: "function",
      function: {
        name: "get_system_stats",
        description: "Get overall system statistics (admin only): total users, students, lecturers, issue counts by status.",
        parameters: { type: "object", properties: {} }
      }
    },
    {
      type: "function",
      function: {
        name: "get_help",
        description: "Provide general help about using the Smart Campus Portal features.",
        parameters: { type: "object", properties: {} }
      }
    }
  ];

  const executeTool = async (toolName) => {
    switch (toolName) {
      case 'get_user_appointments':
        return JSON.stringify(getUserAppointments());
      case 'get_user_issues':
        return JSON.stringify(getUserIssuesList());
      case 'get_user_info':
        return JSON.stringify(getUserInfo());
      case 'get_system_stats':
        return JSON.stringify(getSystemStats());
      case 'get_help':
        return "You can book appointments, view timetable, report issues, manage students (lecturers), and view analytics (admin). Ask me specific questions for live data!";
      default:
        return "Unknown tool";
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    if (!groq) {
      setMessages(prev => [...prev, { id: Date.now(), text: "AI assistant is not available. Please check API key.", sender: 'bot', timestamp: new Date().toLocaleTimeString() }]);
      return;
    }

    const userMessage = { id: Date.now(), text: inputText, sender: 'user', timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Build conversation history (last 15 messages)
      const conversation = messages.slice(-15).concat(userMessage).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      // Initial call to Groq with tools
      let response = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: `You are a helpful assistant for the Smart Campus Portal. You have real-time access to the user's data via function calls. Use the provided tools to answer questions about appointments, issues, user info, and system stats (admin only). If the user asks about their personal data, call the appropriate function. Be friendly and concise. Current user role: ${user?.role || 'none'}.` },
          ...conversation
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        tools: tools,
        tool_choice: 'auto'
      });

      let assistantMessage = response.choices[0].message;
      let finalReply = assistantMessage.content || '';

      // Handle tool calls if any
      while (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        // Append the assistant's tool call message to conversation
        conversation.push(assistantMessage);

        for (const toolCall of assistantMessage.tool_calls) {
          const toolName = toolCall.function.name;
          const toolResult = await executeTool(toolName);
          conversation.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: toolResult
          });
        }

        // Second call to get final answer after tool results
        const secondResponse = await groq.chat.completions.create({
          messages: conversation,
          model: 'llama-3.3-70b-versatile',
          temperature: 0.7,
        });
        const secondAssistant = secondResponse.choices[0].message;
        finalReply = secondAssistant.content || 'I have processed the information.';
        assistantMessage = secondAssistant; // in case more tool calls needed (unlikely)
      }

      const botMessage = { id: Date.now() + 1, text: finalReply, sender: 'bot', timestamp: new Date().toLocaleTimeString() };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Groq error:', error);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: 'Error: ' + error.message, sender: 'bot', timestamp: new Date().toLocaleTimeString() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "How many appointments do I have?",
    "Show my reported issues",
    "What is my role?",
    "System statistics (admin only)",
    "How to book an appointment?",
    "Help me with timetable"
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-500 text-white p-4 rounded-full shadow-lg hover:bg-primary-600 transition-all duration-300 hover:scale-110 z-50 group"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          AI Assistant (real-time data)
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 transition-all duration-300 ${isMinimized ? 'w-80 h-14' : 'w-96 h-[550px]'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 rounded-t-2xl flex justify-between items-center cursor-pointer" onClick={() => isMinimized && setIsMinimized(false)}>
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <span className="font-semibold">AI Assistant (Live Data)</span>
          <span className="text-xs bg-green-400 text-green-900 px-2 py-0.5 rounded-full ml-2">Groq</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
            className="hover:bg-primary-600 p-1 rounded transition"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            className="hover:bg-primary-600 p-1 rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${message.sender === 'user' ? 'bg-primary-500 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'}`}>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-primary-100' : 'text-gray-400'}`}>{message.timestamp}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {quickQuestions.map((q, i) => (
                <button key={i} onClick={() => { setInputText(q); sendMessage(); }} className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 hover:bg-primary-50 hover:border-primary-300 transition whitespace-nowrap">
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={handleKeyPress} placeholder="Ask about your appointments, issues, or anything..." className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" rows="1" />
              <button onClick={sendMessage} disabled={!inputText.trim()} className="bg-primary-500 text-white p-2 rounded-lg hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">Has real-time access to your portal data</p>
          </div>
        </>
      )}
    </div>
  );
};

export default GroqChat;