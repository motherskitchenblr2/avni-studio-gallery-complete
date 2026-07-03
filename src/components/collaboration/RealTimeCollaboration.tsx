'use client'
 
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  UserPlus, 
  MessageCircle, 
  Share2, 
  Video, 
  Mic, 
  MicOff,
  Camera,
  CameraOff,
  Settings,
  HelpCircle,
  Send,
  Plus,
  Edit3,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { TouchGesture } from '@/components/ui/TouchGesture'
import { cn } from '@/components/ui/utils'
 
interface CollaborationUser {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'owner' | 'editor' | 'viewer'
  status: 'online' | 'away' | 'offline'
  lastSeen?: string
  cursor?: { x: number; y: number }
}
 
interface CollaborationMessage {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  timestamp: string
  type: 'text' | 'image' | 'file' | 'system'
  isEdited?: boolean
}
 
interface SharedResource {
  id: string
  name: string
  type: 'image' | 'collection' | 'workspace'
  owner: string
  sharedAt: string
  permissions: {
    canEdit: boolean
    canComment: boolean
    canShare: boolean
  }
  activeUsers: string[]
}
 
interface RealTimeCollaborationProps {
  isOpen: boolean
  onClose: () => void
  workspaceId?: string
}
 
export const RealTimeCollaboration = ({
  isOpen,
  onClose,
  workspaceId = 'default-workspace'
}: RealTimeCollaborationProps) => {
  const [users, setUsers] = useState<CollaborationUser[]>([])
  const [messages, setMessages] = useState<CollaborationMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'chat' | 'shared' | 'video'>('chat')
  const [isTyping, setIsTyping] = useState<string[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [sharePermission, setSharePermission] = useState<'view' | 'edit'>('view')
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isMicOn, setIsMicOn] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
 
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
 
  // Mock data
  const mockUsers: CollaborationUser[] = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@avnistudio.com',
      role: 'owner',
      status: 'online',
      lastSeen: 'Active now'
    },
    {
      id: '2',
      name: 'Jane Doe',
      email: 'jane.doe@company.com',
      role: 'editor',
      status: 'online',
      lastSeen: 'Active now'
    },
    {
      id: '3',
      name: 'John Smith',
      email: 'john.smith@company.com',
      role: 'viewer',
      status: 'away',
      lastSeen: '2 minutes ago'
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      role: 'editor',
      status: 'offline',
      lastSeen: '1 hour ago'
    }
  ]
 
  const mockMessages: CollaborationMessage[] = [
    {
      id: '1',
      userId: '1',
      userName: 'Admin User',
      content: 'Welcome to the collaboration workspace!',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'text'
    },
    {
      id: '2',
      userId: '2',
      userName: 'Jane Doe',
      content: 'Thanks! I\'ve uploaded some new AI-generated images.',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      type: 'text',
      isEdited: true
    },
    {
      id: '3',
      userId: '3',
      userName: 'John Smith',
      content: 'The style transfer results look amazing!',
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      type: 'text'
    }
  ]
 
  const mockSharedResources: SharedResource[] = [
    {
      id: '1',
      name: 'Cyberpunk Collection',
      type: 'collection',
      owner: 'admin@avnistudio.com',
      sharedAt: new Date(Date.now() - 86400000).toISOString(),
      permissions: {
        canEdit: true,
        canComment: true,
        canShare: true
      },
      activeUsers: ['1', '2']
    },
    {
      id: '2',
      name: 'AI Generated Artwork',
      type: 'image',
      owner: 'jane.doe@company.com',
      sharedAt: new Date(Date.now() - 3600000).toISOString(),
      permissions: {
        canEdit: false,
        canComment: true,
        canShare: false
      },
      activeUsers: ['1', '2', '3']
    }
  ]
 
  useEffect(() => {
    if (isOpen) {
      loadData()
      simulateUserActivity()
    }
  }, [isOpen])
 
  const loadData = () => {
    setUsers(mockUsers)
    setMessages(mockMessages)
  }
 
  const simulateUserActivity = () => {
    // Simulate real-time typing
    setInterval(() => {
      const randomUser = users[Math.floor(Math.random() * users.length)]
      if (randomUser.status === 'online') {
        setIsTyping(prev => [...prev, randomUser.id])
        
        setTimeout(() => {
          setIsTyping(prev => prev.filter(id => id !== randomUser.id))
        }, 3000)
      }
    }, 10000)
  }
 
  const sendMessage = async () => {
    if (!newMessage.trim()) return
 
    const message: CollaborationMessage = {
      id: Date.now().toString(),
      userId: '1', // Current user
      userName: 'Admin User',
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text'
    }
 
    setMessages(prev => [...prev, message])
    setNewMessage('')
 
    // Simulate other users responding
    setTimeout(() => {
      const responses = [
        'Great idea! Let me try that.',
        'I agree with that approach.',
        'Can you elaborate on that?',
        'Thanks for sharing!'
      ]
      
      const randomUser = users[Math.floor(Math.random() * users.length)]
      const response: CollaborationMessage = {
        id: Date.now().toString(),
        userId: randomUser.id,
        userName: randomUser.name,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
        type: 'text'
      }
      
      setMessages(prev => [...prev, response])
    }, 2000 + Math.random() * 3000)
  }
 
  const handleTyping = (content: string) => {
    setNewMessage(content)
    
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }
    
    setTypingTimeout(setTimeout(() => {
      setIsTyping([])
    }, 1000))
  }
 
  const startVideoCall = () => {
    setIsVideoOn(true)
    setIsMicOn(true)
    setIsCameraOn(true)
  }
 
  const endVideoCall = () => {
    setIsVideoOn(false)
    setIsMicOn(false)
    setIsCameraOn(false)
  }
 
  const shareWithUsers = () => {
    if (selectedUsers.length === 0) return
 
    // Simulate sharing
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          userId: '1',
          userName: 'Admin User',
          content: `Shared resources with ${selectedUsers.length} user(s)`,
          timestamp: new Date().toISOString(),
          type: 'system'
        }
      ])
    }, 500)
  }
 
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
 
  useEffect(() => {
    scrollToBottom()
  }, [messages])
 
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Real-Time Collaboration"
      size="full"
      className="max-w-6xl"
    >
      <div className="h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">Collaboration Hub</h2>
              <p className="text-sm text-gray-400">Workspace: {workspaceId}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={isVideoOn ? 'secondary' : 'outline'}
              size="sm"
              onClick={isVideoOn ? endVideoCall : startVideoCall}
            >
              {isVideoOn ? (
                <>
                  <Video className="w-4 h-4 mr-2" />
                  End Call
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 mr-2" />
                  Start Call
                </>
              )}
            </Button>
            
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
 
        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Sidebar */}
          <div className="w-80 bg-gray-900 border-r border-gray-700 flex flex-col">
            {/* Online Users */}
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Online Users</h3>
              <div className="space-y-2">
                {users
                  .filter(user => user.status === 'online')
                  .map(user => (
                    <motion.div
                      key={user.id}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
                    >
                      <div className="relative">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium`}>
                          {user.name.charAt(0)}
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${
                          user.status === 'online' ? 'bg-green-400' :
                          user.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {user.status === 'online' ? 'Active now' : 
                           user.status === 'away' ? 'Away' : 
                           `Last seen ${user.lastSeen}`}
                        </p>
                      </div>
                      {user.role === 'owner' && (
                        <span className="text-xs text-purple-400">Owner</span>
                      )}
                    </motion.div>
                  ))}
              </div>
            </div>
 
            {/* Shared Resources */}
            <div className="flex-1 p-4 overflow-y-auto">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Shared Resources</h3>
              <div className="space-y-2">
                {mockSharedResources.map(resource => (
                  <div key={resource.id} className="p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          resource.type === 'image' ? 'bg-blue-400' :
                          resource.type === 'collection' ? 'bg-purple-400' : 'bg-green-400'
                        }`}></div>
                        <span className="text-sm font-medium text-white">
                          {resource.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {resource.activeUsers.length} active
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-gray-400">
                        Owner: {resource.owner.split('@')[0]}
                      </span>
                      {resource.permissions.canEdit && (
                        <span className="text-green-400">Can edit</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
 
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => setActiveTab('chat')}
                className={cn(
                  'px-4 py-2 font-medium transition-colors',
                  activeTab === 'chat'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-gray-300'
                )}
              >
                Chat ({messages.length})
              </button>
              <button
                onClick={() => setActiveTab('shared')}
                className={cn(
                  'px-4 py-2 font-medium transition-colors',
                  activeTab === 'shared'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-gray-300'
                )}
              >
                Shared Files
              </button>
              {isVideoOn && (
                <button
                  onClick={() => setActiveTab('video')}
                  className={cn(
                    'px-4 py-2 font-medium transition-colors',
                    activeTab === 'video'
                      ? 'text-cyan-400 border-b-2 border-cyan-400'
                      : 'text-gray-400 hover:text-gray-300'
                  )}
                >
                  Video Call
                </button>
              )}
            </div>
 
            {/* Tab Content */}
            <div className="flex-1 flex flex-col">
              {activeTab === 'chat' && (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            'flex space-x-3 p-3 rounded-lg',
                            message.userId === '1'
                              ? 'bg-cyan-500/10 ml-8'
                              : 'bg-gray-800 mr-8'
                          )}
                        >
                          <div className="flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${
                              message.userId === '1' ? 'from-cyan-500 to-cyan-400' : 'from-gray-600 to-gray-500'
                            } flex items-center justify-center text-white text-xs font-medium`}>
                              {message.userName.charAt(0)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-white">
                                {message.userName}
                              </span>
                              {message.isEdited && (
                                <span className="text-xs text-gray-400">(edited)</span>
                              )}
                              <span className="text-xs text-gray-500">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300">
                              {message.content}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
 
                    {/* Typing Indicator */}
                    {isTyping.length > 0 && (
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span>Someone is typing</span>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    )}
 
                    <div ref={messagesEndRef} />
                  </div>
 
                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-700">
                    <div className="flex space-x-2">
                      <Input
                        ref={inputRef}
                        value={newMessage}
                        onChange={(e) => handleTyping(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1"
                      />
                      <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
 
              {activeTab === 'shared' && (
                <div className="flex-1 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Share Resources</h3>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Share New
                    </Button>
                  </div>
 
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Share with users
                      </label>
                      <div className="flex items-center space-x-2 mb-2">
                        <Select
                          value={sharePermission}
                          onValueChange={(value: any) => setSharePermission(value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="view">Can view</SelectItem>
                            <SelectItem value="edit">Can edit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {users
                          .filter(user => user.status === 'online')
                          .map(user => (
                            <button
                              key={user.id}
                              onClick={() => {
                                if (selectedUsers.includes(user.id)) {
                                  setSelectedUsers(prev => prev.filter(id => id !== user.id))
                                } else {
                                  setSelectedUsers(prev => [...prev, user.id])
                                }
                              }}
                              className={cn(
                                'flex items-center space-x-2 px-3 py-1 rounded-full text-sm',
                                selectedUsers.includes(user.id)
                                  ? 'bg-cyan-500/20 text-cyan-400'
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              )}
                            >
                              <div className={`w-2 h-2 rounded-full ${
                                user.status === 'online' ? 'bg-green-400' : 'bg-gray-500'
                              }`}></div>
                              <span>{user.name}</span>
                            </button>
                          ))}
                      </div>
                    </div>
 
                    <div className="flex space-x-2">
                      <Button onClick={shareWithUsers} disabled={selectedUsers.length === 0}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline" onClick={() => setSelectedUsers([])}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
 
              {activeTab === 'video' && (
                <div className="flex-1 p-4">
                  <div className="h-full bg-gray-900 rounded-lg flex items-center justify-center relative">
                    <div className="text-center">
                      <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">Video Call</h3>
                      <p className="text-gray-400 mb-4">
                        {users.filter(u => u.status === 'online').length} participants
                      </p>
                      
                      <div className="flex items-center justify-center space-x-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsMicOn(!isMicOn)}
                          className={isMicOn ? 'bg-green-500/20 text-green-400' : ''}
                        >
                          {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => setIsCameraOn(!isCameraOn)}
                          className={isCameraOn ? 'bg-green-500/20 text-green-400' : ''}
                        >
                          {isCameraOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                        </Button>
                        
                        <Button onClick={endVideoCall} variant="destructive">
                          End Call
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
