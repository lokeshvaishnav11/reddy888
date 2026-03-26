import React from "react";
import User from "../../models/User";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { loginAction } from "../../redux/actions/login/login.action";
import { selectUserData } from "../../redux/actions/login/loginSlice";
import { useWebsocketUser } from "../../context/webSocketUser";
import { useNavigateCustom } from "../_layout/elements/custom-link";
import { isMobile } from "react-device-detect";
import api from "../../utils/api";
import SubmitButton from "../../components/SubmitButton";

const Login = () => {
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserData);
  const { socketUser } = useWebsocketUser();

  const navigate = useNavigateCustom();

  const [loginForm, setLoginForm] = React.useState<User>({
    username: "",
    password: "",
    logs: "",
    isDemo: false,
  });

  const [isDemoLogin, setIsDemoLogin] = React.useState(false); // Track Demo Login

  // React.useEffect(() => {
  //   api.get(`${process.env.REACT_APP_IP_API_URL}`).then((res) => {
  //     setLoginForm({ ...loginForm, logs: res.data });
  //   });
  // }, []);

  React.useEffect(() => {
    if (userState.status === "done") {
      const { role, _id } = userState.user;
      socketUser.emit("login", {
        role: userState.user.role,
        sessionId: userState.user.sessionId,
        _id,
      });
      localStorage.setItem("login-session", userState.user.sessionId);

      if (
        userState.user.role &&
        ["admin", "1", "2", "3"].includes(userState.user.role)
      ) {
        return navigate.go("/");
      }

      return isMobile ? navigate.go("/match/4/in-play") : navigate.go("/");
    }
  }, [userState]);

  const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };
  const handleSubmitDemoLogin = () => {
    const loginFormNew = { ...loginForm, isDemo: true };
    setLoginForm(loginFormNew);
    setIsDemoLogin(true);
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(loginAction(loginForm));
    setIsDemoLogin(false);
  };
  return (
    <div>
      <div
        className="login"
        style={{
          background: "#00000080",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontWeight:"500"
        }}
      >
        <div className="loginInner1 ">
          <div className="log-logo m-b-20 text-center"></div>
          <div
            className="featured-box-login featured-box-secundary default"
            style={{ background: "var(--theme1-bg)" }}
          >
            <div className="d-flex justify-content-between align-items-center w-100">
              {/* Back Arrow */}
              <div>
                <i
                  className="fas fa-arrow-left text-white"
                  style={{ fontSize: "20px", cursor: "pointer" }}
                ></i>
              </div>

              {/* Close Icon */}
              <img
                src="/assets/close.svg" // 👈 yaha apna correct icon path daal dena
                alt="close"
                style={{ cursor: "pointer", width: "24px", height: "24px" }}
              />
            </div>

            <div className="d-flex align-items-center justify-content-center my-2">
              {" "}
              <img
                src="/imgs/logo.png"
                className="logo-login"
                style={{ width: "230px" }}
              />
            </div>
            <form
              onSubmit={(e) => handleSubmit(e)}
              role="form"
              autoComplete="off"
              method="post"
            >
              <div className="form-group m-b-20">
                <label className="text-light">User ID</label>
                <input
                  name="username"
                  placeholder="User Name"
                  type="text"
                  className="form-control"
                  aria-required="true"
                  aria-invalid="false"
                  onChange={handleForm}
                  required={!isDemoLogin}
                />
                {/* <i className="fas fa-user"></i> */}
                <small
                  className="text-danger"
                  style={{ display: "none" }}
                ></small>
              </div>
              <div className="form-group m-b-20">
                <label className="text-light">Password</label>
                <input
                  name="password"
                  placeholder="Password"
                  type="password"
                  className="form-control"
                  aria-required="true"
                  aria-invalid="false"
                  onChange={handleForm}
                  required={!isDemoLogin}
                />
                {/* <i className="fas fa-key"></i> */}
                {userState.error ? (
                  <small className="text-danger">{userState.error}</small>
                ) : (
                  ""
                )}
              </div>
              <div className="form-group text-center mb-0">
                <SubmitButton
                  type="submit"
                  className="btn btn-submit btn-login mb-10"
                  style={{ background: "#2C4F58" , fontWeight:"700" }}
                >
                  Login
                  {userState.status === "loading" ? (
                    <i className="ml-2 fas fa-spinner fa-spin"></i>
                  ) : (
                    ""
                  )}
                </SubmitButton>
                <SubmitButton
                  type="submit"
                  onClick={() => handleSubmitDemoLogin()}
                  className="btn btn-submit btn-login mb-10"
                  style={{ background: "#2C4F58" , fontWeight:"700" }}
                >
                  Demo Login
                  {userState.status === "loading" ? (
                    <i className="ml-2 fas fa-spinner fa-spin"></i>
                  ) : (
                   ""
                  )}
                </SubmitButton>

                <SubmitButton
                  className="btn btn-submit btn-login mb-10"
                  style={{ background: "#66bb6a", fontWeight:"700" }}
                >
              <img src="/assets/android.svg" />    Download .apk  <i style={{position:"relative", top:"0px" , right:"-8px"}} className="fas fa-arrow-down"></i>
                
                </SubmitButton>
                <small className="recaptchaTerms d-none">
                  This site is protected by reCAPTCHA and the Google
                  <a
                    target={"_blank"}
                    rel="noopener noreferrer"
                    href="https://policies.google.com/privacy"
                  >
                    Privacy Policy
                  </a>{" "}
                  and
                  <a
                    target={"_blank"}
                    rel="noopener noreferrer"
                    href="https://policies.google.com/terms"
                  >
                    Terms of Service
                  </a>{" "}
                  apply.
                </small>
              </div>
              <div className="mt-2 text-center download-apk"></div>
            </form>
          </div>
        </div>
      </div>
      <section className="footer footer-login d-none">
        <div className="footer-top">
          <div className="footer-links">
            <nav className="navbar navbar-expand-sm">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/terms-and-conditions"
                    target="_blank"
                  >
                    {" "}
                    Terms and Conditions{" "}
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/responsible-gaming"
                    target="_blank"
                  >
                    {" "}
                    Responsible Gaming{" "}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="support-detail">
            <h2>24X7 Support</h2>
            <p></p>
          </div>
          <div className="social-icons-box"></div>
        </div>
      </section>
    </div>
  );
};

export default Login;
