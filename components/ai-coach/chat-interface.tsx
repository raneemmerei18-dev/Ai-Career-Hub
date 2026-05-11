"use client"

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, UIMessage } from 'ai'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sparkles, Send, User, Loader2, Copy, Check, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInterfaceProps {
  context?: {
    userProfile?: Record<string, unknown>
    targetRole?: string
    currentRole?: string
  }
  initialMessages?: UIMessage[]
  className?: string
}

function getUIMessageText(msg: UIMessage): string {
  if (!msg.parts || !Array.isArray(msg.parts)) return ''
  return msg.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
}

export function ChatInterface({ context, initialMessages = [], className }: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const { messages, sendMessage, status, reload } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/ai/chat',
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: {
          messages,
          id,
          context,
        },
      }),
    }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const suggestedQuestions = [
    "How can I improve my resume for a senior role?",
    "What skills should I focus on for career growth?",
    "Help me prepare for a technical interview",
    "Review my experience and suggest improvements",
  ]

  return (
    <Card className={cn("flex flex-col h-[600px] overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-primary/5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold">AI Career Coach</h3>
          <p className="text-sm text-muted-foreground">
            {isLoading ? 'Thinking...' : 'Ready to help with your career journey'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-lg font-medium mb-2">How can I help you today?</h4>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              I can help with resume optimization, interview prep, career advice, and more.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {suggestedQuestions.map((question, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="text-left h-auto py-2 px-3 justify-start"
                  onClick={() => {
                    sendMessage({ text: question })
                  }}
                >
                  <span className="line-clamp-2 text-xs">{question}</span>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const text = getUIMessageText(message)
              const isUser = message.role === 'user'
              
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    isUser && "flex-row-reverse"
                  )}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className={cn(
                      isUser ? "bg-muted" : "bg-primary text-primary-foreground"
                    )}>
                      {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "flex flex-col gap-1 max-w-[80%]",
                    isUser && "items-end"
                  )}>
                    <div className={cn(
                      "rounded-lg px-3 py-2 text-sm",
                      isUser 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    )}>
                      <div className="whitespace-pre-wrap">{text}</div>
                    </div>
                    {!isUser && text && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleCopy(text, message.id)}
                        >
                          {copiedId === message.id ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your career..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
          {messages.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => reload()}
              disabled={isLoading}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </form>
      </div>
    </Card>
  )
}
