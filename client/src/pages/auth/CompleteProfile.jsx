import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCompleteProfile, useCheckUsername } from "../../hooks/useUser";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { ROUTE } from "../../routes/route";
import { Spinner } from "../../components/ui/Loader";
import toast from "react-hot-toast";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { completeProfile, loading } = useCompleteProfile();
  const { checkUsername } = useCheckUsername();

  const [step, setStep] = useState(1);
  const [stepStatus, setStepStatus] = useState({}); // store step success/fail
  const [stepError, setStepError] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    phone: "",
    location: "",
    website: "",
  });

  // Update field and clear error for step
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStepError("");
    setStepStatus({ ...stepStatus, [step]: null });
  };

  // Next step
  const handleNext = async () => {
    setStepError("");
    // Step 1: Validate username
    if (step === 1) {
      const username = formData.username.trim();
      if (!username) return setStepError("Username is required");

      setCheckingUsername(true);
      try {
        const res = await checkUsername(username);
        if (!res.available) {
          setStepStatus({ ...stepStatus, [step]: false });
          return setStepError("Username is already taken");
        }
        setStepStatus({ ...stepStatus, [step]: true });
      } catch (err) {
        setStepStatus({ ...stepStatus, [step]: false });
        return setStepError(err.message || "Failed to validate username");
      } finally {
        setCheckingUsername(false);
      }
    }
    setStep(step + 1);
  };

  // Previous step
  const handlePrev = () => {
    setStepError("");
    setStep(step - 1);
  };

  // Submit final profile
  const handleSubmit = async () => {
    setStepError("");
    try {
      // Prepare payload: only include non-empty optional fields
      const payload = {
        username: formData.username.trim(),
      };
      if (formData.bio.trim()) payload.bio = formData.bio.trim();
      if (formData.phone.trim()) payload.phone = formData.phone.trim();
      if (formData.location.trim()) payload.location = formData.location.trim();
      if (formData.website.trim()) payload.website = formData.website.trim();

      const data = await completeProfile(payload);
      if (data?.user) {
        setStepStatus({ ...stepStatus, [step]: true });
        toast.success("Profile completed successfully!");
        navigate(ROUTE.home, { replace: true });
      }
    } catch (err) {
      setStepStatus({ ...stepStatus, [step]: false });
      setStepError(err.message || "Profile completion failed");
    }
  };

  // Step indicator component
  const StepIndicator = () => (
    <div className="flex justify-center items-center gap-2 mt-4">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`w-3 h-3 rounded-full ${
            step === s
              ? "bg-green-600"
              : stepStatus[s] === true
              ? "bg-green-400"
              : stepStatus[s] === false
              ? "bg-red-400"
              : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Complete Your Profile
      </h2>

      {stepError && <Alert type="error" message={stepError} />}

      {/* Step 1: Username */}
      {step === 1 && (
        <Input
          label="Username"
          name="username"
          placeholder="Choose a username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      )}

      {/* Step 2: Bio & Phone */}
      {step === 2 && (
        <>
          <Input
            label="Bio"
            name="bio"
            placeholder="Tell us about yourself"
            value={formData.bio}
            onChange={handleChange}
          />
          <Input
            label="Phone"
            name="phone"
            placeholder="Your phone number (optional)"
            value={formData.phone}
            onChange={handleChange}
          />
        </>
      )}

      {/* Step 3: Location & Website */}
      {step === 3 && (
        <>
          <Input
            label="Location"
            name="location"
            placeholder="City, Country (optional)"
            value={formData.location}
            onChange={handleChange}
          />
          <Input
            label="Website"
            name="website"
            placeholder="https://example.com (optional)"
            value={formData.website}
            onChange={handleChange}
          />
        </>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {step > 1 && (
          <Button type="button" onClick={handlePrev} variant="outline">
            Back
          </Button>
        )}

        {step < 3 && (
          <Button type="button" onClick={handleNext} disabled={checkingUsername}>
            {checkingUsername ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner size={5} /> Checking...
              </div>
            ) : (
              "Next"
            )}
          </Button>
        )}

        {step === 3 && (
          <Button type="button" full onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner size={5} /> Saving...
              </div>
            ) : (
              "Complete Profile"
            )}
          </Button>
        )}
      </div>

      {/* Step Indicator */}
      <StepIndicator />
    </div>
  );
};

export default CompleteProfile;
