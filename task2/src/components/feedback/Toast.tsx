export interface ToastMessage {
  id: string;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface Props {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export default function Toast({ toast, onDismiss }: Props) {
  if (!toast) return null;

  return (
    <div className="toast" role="status" aria-live="polite">
      <span className="toast__message">{toast.text}</span>
      <div className="toast__actions">
        {toast.actionLabel && toast.onAction && (
          <button
            type="button"
            className="toast__action-btn"
            onClick={() => {
              toast.onAction?.();
              onDismiss();
            }}
          >
            {toast.actionLabel}
          </button>
        )}
        <button
          type="button"
          className="toast__close-btn"
          onClick={onDismiss}
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}
