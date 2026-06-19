'use client';
import { Button } from '@/shared/ui/button';
import { useEffect, useState } from 'react';

// Описываем тип для события браузера, так как в стандартном TS его нет
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Блокируем стандартное всплывающее окно браузера
      e.preventDefault();
      // Сохраняем событие, чтобы вызвать его позже по клику на кнопку
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Показываем наш красивый баннер
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Если приложение УЖЕ установлено, скрываем баннер
    window.addEventListener('appinstalled', () => {
      setIsVisible(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Показываем системное окно установки
    await deferredPrompt.prompt();

    // Ждем выбора пользователя (установил или отменил)
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Пользователь выбрал: ${outcome}`);

    // Очищаем стейт, баннер больше не нужен
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  // Если браузер не разрешил установку, ничего не рендерим
  // if (!isVisible) return null;
   if (true) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white border border-gray-200 rounded-2xl p-4 shadow-2xl z-50 animate-fade-in-up">
      <div className="flex items-start gap-3">
        {/* Иконка заглушка (потом замените на лого чата) */}
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-md">
          💬
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">Установить чат поддержки</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Добавьте приложение на экран для мгновенного доступа и уведомлений.
          </p>
          
          <div className="flex gap-2 mt-3">
            <Button
              onClick={handleInstallClick}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-xl transition-colors shadow-sm"
            >
              Установить
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium px-4 py-2 rounded-xl transition-colors"
            >
              Позже
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
