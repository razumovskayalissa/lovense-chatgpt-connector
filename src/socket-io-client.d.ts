declare module "socket.io-client" {
  interface SocketOptions {
    path?: string;
    transports?: string[];
    reconnection?: boolean;
    reconnectionDelay?: number;
    reconnectionDelayMax?: number;
  }

  interface Socket {
    connected: boolean;
    on(event: string, listener: (...args: any[]) => void): this;
    emit(event: string, ...args: any[]): this;
    removeListener(event: string, listener: (...args: any[]) => void): this;
    close(): void;
  }

  export default function io(uri: string, options?: SocketOptions): Socket;
}
