import i18n from "../providers/language/i18";

export default class ApiErrorHandler {
  static ERROR_NORMALIZERS = {
    default: this.normalizeMessage,
    login: this.normalizeLoginError,
    registration: this.normalizeRegisterError,
    profile: this.normalizeProfileError,
    middleware: this.normalizeMiddlewareError,
    customField: this.normalizeCustomFieldError,
  };

  static handle(
    error: any,
    type?: keyof typeof this.ERROR_NORMALIZERS
  ): string {
    let message: string = "Unknown error";

    if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.message) {
      message = error.message;
    }

    const middlewareMessage = this.normalizeMiddlewareError(message);

    if (middlewareMessage !== i18n.t("errors.unknown_error")) {
      return middlewareMessage;
    }

    const normalizer = type
      ? this.ERROR_NORMALIZERS[type] || this.normalizeMessage
      : this.normalizeMessage;

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

  static normalizeCustomFieldError(message: string): string {
    const map: Record<string, string> = {
      "Cannot add more than 3 fields": "custom_field_limit",
      "Invalid field type": "custom_field_invalid_type",
      "Missing required field": "custom_field_missing",
    };

    const matchedKey = Object.keys(map).find((key) => message.includes(key));
    const translationKey = matchedKey ? map[matchedKey] : "custom_field_error";
    return i18n.t(`errors.${translationKey}`);
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

  static normalizeMiddlewareError(message: string): string {
    const map: Record<string, string> = {
      "Unauthorized": "unauthorized",
      "Invalid token": "invalid_token",
      "Access denied": "access_denied",
      "You do not have permission to access this resource": "no_permission",
      "This user is blocked": "user_blocked",
      "You do not have access to this inventory": "no_inventory_access",
      "Inventory with id": "inventory_not_found",
      "Forbidden": "forbidden",
      "Not found": "not_found",
    };

    const matchedKey = Object.keys(map).find((key) => message.includes(key));
    const translationKey = matchedKey ? map[matchedKey] : "unknown_error";
    return i18n.t(`errors.${translationKey}`);
  }
}
