import { Message } from '@/features/messages/messages'
import settingsStore from '@/features/stores/settings'
import {
  getBestComment,
  getMessagesForSleep,
  getAnotherTopic,
  getMessagesForNewTopic,
  checkIfResponseContinuationIsRequired,
  getMessagesForContinuation,
} from '@/features/youtube/conversationContinuityFunctions'
import { processAIResponse } from '../chat/handlers'
import homeStore from '@/features/stores/home'
import { messageSelectors } from '../messages/messageSelectors'

export type TwitchComment = {
  userName: string
  userComment: string
  userId?: string
  userColor?: string
}

type TwitchComments = TwitchComment[]

let commentBuffer: TwitchComments = []
let lastProcessTime = Date.now()

export const addCommentToBuffer = (comment: TwitchComment): void => {
  commentBuffer.push(comment)
}

export const getAndClearCommentBuffer = (): TwitchComments => {
  const comments = [...commentBuffer]
  commentBuffer = []
  lastProcessTime = Date.now()
  return comments
}

export const fetchAndProcessComments = async (
  handleSendChat: (text: string) => void
): Promise<void> => {
  const ss = settingsStore.getState()
  const hs = homeStore.getState()
  const chatLog = messageSelectors.getTextAndImageMessages(hs.chatLog)

  try {
    // 会話の継続が必要かどうかを確認
    if (
      !ss.twitchSleepMode &&
      ss.twitchContinuationCount < 1 &&
      ss.conversationContinuityMode
    ) {
      const isContinuationNeeded =
        await checkIfResponseContinuationIsRequired(chatLog)
      if (isContinuationNeeded) {
        const continuationMessage = await getMessagesForContinuation(
          ss.systemPrompt,
          chatLog
        )
        processAIResponse(continuationMessage)
        settingsStore.setState({
          twitchContinuationCount: ss.twitchContinuationCount + 1,
        })
        if (ss.twitchNoCommentCount < 1) {
          settingsStore.setState({ twitchNoCommentCount: 1 })
        }
        return
      }
    }
    settingsStore.setState({ twitchContinuationCount: 0 })

    // コメントを取得
    const twitchComments = getAndClearCommentBuffer()

    // ランダムなコメントを選択して送信
    if (twitchComments.length > 0) {
      settingsStore.setState({ twitchNoCommentCount: 0 })
      settingsStore.setState({ twitchSleepMode: false })
      let selectedComment = ''
      if (ss.conversationContinuityMode) {
        selectedComment = await getBestComment(chatLog, twitchComments)
      } else {
        selectedComment =
          twitchComments[Math.floor(Math.random() * twitchComments.length)]
            .userComment
      }
      console.log('selectedTwitchComment:', selectedComment)

      handleSendChat(selectedComment)
    } else {
      const noCommentCount = ss.twitchNoCommentCount + 1
      if (ss.conversationContinuityMode) {
        if (noCommentCount < 3 || (3 < noCommentCount && noCommentCount < 6)) {
          // 会話の続きを生成
          const continuationMessage = await getMessagesForContinuation(
            ss.systemPrompt,
            chatLog
          )
          processAIResponse(continuationMessage)
        } else if (noCommentCount === 3) {
          // 新しいトピックを生成
          const anotherTopic = await getAnotherTopic(chatLog)
          console.log('anotherTopic:', anotherTopic)
          const newTopicMessage = await getMessagesForNewTopic(
            ss.systemPrompt,
            chatLog,
            anotherTopic
          )
          processAIResponse(newTopicMessage)
        } else if (noCommentCount === 6) {
          // スリープモードにする
          const messagesForSleep = await getMessagesForSleep(
            ss.systemPrompt,
            chatLog
          )
          processAIResponse(messagesForSleep)
          settingsStore.setState({ twitchSleepMode: true })
        }
      }
      console.log('TwitchNoCommentCount:', noCommentCount)
      settingsStore.setState({ twitchNoCommentCount: noCommentCount })
    }
  } catch (error) {
    console.error('Error processing Twitch comments:', error)
  }
}
