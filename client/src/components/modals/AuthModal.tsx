import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useThisUserStore } from "../../store/thisUserStore";
import ApiErrorHandler from "../../exeptions/apiErrorHandler";
import useValidationField from "../../utils/hooks/useValidationField";
import { EMAIL_RULES, NAME_RULES, PASS_RULES } from "../../utils/data/validatationRules";
import { API_URL } from "../../http";

interface AuthModalProps {
  setShowLogin: (s: boolean) => void;
}

export default function AuthModal({ setShowLogin }: AuthModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [nameErrors, isNameValid] = useValidationField(name, NAME_RULES);
  const [emailErrors, isEmailValid] = useValidationField(email, EMAIL_RULES);
  const [passErrors, isPassValid] = useValidationField(password, PASS_RULES);

  const { registration, login } = useThisUserStore();

  const actionTypes = {
    login: async () => {
      await login(name.trim(), email.trim(), password);
    },

    registration: async () => {
      await registration(name.trim(), email.trim(), password);
    },
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmit(true);

    const button = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
    const action = button?.value as "login" | "registration";

    if (isEmailValid && isNameValid && isPassValid) {
      const toastId = toast.loading(t("loading"));
      try {
        await actionTypes[action]();
        toast.success(action + " " + t("successful"), { id: toastId });
        setShowLogin(false);
      } catch (error: any) {
        const message = ApiErrorHandler.handle(error, action);
        toast.error(message, { id: toastId });
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="form-floating mb-3">
        <Form.Control
          type="text"
          id="floatingName"
          placeholder={t("name")}
          value={name}
          onChange={e => setName(e.target.value)}
          isInvalid={!isNameValid && isSubmit}
        />
        <Form.Label htmlFor="floatingName">{t("name")}</Form.Label>
        <Form.Control.Feedback type="invalid">{nameErrors[0]}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="form-floating mb-3">
        <Form.Control
          type="email"
          id="floatingEmail"
          placeholder={t("email")}
          value={email}
          onChange={e => setEmail(e.target.value)}
          isInvalid={!isEmailValid && isSubmit}
        />
        <Form.Label htmlFor="floatingEmail">{t("email")}</Form.Label>
        <Form.Control.Feedback type="invalid">{emailErrors[0]}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="form-floating mb-3">
        <Form.Control
          type="password"
          id="floatingPassword"
          placeholder={t("password")}
          value={password}
          onChange={e => setPassword(e.target.value)}
          isInvalid={!isPassValid && isSubmit}
        />
        <Form.Label htmlFor="floatingPassword">{t("password")}</Form.Label>
        <Form.Control.Feedback type="invalid">{passErrors[0]}</Form.Control.Feedback>
      </Form.Group>

      <Button className="w-100 mb-2 btn-lg rounded-3" variant="primary" type="submit" value="login">
        {t("login")}
      </Button>

      <small className="text-body-secondary d-block mb-2 text-center">{t("or")}</small>

      <Button
        className="w-100 mb-2 btn-lg rounded-3"
        variant="success"
        type="submit"
        value="registration"
      >
        {t("registration")}
      </Button>

      <hr className="my-4" />
      <h2 className="fs-6 fw-bold mb-3 text-center">{t("or_use_third")}</h2>

      <Row className="g-2">
        <Col xs={12}>
          <Button
            as="a"
            href={`${API_URL}/oauth/google`}
            variant="outline-danger"
            className="w-100"
          >
            {t("continue_google")}
          </Button>
        </Col>
        <Col xs={12}>
          <Button
            as="a"
            href={`${API_URL}/oauth/facebook`}
            variant="outline-primary"
            className="w-100"
          >
            {t("continue_facebook")}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
