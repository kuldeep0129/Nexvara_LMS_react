import Icon from '../ui/Icon.jsx';

export default function ApiError({
  title = 'Something went wrong',
  message = 'We could not load the data. Please try again.',
  onRetry,
  retryText = 'Try again',
}) {
  return (
    <div className="ppv-error-wrap">
      <div className="ppv-error-card" role="alert">
        <div className="ppv-error-icon" aria-hidden="true">
          <span>!</span>
        </div>

        <span className="ppv-error-eyebrow">
          CONNECTION INTERRUPTED
        </span>

        <h3>{title}</h3>
        <p>{message}</p>

        {onRetry && (
          <button
            type="button"
            className="ppv-retry"
            onClick={onRetry}
          >
            <span className="ppv-retry-icon" aria-hidden="true">
              ↻
            </span>
            {retryText}
          </button>
        )}

        <span className="ppv-error-note">
          Please try again in a moment.
        </span>
      </div>
    </div>
  );
}