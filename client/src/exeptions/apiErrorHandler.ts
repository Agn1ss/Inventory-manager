import i18n from "../providers/language/i18";

export default class ApiErrorHandler {
  static ERROR_NORMALIZERS = {
    default: this.normalizeMessage,
    login: this.normalizeLoginError,
    registration: this.normalizeRegisterError,
    profile: this.normalizeProfileError,
  };

  static handle(
    error: any,
    type: keyof typeof this.ERROR_NORMALIZERS = "default"
  ): string {
    const message = error?.response?.data?.message || "Unknown error";
    const normalizer = this.ERROR_NORMALIZERS[type] || this.normalizeMessage;
    return normalizer.call(this, message);
  }

  static normalizeMessage(message?: string, fallbackKey: string = "unknown_error"): string {
    if (!message) return i18n.t(`errors.${fallbackKey}`);
    return i18n.exists(`errors.${message}`)
      ? i18n.t(`errors.${message}`)
      : i18n.t(`errors.${fallbackKey}`);
  }

  private static normalizeByMap(
    message: string,
    map: Record<string, string>,
    fallbackKey: string
  ): string {
    const key = map[message];
    return i18n.t(`errors.${key || fallbackKey}`);
  }

  static normalizeLoginError(message: string): string {
    const map: Record<string, string> = {
      "No user with this name was found": "no_user",
      "Incorrect name or email": "incorrect_credentials",
      "This user is blocked": "blocked",
      "Incorrect password": "incorrect_password",
    };
    const key = map[message] || "login_error";
    return i18n.t(`errors.${key}`);
  }

  static normalizeRegisterError(message: string): string {
    const map: Record<string, string> = {
      "This name is already in use": "name_exists",
      "This email is already in use": "email_exists",
      "Password too short": "password_short",
    };
    const key = map[message] || "register_error";
    return i18n.t(`errors.${key}`);
  }

  static normalizeProfileError(message: string): string {
    return this.normalizeByMap(
      message,
      {
        Unauthorized: "unauthorized",
        "Invalid token": "invalid_token",
        "User not found": "no_user",
      },
      "profile_error"
    );
  }
}