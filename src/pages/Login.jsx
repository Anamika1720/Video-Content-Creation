import React, { useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { PhoneAndroid, Lock, Send } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const OtpLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [phoneActive, setPhoneActive] = useState(false);
  const [otpActive, setOtpActive] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    phoneNumber: "",
    verificationCode: "",
  });

  const navigate = useNavigate();

  const setUpRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA solved", response);
          },
          "expired-callback": () => {
            console.warn("reCAPTCHA expired. Please try again.");
          },
        }
      );
      window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
      });
    }
  };

  const handlePhoneNumberSubmit = async () => {
    if (!phoneNumber.startsWith("+")) {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: "Phone number must start with country code, e.g. +91...",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, phoneNumber: "" }));

    setUpRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    setLoading(true);
    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      window.confirmationResult = confirmationResult;
      setIsOtpSent(true);
    } catch (error) {
      console.error("Error during OTP send", error);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationCodeSubmit = async () => {
    if (verificationCode.length === 0) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: "OTP cannot be empty.",
      }));
      return;
    }

    try {
      const result = await window.confirmationResult.confirm(verificationCode);
      setUser(result.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error verifying OTP", error);
      setErrors((prev) => ({
        ...prev,
        verificationCode: "Invalid OTP. Try again.",
      }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-white">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-purple-800 mb-6">
          Login with OTP
        </h2>

        {!isOtpSent ? (
          <>
            <div className="relative mb-6">
              <label
                className={`absolute left-10 text-sm text-gray-500 bg-white px-1 transition-all duration-300 pointer-events-none ${
                  phoneActive || phoneNumber
                    ? "top-[-10px] text-xs text-purple-800"
                    : "top-1/2 -translate-y-1/2"
                }`}
              >
                Enter phone number
              </label>
              <PhoneAndroid className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onFocus={() => setPhoneActive(true)}
                onBlur={() => setPhoneActive(phoneNumber !== "")}
                className={`w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                  errors.phoneNumber
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-purple-300"
                }`}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            <button
              onClick={handlePhoneNumberSubmit}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-purple-800 text-white py-2 rounded-md hover:bg-purple-900 transition duration-300"
            >
              <Send fontSize="small" />
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <div className="relative mb-6">
              <label
                className={`absolute left-10 text-sm text-gray-500 bg-white px-1 transition-all duration-300 pointer-events-none ${
                  otpActive || verificationCode
                    ? "top-[-10px] text-xs text-purple-800"
                    : "top-1/2 -translate-y-1/2"
                }`}
              >
                Enter OTP
              </label>
              <Lock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                onFocus={() => setOtpActive(true)}
                onBlur={() => setOtpActive(verificationCode !== "")}
                className={`w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                  errors.verificationCode
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-purple-300"
                }`}
              />
              {errors.verificationCode && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.verificationCode}
                </p>
              )}
            </div>

            <button
              onClick={handleVerificationCodeSubmit}
              className="w-full flex items-center justify-center gap-2 bg-purple-800 text-white py-2 rounded-md hover:bg-purple-900 transition duration-300"
            >
              <Lock fontSize="small" />
              Verify OTP
            </button>
          </>
        )}

        <div id="recaptcha-container" className="mt-4"></div>

        {user && (
          <div className="mt-4 text-green-600 font-medium text-center">
            Welcome, {user.phoneNumber}!
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpLogin;
