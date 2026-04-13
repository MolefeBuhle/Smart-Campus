import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! 👋 I'm your Smart Campus Assistant. Ask me anything about the system!",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // System knowledge base
  const knowledgeBase = {
    // General Questions
    'what is this system': 'This is the Smart Campus Portal - a centralized platform for students, lecturers, and administrators to manage academic activities, appointments, timetables, and maintenance issues.',
    'what can i do here': 'You can book appointments with lecturers, view your timetable, report maintenance issues, manage appointments (for lecturers), and track issues (for admins).',
    'how to use': 'First, log in with your credentials. Based on your role (Student/Lecturer/Admin), you will see different options in the sidebar. Click on any option to access that feature.',
    
    // Student Questions
    'how to book appointment': 'Go to "Book Appointment" in the sidebar. Select a lecturer, choose a date and time, enter the purpose, and submit. The lecturer will receive a notification.',
    'how to view timetable': 'Click on "My Timetable" in the sidebar. Your timetable shows all your enrolled courses with days, times, and room locations.',
    'how to report issue': 'Go to "Report Issue" in the sidebar. Fill in the title, description, select the room, choose priority level, and submit.',
    'where are my courses': 'Click on "My Courses" in the sidebar to see all your enrolled courses with progress and assignments.',
    'how to check appointment status': 'Go to "My Appointments" to see all your appointments and their status (pending/confirmed/cancelled).',
    'can i cancel appointment': 'Currently, appointments can only be cancelled by contacting the lecturer directly.',
    
    // Lecturer Questions
    'how to manage appointments': 'Go to "Manage Appointments" to see pending requests. You can Accept or Reschedule each request.',
    'how to see my students': 'Click on "My Students" to see all students enrolled in your courses.',
    'how to view my schedule': 'Click on "My Classes" to see your teaching schedule for the week.',
    'how to accept appointment': 'In Manage Appointments, click the "Accept" button on any pending request. The student will be notified.',
    'how to reschedule': 'Click "Reschedule" on a pending request, select new date and time, then confirm.',
    
    // Admin Questions
    'how to manage issues': 'Go to "Manage Issues" to see all reported maintenance issues. You can change their status to "In Progress" or "Fixed".',
    'how to see all users': 'Click on "Manage Users" to see all registered students, lecturers, and admins.',
    'what are the analytics': 'The dashboard shows total users, total issues, resolution rate, and charts for issue tracking.',
    
    // Account Questions
    'how to register': 'Click "Sign up" on the login page. Fill in your name, email, password, and select your role (Student/Lecturer).',
    'forgot password': 'Currently, please contact the system administrator to reset your password.',
    'how to logout': 'Click the "Logout" button at the bottom of the sidebar.',
    
    // Technical Questions
    'what technology': 'The system is built with React, Tailwind CSS, and uses localStorage for data persistence.',
    'is my data safe': 'All data is stored locally in your browser. For production, we recommend using a cloud database like Firebase.',
    'can i access on mobile': 'Yes! The system is fully responsive and works on mobile, tablet, and desktop devices.'
  };

  const getResponse = (question) => {
    const lowerQuestion = question.toLowerCase().trim();
    
    // Check for exact matches
    for (const [key, answer] of Object.entries(knowledgeBase)) {
      if (lowerQuestion.includes(key) || key.includes(lowerQuestion)) {
        return answer;
      }
    }
    
    // Check for keywords
    if (lowerQuestion.includes('appointment')) {
      return "To book an appointment, go to 'Book Appointment' in the sidebar. Select a lecturer, date, time, and purpose. The lecturer will then accept or reschedule your request.";
    }
    if (lowerQuestion.includes('timetable') || lowerQuestion.includes('schedule')) {
      return "Your timetable is available under 'My Timetable' for students or 'My Classes' for lecturers. It shows all your courses with days, times, and locations.";
    }
    if (lowerQuestion.includes('maintenance') || lowerQuestion.includes('issue') || lowerQuestion.includes('report')) {
      return "To report an issue, go to 'Report Issue'. Fill in the details, select the room, and choose priority. Admin will review and update the status.";
    }
    if (lowerQuestion.includes('course') || lowerQuestion.includes('class')) {
      return "Your enrolled courses are in 'My Courses'. You can see course details, progress, and upcoming assignments.";
    }
    if (lowerQuestion.includes('lecturer') || lowerQuestion.includes('teacher')) {
      return "Lecturers can manage appointment requests, view their students, and see their teaching schedule in the dashboard.";
    }
    if (lowerQuestion.includes('admin') || lowerQuestion.includes('administrator')) {
      return "Admins can manage maintenance issues, view all users, and access analytics on the dashboard.";
    }
    if (lowerQuestion.includes('student')) {
      return "Students can book appointments, view timetables, track courses, and report maintenance issues.";
    }
    if (lowerQuestion.includes('notification')) {
      return "Notifications appear in the bell icon at the top right. You'll be notified about appointment updates and issue status changes.";
    }
    if (lowerQuestion.includes('help') || lowerQuestion.includes('support')) {
      return "I'm here to help! You can ask me about appointments, timetables, courses, maintenance issues, or how to use specific features.";
    }
    
    return "I'm not sure about that. Please ask about appointments, timetables, courses, maintenance, or how to use specific features. You can also check the sidebar for available options based on your role.";
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate bot thinking
    setTimeout(() => {
      const response = getResponse(inputText);
      const botMessage = {
        id: messages.length + 2,
        text: response,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110 z-50 group"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Ask me anything
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 transition-all duration-300 ${isMinimized ? 'w-80 h-14' : 'w-96 h-[500px]'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <span className="font-semibold">Campus Assistant</span>
          <span className="text-xs bg-green-400 text-green-900 px-2 py-0.5 rounded-full ml-2">Online</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-blue-500 p-1 rounded transition"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-blue-500 p-1 rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-sm">
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

          {/* Quick Questions */}
          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => {
                  setInputText('How to book appointment?');
                  handleSendMessage();
                }}
                className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 hover:bg-blue-50 hover:border-blue-300 transition whitespace-nowrap"
              >
                📅 Book Appointment
              </button>
              <button
                onClick={() => {
                  setInputText('How to view timetable?');
                  handleSendMessage();
                }}
                className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 hover:bg-blue-50 hover:border-blue-300 transition whitespace-nowrap"
              >
                🕐 View Timetable
              </button>
              <button
                onClick={() => {
                  setInputText('How to report an issue?');
                  handleSendMessage();
                }}
                className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 hover:bg-blue-50 hover:border-blue-300 transition whitespace-nowrap"
              >
                🔧 Report Issue
              </button>
              <button
                onClick={() => {
                  setInputText('What can lecturers do?');
                  handleSendMessage();
                }}
                className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 hover:bg-blue-50 hover:border-blue-300 transition whitespace-nowrap"
              >
                👨‍🏫 Lecturer Help
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="1"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Ask about appointments, timetables, courses, or how to use features
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatAssistant;