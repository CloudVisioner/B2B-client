import React, { useEffect } from 'react';

interface NotificationToastProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  duration = 5000,
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const typeConfig = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      icon: 'check_circle',
      titleColor: 'text-emerald-900',
      messageColor: 'text-emerald-700',
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      icon: 'cancel',
      titleColor: 'text-red-900',
      messageColor: 'text-red-700',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      icon: 'warning',
      titleColor: 'text-amber-900',
      messageColor: 'text-amber-700',
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      icon: 'info',
      titleColor: 'text-blue-900',
      messageColor: 'text-blue-700',
    },
  };

  const config = typeConfig[type];

  return (
    <div className="fixed top-4 right-4 z-[10000] animate-in slide-in-from-top-5 fade-in duration-300">
      <div
        className={`${config.bg} border-2 rounded-xl shadow-2xl p-5 max-w-md min-w-[320px] backdrop-blur-sm`}
        style={{
          boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="flex items-start gap-4">
          {/* Premium Icon */}
          <div className={`${config.iconBg} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
            <span className={`material-symbols-outlined text-2xl ${config.iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>
              {config.icon}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className={`text-base font-bold ${config.titleColor} mb-1`}>{title}</h4>
            <p className={`text-sm ${config.messageColor} leading-relaxed`}>{message}</p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-white/50 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-slate-400 text-lg">close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
