import { FC } from 'react'
import useTwitch from './useTwitch'
import { handleSendChatFn } from '@/features/chat/handlers'

export const TwitchManager: FC = () => {
  const handleSendChat = handleSendChatFn()

  useTwitch({ handleSendChat })

  return null
}
