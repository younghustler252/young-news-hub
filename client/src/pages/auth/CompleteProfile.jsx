import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCompleteProfile } from "../../hooks/useUser"; // Assuming the hook is in hooks/useUser.js
import Input from "../../components/ui/Input"; // Reusable Input component
import Button from "../../components/ui/Button"; // Reusable Button component

const CompleteProfile = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [accountType, setAccountType] = useState("user");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  // Use the custom hook for completing the profile
  const { completeProfile, loading, error } = useCompleteProfile();

  // Validate and move to the next step
  const handleUsernameSubmit = async () => {
    if (!username) return alert("Username is required!");

    // Check if username is available through API call
    // (you can integrate this logic with your API request to check username)
    const isUsernameAvailable = true; // Replace with actual check
    if (isUsernameAvailable) {
      setCurrentStep(2); // Move to next step if username is available
    } else {
      alert("Username already taken!");
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      username,
      bio,
      phone,
      accountType,
      location,
      website,
    };

    const data = await completeProfile(userData); // Call the hook's function to complete profile
    if (data) {
      alert("Profile completed successfully!");
      navigate("/login"); // Redirect on successful profile completion
    }
  };

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Complete Your Profile
      </h2>

      {/* Step 1: Username */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">
            Choose a Username
          </h3>
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            required
          />
          <Button
            variant="primary"
            full
            onClick={handleUsernameSubmit}
            disabled={loading}
          >
            {loading ? "Checking..." : "Next"}
          </Button>
        </div>
      )}

      {/* Step 2: Bio */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">
            Write a Short Bio
          </h3>
          <Input
            label="Bio (Optional)"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a short bio"
            type="text"
          />
          <Button
            variant="primary"
            full
            onClick={() => setCurrentStep(3)}
            disabled={loading}
          >
            Next
          </Button>
        </div>
      )}

      {/* Step 3: Phone */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">
            Enter Your Phone Number
          </h3>
          <Input
            label="Phone (Optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
          />
          <Button
            variant="primary"
            full
            onClick={() => setCurrentStep(4)}
            disabled={loading}
          >
            Next
          </Button>
        </div>
      )}

      {/* Step 4: Account Type */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">
            Select Account Type
          </h3>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
          >
            <option value="user">User</option>
            <option value="creator">Creator</option>
            <option value="company">Company</option>
            <option value="recruiter">Recruiter</option>
          </select>
          <Button
            variant="primary"
            full
            onClick={() => setCurrentStep(5)}
            disabled={loading}
          >
            Next
          </Button>
        </div>
      )}

      {/* Step 5: Location and Website */}
      {currentStep === 5 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">Additional Info</h3>
          <Input
            label="Location (Optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your location"
          />
          <Input
            label="Website (Optional)"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Your website or portfolio"
          />
          <Button
            variant="primary"
            full
            onClick={handleFinalSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Finish Setup"}
          </Button>
        </div>
      )}

      {/* Error handling */}
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default CompleteProfile;
