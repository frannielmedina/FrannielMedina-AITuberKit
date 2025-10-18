import { useTranslation } from 'react-i18next'
import Image from 'next/image'

const Description = () => {
  const { t } = useTranslation()

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center mb-6">
          <Image
            src="/images/setting-icons/description.svg"
            alt="Description Settings"
            width={24}
            height={24}
            className="mr-2"
          />
          <h2 className="text-2xl font-bold">{t('AboutThisApplication')}</h2>
        </div>

        <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
          <Image
            src="/franniellogo.png"
            alt="Franniel Logo"
            width={50}
            height={50}
            className="mr-3"
          />
          <div>
            <div className="font-bold text-xl">AiTuberKit</div>
            <div className="text-sm text-gray-600">
              Modded by Franniel Medina
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="my-2 whitespace-pre-line">
            This is a fork of the original ChatVRM (
            <a
              href="https://github.com/pixiv/ChatVRM"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline transition-all duration-300 ease-in-out"
            >
              https://github.com/pixiv/ChatVRM
            </a>
            ) and the original AiTuberKit (
            <a
              href="https://github.com/tegnike/aituber-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline transition-all duration-300 ease-in-out"
            >
              https://github.com/tegnike/aituber-kit
            </a>
            ) to improve Twitch integration.
          </div>
        </div>

        <div className="my-10">
          <div className="mb-4 text-xl font-bold">Modded By</div>
          <div className="my-2 whitespace-pre-line">Franniel Medina</div>
          <div className="my-2 whitespace-pre-line text-sm text-gray-600">
            ©2025 Franniel Medina - All rights reserved
          </div>
          <div className="my-2 whitespace-pre-line">
            <a
              href="https://beacons.ai/frannielmedinatv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-800 hover:underline transition-all duration-300 ease-in-out"
            >
              beacons.ai/frannielmedinatv
            </a>
          </div>
        </div>

        <div className="my-10">
          <div className="mb-4 text-xl font-bold">{t('Contact')}</div>
          <div className="my-2 whitespace-pre-line">
            <a
              href="mailto:support@aituberkit.com"
              className="text-black hover:text-gray-800 hover:underline transition-all duration-300 ease-in-out"
            >
              Email: support@aituberkit.com
            </a>
          </div>
          <div className="my-2 whitespace-pre-line">
            <a
              href="https://twitter.com/tegnike"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-800 hover:underline transition-all duration-300 ease-in-out"
            >
              Twitter: @tegnike
            </a>
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-4 text-xl font-bold">{t('Creator')}</div>
          <div className="my-2 whitespace-pre-line">
            {t('CreatorDescription')}
          </div>
          <div className="my-2 whitespace-pre-line">
            <a
              href="https://nikechan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-800 hover:underline transition-all duration-300 ease-in-out"
            >
              URL: https://nikechan.com
            </a>
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-4 text-xl font-bold">{t('Documentation')}</div>
          <div className="my-2 whitespace-pre-line">
            {t('DocumentationDescription')}
          </div>
          <div className="my-2 whitespace-pre-line">
            <a
              href="https://docs.aituberkit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-800 hover:underline transition-all duration-300 ease-in-out"
            >
              https://docs.aituberkit.com/
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
export default Description
