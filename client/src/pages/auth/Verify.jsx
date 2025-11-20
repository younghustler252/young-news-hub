import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyUser, resendCode } from "../../service/authService";

const Verify = () => {
	const { state } = useLocation();
	const navigate = useNavigate();
	const [code, setCode] = useState("");
	const [loading, setLoading] = useState(false);

	const identifier = state?.identifier;

	const handleVerify = async e => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await verifyUser(identifier, code);
			if (res.nextStep === "complete_profile") {
				navigate("/complete-profile", { state: { userId: res.userId } });
			} else {
				navigate("/login");
			}
		} catch (err) {
			alert(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleResend = async () => {
		try {
			await resendCode(identifier);
			alert("Verification code resent!");
		} catch (err) {
			alert(err.message);
		}
	};

	return (
		<form onSubmit={handleVerify} className="space-y-4">
			<p className="text-center text-gray-600">
				Enter the 6-digit code sent to <strong>{identifier}</strong>
			</p>
			<input
				type="text"
				maxLength={6}
				value={code}
				onChange={e => setCode(e.target.value)}
				className="w-full border border-gray-300 rounded px-3 py-2 text-center tracking-widest text-lg"
				placeholder="••••••"
				required
			/>
			<button
				type="submit"
				disabled={loading}
				className="w-full bg-green-700 text-white py-2 rounded font-semibold hover:bg-green-800 transition"
			>
				{loading ? "Verifying..." : "Verify Account"}
			</button>
			<p className="text-center text-sm text-gray-500 mt-3">
				Didn’t get the code?{" "}
				<button
					type="button"
					onClick={handleResend}
					className="text-green-700 hover:underline font-semibold"
				>
					Resend
				</button>
			</p>
		</form>
	);
};

export default Verify;
