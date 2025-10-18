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
    id?: string
    mod?: boolean
    'room-id'?: string
    subscriber?: boolean
    'tmi-sent-ts'?: string
    turbo?: boolean
    'user-id'?: string
    'user-type'?: 'mod' | 'global_mod' | 'admin' | 'staff' | ''
    username?: string
    [key: string]: any
  }

  export interface Options {
    options?: {
      debug?: boolean
      messagesLogLevel?: string
      clientId?: string
    }
    connection?: {
      server?: string
      port?: number
      reconnect?: boolean
      maxReconnectAttempts?: number
      maxReconnectInterval?: number
      reconnectDecay?: number
      reconnectInterval?: number
      secure?: boolean
      timeout?: number
    }
    identity?: {
      username?: string
      password?: string
    }
    channels?: string[]
    logger?: any
  }

  export class Client {
    constructor(options?: Options)

    on(
      event: 'message',
      listener: (
        channel: string,
        tags: ChatUserstate,
        message: string,
        self: boolean
      ) => void
    ): this

    on(
      event: 'connected',
      listener: (address: string, port: number) => void
    ): this

    on(event: 'disconnected', listener: (reason: string) => void): this

    on(event: 'error', listener: (error: Error) => void): this

    on(event: string, listener: (...args: any[]) => void): this

    connect(): Promise<[string, number]>
    disconnect(): Promise<[string, number]>
    say(channel: string, message: string): Promise<[string]>
    join(channel: string): Promise<[string]>
    part(channel: string): Promise<[string]>

    getChannels(): string[]
    getUsername(): string
    isMod(channel: string, username: string): boolean
    readyState(): string
  }

  namespace tmi {
    export { Client, ChatUserstate, Options }
  }

  export default tmi
}
