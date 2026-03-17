import React, { useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';

export const ToastContainer: React.FC = () => {
    const { notifications, removeNotification } = useNotification();

    return (
        <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-3">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`
                        px-6 py-4 rounded-lg shadow-lg text-white font-semibold
                        animate-slide-in-up
                        ${notification.type === 'success' ? 'bg-green-500' : ''}
                        ${notification.type === 'error' ? 'bg-red-500' : ''}
                        ${notification.type === 'info' ? 'bg-blue-500' : ''}
                    `}
                >
                    <div className="flex items-center justify-between gap-4">
                        <span>{notification.message}</span>
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className="text-white hover:opacity-75 font-bold"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
