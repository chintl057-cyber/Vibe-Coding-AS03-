import axios from 'axios';

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Please check the information you entered and try again.',
  401: 'Your email or password is incorrect.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested information could not be found.',
  409: 'This information already exists.',
  422: 'Please check the highlighted information and try again.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'Something went wrong on our side. Please try again later.',
  502: 'The service is temporarily unavailable. Please try again later.',
  503: 'The service is temporarily unavailable. Please try again later.',
};

const getDetailMessage = (detail: unknown): string | undefined => {
  if (typeof detail === 'string' && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail)) {
    const firstMessage = detail.find(
      (item) => item && typeof item === 'object' && typeof item.msg === 'string',
    )?.msg;
    return firstMessage;
  }

  return undefined;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error && error.message ? error.message : fallback;
  }

  if (!error.response) {
    return 'We could not connect to the service. Check your internet connection and try again.';
  }

  const detail = getDetailMessage(error.response.data?.detail);
  return detail || STATUS_MESSAGES[error.response.status] || fallback;
};
