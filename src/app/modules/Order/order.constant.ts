export const PaymentStatusArray = ['pending', 'paid', 'failed'];

export const searchAbleField = ['paymentStatus', 'orderStatus'];

export const orderStatusArray = ['processing', 'completed', 'cancelled'];

export const orderStatusObject = {
  processing: 'processing',
  completed: 'completed',
  cancelled: 'cancelled',
} as const;
