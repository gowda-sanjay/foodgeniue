/**
 * Socket.IO Client Service
 * Handles real-time communication with the backend
 * 
 * Note: Requires 'socket.io-client' to be installed
 * Install with: npm install socket.io-client
 */

import type { Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

interface SocketEvents {
  // Connection events
  'connect': void;
  'disconnect': void;
  'connect_error': Error;

  // Order events
  'order:created': { orderId: string };
  'order:status_changed': { orderId: string; status: string; message: string };
  'order:delivery_update': {
    orderId: string;
    latitude: number;
    longitude: number;
    eta: number;
  };

  // Notification events
  'notification:new': {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
  };

  // Chat events (for AI support)
  'chat:message': { message: string; sender: 'user' | 'assistant'; timestamp: number };
  'chat:typing': { isTyping: boolean };

  // Admin events
  'admin:order_update': { orderId: string; status: string };
}

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private io: any = null;

  /**
   * Initialize socket connection
   */
  async connect(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // Lazy load socket.io-client
        if (!this.io) {
          const { io: socketIO } = await import('socket.io-client');
          this.io = socketIO;
        }

        const token = localStorage.getItem('auth_token');

        this.socket = this.io(SOCKET_URL, {
          auth: token ? { token } : undefined,
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
          transports: ['websocket', 'polling'],
        });

        this.socket!.on('connect', () => {
          console.log('Socket connected:', this.socket?.id);
          this.emitLocal('connect', undefined);
          resolve();
        });

        this.socket!.on('disconnect', () => {
          console.log('Socket disconnected');
          this.emitLocal('disconnect', undefined);
        });

        this.socket!.on('connect_error', (error: Error) => {
          console.error('Socket connection error:', error);
          this.emitLocal('connect_error', error);
          reject(error);
        });

        // Listen to all defined events
        this.socket!.on('order:created', (data) => this.emitLocal('order:created', data));
        this.socket!.on('order:status_changed', (data) =>
          this.emitLocal('order:status_changed', data)
        );
        this.socket!.on('order:delivery_update', (data) =>
          this.emitLocal('order:delivery_update', data)
        );
        this.socket!.on('notification:new', (data) =>
          this.emitLocal('notification:new', data)
        );
        this.socket!.on('chat:message', (data) => this.emitLocal('chat:message', data));
        this.socket!.on('chat:typing', (data) => this.emitLocal('chat:typing', data));
        this.socket!.on('admin:order_update', (data) =>
          this.emitLocal('admin:order_update', data)
        );
      } catch (error) {
        console.error('Failed to initialize socket:', error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect socket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  /**
   * Join a room
   */
  joinRoom(room: string): void {
    if (this.socket) {
      this.socket.emit('join_room', room);
    }
  }

  /**
   * Leave a room
   */
  leaveRoom(room: string): void {
    if (this.socket) {
      this.socket.emit('leave_room', room);
    }
  }

  /**
   * Subscribe to events
   */
  on<K extends keyof SocketEvents>(
    event: K,
    callback: (data: SocketEvents[K]) => void
  ): void {
    if (!this.listeners.has(event as string)) {
      this.listeners.set(event as string, []);
    }
    this.listeners.get(event as string)!.push(callback);
  }

  /**
   * Unsubscribe from events
   */
  off<K extends keyof SocketEvents>(
    event: K,
    callback?: (data: SocketEvents[K]) => void
  ): void {
    if (!callback) {
      this.listeners.delete(event as string);
      return;
    }

    const callbacks = this.listeners.get(event as string);
    if (callbacks) {
      const index = callbacks.indexOf(callback as Function);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Emit events (internal)
   */
  private emitLocal<K extends keyof SocketEvents>(
    event: K,
    data?: SocketEvents[K]
  ): void {
    const callbacks = this.listeners.get(event as string);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  /**
   * Track order in real-time
   */
  trackOrder(orderId: string): void {
    this.joinRoom(`order:${orderId}`);
  }

  /**
   * Stop tracking order
   */
  stopTrackingOrder(orderId: string): void {
    this.leaveRoom(`order:${orderId}`);
  }

  /**
   * Subscribe to order updates
   */
  onOrderUpdate(orderId: string, callback: (update: any) => void): void {
    const handleUpdate = (data: any) => {
      if (data.orderId === orderId) {
        callback(data);
      }
    };
    this.on('order:status_changed', handleUpdate as any);
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Get socket ID
   */
  getSocketId(): string | undefined {
    return this.socket?.id;
  }

  /**
   * Emit custom message (for chat, etc)
   */
  emit<T = any>(event: string, data?: T): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  /**
   * Listen to custom message
   */
  onCustom<T = any>(event: string, callback: (data: T) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }
}

// Export singleton instance
export const socketService = new SocketService();

// Export for convenience
export const useSocket = () => socketService;
