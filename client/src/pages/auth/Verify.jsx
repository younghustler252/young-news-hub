import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyUser, resendCode } from "../../service/authService";
import Button from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Loader";
import Alert from "../../components/ui/Alert";
import { ROUTE } from "../../routes/route";

const RESEND_COOLDOWN = 60; // seconds

const Verify = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const identifier = state?.identifier;
  const method = state?.method || "email";

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg("");

    try {
      const user = await verifyUser(identifier, code, method);

      if (!user.username || !user.bio) {
        navigate(ROUTE.completeProfile, { state: { userId: user._id } });
      } else {
        navigate(ROUTE.home);
      }
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError(null);
    setSuccessMsg("");

    try {
      await resendCode(identifier, method);
      setSuccessMsg("Verification code resent successfully!");
      setCooldown(RESEND_COOLDOWN); // start cooldown
    } catch (err) {
      setError(err.message || "Failed to resend code");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-4 max-w-md mx-auto mt-10">
      <p className="text-center text-gray-600">
        Enter the 6-digit code sent to <strong>{identifier}</strong>
      </p>

      {error && <Alert type="error" message={error} />}
      {successMsg && <Alert type="success" message={successMsg} />}

      <input
        type="text"
        maxLength={6}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-center tracking-widest text-lg"
        placeholder="••••••"
        required
      />

      <Button type="submit" full disabled={loading}>
        {loading ? <Spinner size={5} /> : "Verify Account"}
      </Button>

      <p className="text-center text-sm text-gray-500 mt-3">
        Didn’t get the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={resendLoading || cooldown > 0}
          className="text-green-700 hover:underline font-semibold"
        >
          {resendLoading
            ? "Resending..."
            : cooldown > 0
            ? `Resend in ${cooldown}s`
            : "Resend"}
        </button>
      </p>
    </form>
  );
};

export default Verify;
