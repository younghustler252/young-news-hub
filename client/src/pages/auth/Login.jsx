import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import FormWrapper from "../../components/ui/FormWrapper";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Loader";
import Alert from "../../components/ui/Alert";
import { ROUTE } from "../../routes/route";

const Login = () => {
  const navigate = useNavigate();
  const { isLoggedIn, login, loading, error, user } = useAuth();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [formError, setFormError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      // 🔐 Redirect admin to dashboard, others to home
      if (user.role === "admin") navigate(ROUTE.admin);
      else navigate(ROUTE.home);
    }
  }, [isLoggedIn, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      const res = await login(formData); // login likely returns user data

      if (res?.user?.role === "admin") navigate(ROUTE.admin);
      else navigate(ROUTE.home);
    } catch (err) {
      setFormError(err.message || "Login failed");
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

      <Input
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
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
