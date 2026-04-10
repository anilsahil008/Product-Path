import { useState, useRef, useCallback } from 'react'
import { streamMessage, deleteSession } from '../api/chatApi'

/**
 * All chat state and logic lives here.
 * Components stay pure — they only render and dispatch.
 */
export function useChat() {
  // Generate a stable session ID for this browser tab
  const sessionId = useRef(crypto.randomUUID()).current

  const [messages, setMessages] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState(null)

  const appendMessage = (msg) =>
    setMessages((prev) => [...prev, msg])

  const updateLastAssistantMessage = (contentDelta) =>
    setMessages((prev) => {
      const updated = [...prev]
      const last = updated[updated.length - 1]
      if (last?.role === 'assistant') {
        updated[updated.length - 1] = {
          ...last,
          content: last.content + contentDelta,
          streaming: true,
        }
      }
      return updated
    })

  const finalizeLastAssistantMessage = () =>
    setMessages((prev) => {
      const updated = [...prev]
      const last = updated[updated.length - 1]
      if (last?.role === 'assistant') {
        updated[updated.length - 1] = { ...last, streaming: false }
      }
      return updated
    })

  const sendMessage = useCallback(
    async (text) => {
      if (isStreaming || !text.trim()) return
      setError(null)
      setIsStreaming(true)

      // Optimistically add user message
      appendMessage({ id: crypto.randomUUID(), role: 'user', content: text })

      // Add empty assistant placeholder
      appendMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        streaming: true,
      })

      try {
        for await (const event of streamMessage(sessionId, text)) {
          if (event.type === 'chunk') {
            updateLastAssistantMessage(event.content)
          } else if (event.type === 'error') {
            setError(event.content)
            break
          }
          // 'done' event — loop will naturally end
        }
      } catch (err) {
        setError(err.message)
      } finally {
        finalizeLastAssistantMessage()
        setIsStreaming(false)
      }
    },
    [isStreaming, sessionId]
  )

  const clearChat = useCallback(async () => {
    await deleteSession(sessionId)
    setMessages([])
    setError(null)
  }, [sessionId])

  return { messages, isStreaming, error, sendMessage, clearChat, sessionId }
}
