import { Navbar, Container, Button, FormControl, Nav, Dropdown, Form } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useThisUserStore } from "../store/thisUserStore";
import { useSettingsStore } from "../store/useSettingsStore";
import { useTranslation } from "react-i18next";
import ModalBox from "./modals/ModalBox";
import AuthModal from "./modals/AuthModal";
import toast from "react-hot-toast";
import ApiErrorHandler from "../exeptions/apiErrorHandler";
import { useDebounceValue } from "../utils/hooks/useDebounceValue";
import { useInputValue } from "../utils/hooks/useInputValue";
import { useEffect, useState } from "react";
import useSearchStore from "../store/searchStore";
import useInventoryListStore from "../store/inventoryListStore";
import { FaHome } from "react-icons/fa";

interface HeaderProps {
  searchPlaceholder?: string;
}

export default function Header({ searchPlaceholder }: HeaderProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme, language, setLanguage } = useSettingsStore();
  const { user, isAuth, logout } = useThisUserStore();
  const { t, i18n } = useTranslation();
  const { clearSelectedTagName } = useInventoryListStore();
  const { searchTerm, setSearchTerm } = useSearchStore();

  const [showLogin, setShowLogin] = useState(false);
  const [localInput, _, handleInputChange] = useInputValue(searchTerm);
  const debouncedInput = useDebounceValue(localInput, 500);

  useEffect(() => {
    setSearchTerm(debouncedInput);
    clearSelectedTagName();
  }, [debouncedInput]);

  const handleLanguageChange = (lang: "en" | "ru") => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleLogout = async () => {
    const toastId = toast.loading(t("loading"));
    try {
      await logout();
      toast.success(t("logout") + " " + t("successful"), { id: toastId });
      navigate("/");
    } catch (error) {
      const message = ApiErrorHandler.handle(error);
      toast.error(message, { id: toastId });
    }
  };

  return (
    <>
      <header className="w-100 fixed-top shadow">
        <Navbar expand="lg" className="py-3 px-2 bg-body-tertiary shadow border-bottom">
          <Container
            fluid
            className="position-relative d-flex justify-content-between align-items-center"
          >
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="secondary"
                style={{ minWidth: "50px" }}
                onClick={() => navigate("/")}
              >
                <FaHome />
              </Button>

              {isAuth && (
                <Navbar.Text className="fw-bold mb-0">
                  <Link to={`/user/${user?.id}`} className="text-decoration-none fs-5 fw-bold">
                    {user?.name}
                  </Link>
                </Navbar.Text>
              )}
            </div>

            {searchPlaceholder && (
              <FormControl
                type="search"
                placeholder={t(searchPlaceholder)}
                value={localInput}
                onChange={handleInputChange}
                className="position-absolute start-50 translate-middle-x"
                style={{ maxWidth: "300px" }}
              />
            )}

            <Nav className="d-flex align-items-center gap-2">
              <Form.Check
                type="switch"
                id="themeSwitch"
                label={theme === "light" ? "☀️" : "🌑"}
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
              <Dropdown>
                <Dropdown.Toggle variant="outline-primary" className="me-2">
                  {language.toUpperCase()}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ minWidth: "auto" }}>
                  <Dropdown.Item onClick={() => handleLanguageChange("en")}>EN</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleLanguageChange("ru")}>RU</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {isAuth ? (
                <Button
                  variant="outline-danger"
                  style={{ minWidth: "80px" }}
                  onClick={handleLogout}
                >
                  {t("logout")}
                </Button>
              ) : (
                <Button
                  variant="outline-success"
                  style={{ minWidth: "70px" }}
                  onClick={() => setShowLogin(true)}
                >
                  {t("login")}
                </Button>
              )}
            </Nav>
          </Container>
        </Navbar>
      </header>

      <ModalBox show={showLogin} title={t("sign_or_log")} onClose={() => setShowLogin(false)}>
        <AuthModal setShowLogin={setShowLogin} />
      </ModalBox>
    </>
  );
}
