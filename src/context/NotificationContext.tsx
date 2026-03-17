import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

export interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
}

interface NotificationContextType {
    notifications: Notification[];
    showNotification: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void;
    removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const showNotification = useCallback((
        message: string,
        type: 'success' | 'error' | 'info' = 'success',
        duration: number = 3000
    ) => {
        const id = Date.now().toString();
        const newNotification: Notification = { id, message, type, duration };
        
        setNotifications(prev => [...prev, newNotification]);

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, showNotification, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
