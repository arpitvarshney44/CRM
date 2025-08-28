import React, { useState, useEffect } from 'react';
import { Send, Search, Phone, Video, MoreVertical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { messagesAPI } from '../utils/api';
import toast from 'react-hot-toast';

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewChat, setShowNewChat] = useState(false);

  useEffect(() => {
    fetchConversations();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation);
    }
  }, [activeConversation]);

  const fetchConversations = async () => {
    try {
      const response = await messagesAPI.getConversations();
      const formattedConversations = response.data.map(conv => ({
        id: conv._id,
        name: conv.participants[0]?.name || 'Unknown',
        avatar: (conv.participants[0]?.name || 'U').charAt(0).toUpperCase(),
        lastMessage: conv.lastMessage,
        timestamp: new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: conv.unreadCount,
        participantId: conv.participants[0]?._id
      }));
      setConversations(formattedConversations);
      if (formattedConversations.length > 0) {
        setActiveConversation(formattedConversations[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await messagesAPI.getMessages(conversationId);
      const formattedMessages = response.data.map(msg => ({
        id: msg._id,
        sender: msg.sender.name,
        message: msg.message,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: msg.sender._id === user.id
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await messagesAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const startNewConversation = async (selectedUser) => {
    const conversationId = `${[user.id, selectedUser._id].sort().join('_')}`;
    setActiveConversation(conversationId);
    setShowNewChat(false);
    
    // Add to conversations list if not exists
    if (!conversations.find(c => c.id === conversationId)) {
      const newConv = {
        id: conversationId,
        name: selectedUser.name,
        avatar: selectedUser.name.charAt(0).toUpperCase(),
        lastMessage: '',
        timestamp: 'Now',
        unread: 0,
        participantId: selectedUser._id
      };
      setConversations(prev => [newConv, ...prev]);
    }
    setMessages([]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const currentConv = conversations.find(conv => conv.id === activeConversation);
      if (!currentConv) return;

      await messagesAPI.sendMessage({
        receiver: currentConv.participantId,
        message: newMessage,
        conversationId: activeConversation
      });

      setNewMessage('');
      fetchMessages(activeConversation);
      fetchConversations();
      toast.success('Message sent');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentConversation = conversations.find(conv => conv.id === activeConversation);

  if (loading) return <div className="flex justify-center py-8">Loading messages...</div>;

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col md:flex-row bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Conversations List */}
      <div className={`${activeConversation ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 border-r border-gray-200 flex-col`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
            <button
              onClick={() => setShowNewChat(!showNewChat)}
              className="bg-indigo-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-600"
            >
              New Chat
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {showNewChat && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Start New Conversation</h3>
              {users.filter(u => !conversations.some(c => c.participantId === u._id)).map(user => (
                <div
                  key={user._id}
                  onClick={() => startNewConversation(user)}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-700">{user.name}</span>
                </div>
              ))}
            </div>
          )}
          {filteredConversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => setActiveConversation(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                activeConversation === conversation.id ? 'bg-indigo-50 border-r-2 border-r-indigo-500' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {conversation.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-900 truncate">{conversation.name}</p>
                    <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                    {conversation.unread > 0 && (
                      <span className="bg-indigo-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${activeConversation ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <button 
                onClick={() => setActiveConversation(null)}
                className="md:hidden mr-3 p-1 text-gray-500 hover:text-gray-700"
              >
                ←
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {currentConversation.avatar}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{currentConversation.name}</p>
                  <p className="text-sm text-green-500">Online</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Video className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.isOwn
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.isOwn ? 'text-indigo-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-2 md:p-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-2 rounded-full hover:opacity-90 transition-opacity"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;