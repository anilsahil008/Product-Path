import type { Message } from '../services/chatApi'

interface Props {
  message: Message
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>

      {/* Assistant avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold mr-3 mt-1 select-none">
          PP
        </div>
      )}

      <div
        className={[
          'max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words',
          isUser
            ? 'bg-indigo-600 text-white rounded-br-sm'
            : 'bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-bl-sm',
        ].join(' ')}
      >
        {message.content || (message.streaming ? '\u00A0' : '')}

        {message.streaming && (
          <span className="inline-block w-[2px] h-4 ml-0.5 bg-current opacity-70 animate-pulse align-text-bottom" />
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold ml-3 mt-1 select-none">
          You
        </div>
      )}
    </div>
  )
}
