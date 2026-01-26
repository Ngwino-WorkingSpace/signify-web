import { ArrowLeft, Bell, ClipboardList, AlertCircle, Heart } from 'lucide-react';

interface NotificationsProps {
  onBack: () => void;
}

const notifications = [
  {
    id: 1,
    type: 'survey',
    title: 'New Health Survey',
    message: 'A new health survey is available. Takes less than 2 minutes.',
    time: '10 minutes ago',
    unread: true,
  },
  {
    id: 2,
    type: 'alert',
    title: 'Community Health Update',
    message: 'Increased respiratory symptoms reported in your area. Take precautions.',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 3,
    type: 'info',
    title: 'Thank You',
    message: 'Your last survey response was received. Thank you for helping your community.',
    time: '1 day ago',
    unread: false,
  },
];

export function Notifications({ onBack }: NotificationsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'survey':
        return <ClipboardList className="w-6 h-6 text-white" />;
      case 'alert':
        return <AlertCircle className="w-6 h-6 text-white" />;
      case 'info':
        return <Heart className="w-6 h-6 text-white" fill="white" />;
      default:
        return <Bell className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div className="min-h-[600px] px-6 py-8">
    
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#18392b]" />
        </button>
        <h1 className="text-2xl font-bold text-[#18392b]">Notifications</h1>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-2xl p-5 transition-all ${
              notification.unread
                ? 'bg-[#18392b]/5 border-2 border-[#18392b]/20'
                : 'bg-gray-50 border-2 border-transparent'
            }`}
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#18392b] flex items-center justify-center">
                  {getIcon(notification.type)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {notification.title}
                  </h3>
                  {notification.unread && (
                    <div className="w-3 h-3 rounded-full bg-[#18392b] flex-shrink-0 ml-2"></div>
                  )}
                </div>
                <p className="text-gray-700 text-base leading-relaxed mb-2">
                  {notification.message}
                </p>
                <p className="text-sm text-gray-500">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>


      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Bell className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-xl text-gray-600">No notifications yet</p>
        </div>
      )}
    </div>
  );
}
