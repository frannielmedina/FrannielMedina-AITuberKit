import { useCallback, useEffect, useRef } from 'react'
import homeStore from '@/features/stores/home'
import settingsStore from '@/features/stores/settings'
import {
  fetchAndProcessComments,
  addCommentToBuffer,
  TwitchComment,
} from '@/features/twitch/twitchComments'
// CORRECCIÓN 1: Importar la clase 'Client' para usarla como tipo.
import TmiClient, { Client } from 'tmi.js' 

const INTERVAL_MILL_SECONDS_RETRIEVING_COMMENTS = 10000 // 10秒

interface Params {
  handleSendChat: (text: string) => Promise<void>
}

const useTwitch = ({ handleSendChat }: Params) => {
  const twitchPlaying = settingsStore((s) => s.twitchPlaying)
  const twitchChannel = settingsStore((s) => s.twitchChannel)
  // CORRECCIÓN 2: Usar 'Client' (la clase importada) como tipo.
  const clientRef = useRef<Client | null>(null) 

  const connectToTwitch = useCallback(() => {
    const ss = settingsStore.getState()

    if (!ss.twitchChannel || !ss.twitchMode) {
      return
    }

    const channelName = ss.twitchChannel.startsWith('#')
      ? ss.twitchChannel
      : `#${ss.twitchChannel}`

    const client = new TmiClient({
      options: {
        debug: false,
      },
      connection: {
        reconnect: true,
        secure: true,
      },
      channels: [channelName],
    })

    client.on('message', (channel, tags, message, self) => {
      if (self || !message.trim() || message.startsWith('#')) return

      const comment: TwitchComment = {
        userName: tags['display-name'] || tags.username || 'Anonymous',
        userComment: message.trim(),
        userId: tags['user-id'],
        userColor: tags.color,
      }

      console.log(`[Twitch] ${comment.userName}: ${comment.userComment}`)
      addCommentToBuffer(comment)
    })

    client.on('connected', (address, port) => {
      console.log(`[Twitch] Connected to ${address}:${port}`)
    })

    client.on('disconnected', (reason) => {
      console.log(`[Twitch] Disconnected: ${reason}`)
    })

    client.on('error', (err) => {
      console.error('[Twitch] Error:', err)
    })

    client
      .connect()
      .catch((err) => console.error('[Twitch] Connection error:', err))

    clientRef.current = client
  }, [])

  const disconnectFromTwitch = useCallback(() => {
    if (clientRef.current) {
      clientRef.current
        .disconnect()
        .catch((err) => console.error('[Twitch] Disconnect error:', err))
      clientRef.current = null
    }
  }, [])

  const fetchAndProcessCommentsCallback = useCallback(async () => {
    const ss = settingsStore.getState()
    const hs = homeStore.getState()

    if (
      !ss.twitchChannel ||
      hs.chatProcessing ||
      hs.chatProcessingCount > 0 ||
      !ss.twitchMode ||
      !ss.twitchPlaying
    ) {
      return
    }

    console.log('Call fetchAndProcessComments (Twitch) !!!')
    await fetchAndProcessComments(handleSendChat)
  }, [handleSendChat])

  useEffect(() => {
    if (!twitchPlaying) {
      disconnectFromTwitch()
      return
    }

    connectToTwitch()
    fetchAndProcessCommentsCallback()

    const intervalId = setInterval(() => {
      fetchAndProcessCommentsCallback()
    }, INTERVAL_MILL_SECONDS_RETRIEVING_COMMENTS)

    return () => {
      clearInterval(intervalId)
      disconnectFromTwitch()
    }
  }, [
    twitchPlaying,
    twitchChannel,
    fetchAndProcessCommentsCallback,
    connectToTwitch,
    disconnectFromTwitch,
  ])
}

export default useTwitch
