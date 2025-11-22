import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import Input from "../../components/ui/Input";
import PasswordInput from "../../components/ui/PasswordInput"; // reusable password input
import Button from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Loader";
import Alert from "../../components/ui/Alert";
import { ROUTE } from "../../routes/route";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, login, loading, error, user } = useAuth();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [formError, setFormError] = useState("");

  // Redirect after login if already logged in and verified
  useEffect(() => {
    if (isLoggedIn && user) {
      if (!user.isEmailVerified) {
        // Redirect unverified users to /verify page
        navigate(ROUTE.verify, {
          state: { identifier: user.email, method: "email" },
        });
      } else {
        navigate(user.role === "admin" ? ROUTE.admin : ROUTE.home);
      }
    }
  }, [isLoggedIn, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      const res = await login(formData);

      if (res.user) {
        if (!res.user.isEmailVerified) {
          // Redirect unverified users to verify page
          navigate(ROUTE.verify, {
            state: { identifier: res.user.email, method: "email" },
          });
        } else {
          navigate(res.user.role === "admin" ? ROUTE.admin : ROUTE.home);
        }
      }
    } catch (err) {
      // Backend can send 403 if account not verified
      if (err.message?.includes("Account not verified")) {
        navigate(ROUTE.verify, {
          state: { identifier: formData.identifier, method: "email" },
        });
      } else {
        setFormError(err.message || "Login failed");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && <Alert type="error" message={formError} />}
      {error && !formError && <Alert type="error" message={error} />}

      <Input
        label="Email or Phone"
        name="identifier"
        type="text"
        placeholder="Enter your email or phone"
        value={formData.identifier}
        onChange={handleChange}
        required
      />

      <PasswordInput
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter your password"
        required
      />

      <Button type="submit" full disabled={loading}>
        {loading ? <Spinner size={5} /> : "Login"}
      </Button>

      <p className="text-sm text-center mt-4">
        Don’t have an account?{" "}
        <Link
          to={ROUTE.register}
          className="text-green-600 hover:underline font-medium"
        >
          Register
        </Link>
      </p>
    </form>
  );
};

export default Login;
