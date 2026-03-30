import React from "react";
import { useNavigateCustom } from "../_layout/elements/custom-link";
import SubmitButton from "../../components/SubmitButton";
import axios from "axios";

const RegisterNew = () => {
  const navigate = useNavigateCustom();

  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASEURL}register-new`,
        {
          username: formData.username,
          password: formData.password,
          parent: "superadmin",
        }
      );

      alert("User Registered Successfully");
      navigate.go("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login"
      style={{
        background: "transparent",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontWeight: "500",
      }}
    >
      <div className="loginInner1">
        <div
          className="featured-box-login featured-box-secundary default"
          style={{ background: "var(--theme1-bg)" }}
        >
          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center w-100">
            <div>
              <i
                className="fas fa-arrow-left text-white"
                style={{ fontSize: "20px", cursor: "pointer" }}
                onClick={() => navigate.go("/login")}
              ></i>
            </div>

            <img
              onClick={() => window.location.reload()}
              src="/assets/close.svg"
              alt="close"
              style={{ cursor: "pointer", width: "24px", height: "24px" }}
            />
          </div>

          {/* LOGO */}
          <div className="d-flex align-items-center justify-content-center my-2">
            <img
              src="/imgs/image.png"
              className="logo-login"
              style={{ width: "230px" }}
            />
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="form-group m-b-20">
              <label className="text-light">User ID</label>
              <input
                name="username"
                placeholder="User Name"
                type="text"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group m-b-20">
              <label className="text-light">Password</label>
              <input
                name="password"
                placeholder="Password"
                type="password"
                className="form-control"
                onChange={handleChange}
                required
              />
              {error && <small className="text-danger">{error}</small>}
            </div>

                <div className="form-group m-b-20">
                <label className="text-light">Confirm Password</label>
                <input
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  type="password"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
                {error && <small className="text-danger">{error}</small>}
              </div>


            {/* BUTTON */}
            <div className="form-group text-center mb-0">
              <SubmitButton
                type="submit"
                className="btn btn-submit btn-login mb-10"
                style={{ background: "#2C4F58", fontWeight: "700" }}
              >
                Register
                {loading ? (
                  <i className="ml-2 fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="ml-2 fas fa-user-plus"></i>
                )}
              </SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RegisterNew);