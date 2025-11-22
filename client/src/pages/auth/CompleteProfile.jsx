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
  const [stepError, setStepError] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    phone: "",
    location: "",
    website: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStepError(""); // clear step error on input
  };

  const handleNext = async () => {
    setStepError("");

    if (step === 1) {
      if (!formData.username.trim())
        return setStepError("Username is required");

      setCheckingUsername(true);
      try {
        const res = await checkUsername(formData.username.trim());
        if (!res.available) return setStepError("Username is already taken");
      } catch (err) {
        return setStepError(err.message || "Failed to validate username");
      } finally {
        setCheckingUsername(false);
      }
    }

    setStep(step + 1);
  };

  const handlePrev = () => {
    setStepError("");
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setStepError("");
    try {
      const data = await completeProfile(formData);
      if (data?.user) {
        toast.success("Profile completed successfully!");
        navigate(ROUTE.home, { replace: true });
      }
    } catch (err) {
      setStepError(err.message || "Profile completion failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
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
            placeholder="Your phone number"
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
            placeholder="City, Country"
            value={formData.location}
            onChange={handleChange}
          />
          <Input
            label="Website"
            name="website"
            placeholder="https://example.com"
            value={formData.website}
            onChange={handleChange}
          />
        </>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        {step > 1 && (
          <Button type="button" onClick={handlePrev}>
            Back
          </Button>
        )}

        {step < 3 && (
          <Button
            type="button"
            onClick={handleNext}
            disabled={checkingUsername}
          >
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
      <p className="text-center text-sm text-gray-500 mt-2">Step {step} of 3</p>
    </div>
  );
};

export default CompleteProfile;
