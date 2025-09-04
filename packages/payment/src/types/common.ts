export interface AppConfig {
  theme: 'light' | 'dark';
  hideHeader: boolean;
  hideFooter: boolean;
  customerId: string;
  embedMode: boolean;
}

export interface PageProps {
  sdk: any;
  config?: AppConfig;
}

export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  title: string;
  icon?: string;
  protected?: boolean;
  hideInNav?: boolean;
}

export interface NavigationItem {
  path: string;
  label: string;
  icon: string;
  active?: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string | number;
}

export interface FormState<T> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClose?: () => void;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface URLParams {
  apiKey?: string;
  customerId?: string;
  embed?: string;
  theme?: string;
  hideHeader?: string;
  hideFooter?: string;
  currency?: string;
  lang?: string;
  security?: string;
  baseURL?: string;
  token?: string;
  origin?: string;
  [key: string]: string | undefined;
}
