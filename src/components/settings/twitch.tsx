import { useTranslation } from 'react-i18next'
import Image from 'next/image'

import homeStore from '@/features/stores/home'
import menuStore from '@/features/stores/menu'
import settingsStore from '@/features/stores/settings'
import slideStore from '@/features/stores/slide'
import { TextButton } from '../textButton'
import { isMultiModalAvailable } from '@/features/constants/aiModels'

const Twitch = () => {
  const twitchMode = settingsStore((s) => s.twitchMode)
  const twitchChannel = settingsStore((s) => s.twitchChannel)
  const externalLinkageMode = settingsStore((s) => s.externalLinkageMode)
  const selectAIService = settingsStore((s) => s.selectAIService)
  const selectAIModel = settingsStore((s) => s.selectAIModel)
  const enableMultiModal = settingsStore((s) => s.enableMultiModal)
  const multiModalMode = settingsStore((s) => s.multiModalMode)
  const customModel = settingsStore((s) => s.customModel)

  const conversationContinuityMode = settingsStore(
    (s) => s.conversationContinuityMode
  )
  const slideMode = settingsStore((s) => s.slideMode)

  const { t } = useTranslation()

  const handleChangeTwitchMode = (twitchMode: boolean) => {
    settingsStore.setState({ twitchMode })

    if (twitchMode) {
      homeStore.setState({ modalImage: '' })
      menuStore.setState({ showWebcam: false })
      settingsStore.setState({ slideMode: false })
      slideStore.setState({ isPlaying: false })
    } else {
      settingsStore.setState({ twitchPlaying: false })
    }
  }

  return (
    <>
      <div className="flex items-center mb-6">
        <Image
          src="/images/setting-icons/twitch-settings.svg"
          alt="Twitch Settings"
          width={24}
          height={24}
          className="mr-2"
        />
        <h2 className="text-2xl font-bold">{t('TwitchSettings')}</h2>
      </div>
      <div className="mb-4 text-xl font-bold">{t('TwitchMode')}</div>
      <div className="my-2">
        {twitchMode ? (
          <TextButton onClick={() => handleChangeTwitchMode(false)}>
            {t('StatusOn')}
          </TextButton>
        ) : (
          <TextButton onClick={() => handleChangeTwitchMode(true)}>
            {t('StatusOff')}
          </TextButton>
        )}
      </div>
      <div className="mt-4">
        {twitchMode && (
          <>
            <div className="">{t('TwitchInfo')}</div>
            <div className="my-4 text-xl font-bold">{t('TwitchChannel')}</div>
            <input
              className="text-ellipsis px-4 py-2 w-col-span-2 bg-white hover:bg-white-hover rounded-lg"
              type="text"
              placeholder="channel_name"
              value={twitchChannel}
              onChange={(e) =>
                settingsStore.setState({
                  twitchChannel: e.target.value,
                })
              }
            />
            <div className="mt-6">
              <div className="my-4 text-xl font-bold">
                {t('ConversationContinuityMode')}
              </div>
              <div className="my-2">{t('ConversationContinuityModeInfo')}</div>
              <div className="my-2">
                {t('ConversationContinuityModeInfo2')}
              </div>
              <div className="mb-4">
                {t('ConversationContinuityModeInfo3')}
              </div>
              <TextButton
                onClick={() =>
                  settingsStore.setState({
                    conversationContinuityMode: !conversationContinuityMode,
                  })
                }
                disabled={
                  !isMultiModalAvailable(
                    selectAIService,
                    selectAIModel,
                    enableMultiModal,
                    multiModalMode,
                    customModel
                  ) ||
                  slideMode ||
                  externalLinkageMode
                }
              >
                {t(conversationContinuityMode ? 'StatusOn' : 'StatusOff')}
              </TextButton>
            </div>
          </>
        )}
      </div>
    </>
  )
}
export default Twitch
