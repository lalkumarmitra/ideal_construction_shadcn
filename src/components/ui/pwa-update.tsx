// src/components/ui/pwa-update.tsx
import { useEffect, useState } from 'react';
import { Toast, ToastAction, ToastDescription, ToastTitle } from '@/components/ui/toast';
import { RefreshCw } from 'lucide-react';

interface PwaUpdateProps {
  onUpdate: () => void;
}

export function PwaUpdate({ onUpdate }: PwaUpdateProps) {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  useEffect(() => {
    // Register an event listener to detect service worker updates
    window.addEventListener('sw-update-available', () => {
      setShowUpdatePrompt(true);
    });

    return () => {
      window.removeEventListener('sw-update-available', () => {
        setShowUpdatePrompt(true);
      });
    };
  }, []);

  if (!showUpdatePrompt) return null;

  return (
    <Toast
      open={showUpdatePrompt}
      onOpenChange={setShowUpdatePrompt}
      className="fixed bottom-4 right-4"
    >
      <div className="flex items-start gap-2">
        <RefreshCw className="h-4 w-4 text-primary mt-0.5" />
        <div>
          <ToastTitle>Update available</ToastTitle>
          <ToastDescription>
            A new version of the app is available. Click update to refresh.
          </ToastDescription>
        </div>
      </div>
      <ToastAction altText="Update" onClick={onUpdate}>
        Update
      </ToastAction>
    </Toast>
  );
}