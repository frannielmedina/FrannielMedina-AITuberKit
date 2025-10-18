declare module 'tmi.js' {
  export interface ChatUserstate {
    'badge-info'?: string
    'badge-info-raw'?: string
    badges?: { [key: string]: string }
    'badges-raw'?: string
    color?: string
    'display-name'?: string
    emotes?: { [key: string]: string[] }
    'emotes-raw'?: string
    flags?: string
    id?: string
    mod?: boolean
    'room-id'?: string
    subscriber?: boolean
    'tmi-sent-ts'?: string
    turbo?: boolean
    'user-id'?: string
    'user-type'?: '' | 'mod' | 'global_mod' | 'admin' | 'staff'
    username?: string
    'message-type'?: 'chat' | 'action' | 'whisper'
  }

  export interface Options {
    options?: {
      debug?: boolean
      messagesLogLevel?: 'info' | 'warn' | 'error'
      clientId?: string
    }
    connection?: {
      reconnect?: boolean
      secure?: boolean
      timeout?: number
      reconnectDecay?: number
      reconnectInterval?: number
    }
    identity?: {
      username?: string
      password?: string
    }
    channels?: string[]
  }

  export interface Events {
    connecting: (address: string, port: number) => void
    connected: (address: string, port: number) => void
    disconnected: (reason: string) => void
    reconnect: () => void
    logon: () => void
    message: (
      channel: string,
      userstate: ChatUserstate,
      message: string,
      self: boolean
    ) => void
    chat: (
      channel: string,
      userstate: ChatUserstate,
      message: string,
      self: boolean
    ) => void
    error: (err: Error) => void
  }

  export class Client {
    constructor(options?: Options)
    on<K extends keyof Events>(event: K, listener: Events[K]): this
    connect(): Promise<[string, number]>
    disconnect(): Promise<[string, number]>
    say(channel: string, message: string): Promise<[string]>
    getChannels(): string[]
    getOptions(): Options
    getUsername(): string
    isMod(channel: string, username: string): boolean
    readyState(): string
  }

  const tmi: {
    Client: typeof Client
  }

  export default tmi
}
