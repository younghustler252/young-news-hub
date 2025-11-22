import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../service/authService";

import Input from "../../components/ui/Input";
import PasswordInput from "../../components/ui/PasswordInput"; // 👈 use reusable component
import Button from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Loader";
import Alert from "../../components/ui/Alert";
import { ROUTE } from "../../routes/route"; // 👈 use route constants

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    method: "email",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await registerUser(formData);

      // Use response state safely
      const identifier = formData[formData.method];

      navigate(ROUTE.verify, {
        state: {
          identifier,
          method: formData.method,
          userId: res.userId, // backend returns userId
        },
      });
    } catch (err) {
      // Better error handling if using Axios
      const message =
        err?.response?.data?.message || err.message || "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <Alert message={error} type="error" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
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

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 text-white py-2 rounded font-semibold hover:bg-green-800 transition"
        >
          {loading ? <Spinner size="sm" /> : "Sign Up"}
        </Button>
      </form>

      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <Link
          to={ROUTE.login}
          className="text-green-600 hover:underline font-medium"
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
