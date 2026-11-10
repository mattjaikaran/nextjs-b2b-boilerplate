export interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
}

export interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface NotificationsState {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  taskReminders: boolean;
}

export type SettingsTab =
  | 'account'
  | 'notifications'
  | 'privacy'
  | 'team'
  | 'billing'
  | 'api-keys';
