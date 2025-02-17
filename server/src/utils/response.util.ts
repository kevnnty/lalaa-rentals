export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  timestamp?: string;
}

export const successResponse = <T>({ message, data }: { message: string; data?: T }): ApiResponse<T> => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};

export const errorResponse = <T>({ message, error }: { message: string; error?: any }): ApiResponse<T> => {
  return {
    success: false,
    message,
    error,
    timestamp: new Date().toISOString(),
  };
};
