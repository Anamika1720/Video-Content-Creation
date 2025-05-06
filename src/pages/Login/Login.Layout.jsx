import React, { useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { PhoneAndroid, Lock, Send } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./Login.Styles";

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
          callback: () => {
            console.log("reCAPTCHA solved");
          },
          "expired-callback": () => {
            console.warn("reCAPTCHA expired.");
          },
        }
      );
      window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
      });
    }
  };

  const handlePhoneNumberSubmit = async () => {
    const phoneRegex = /^\+?\d{10,15}$/;

    if (!phoneNumber.startsWith("+") || !phoneRegex.test(phoneNumber)) {
      setErrors((prev) => ({
        ...prev,
        phoneNumber:
          "Please enter a valid phone number starting with country code (e.g., +91).",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, phoneNumber: "" }));
    setUpRecaptcha();

    setLoading(true);
    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        window.recaptchaVerifier
      );
      window.confirmationResult = confirmationResult;
      setIsOtpSent(true);
      toast.success("OTP sent successfully!");
    } catch (error) {
      console.log("error: ", error);
      toast.error("Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationCodeSubmit = async () => {
    if (!verificationCode) {
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
      toast.success("OTP verified successfully!");
    } catch {
      setErrors((prev) => ({
        ...prev,
        verificationCode: "Invalid OTP. Try again.",
      }));
      toast.error("Invalid OTP.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login with OTP</h2>

        {!isOtpSent ? (
          <>
            <div className="relative mb-6">
              <label className={styles.label(phoneActive || phoneNumber)}>
                Enter phone number
              </label>
              <PhoneAndroid className={styles.icon} />
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onFocus={() => setPhoneActive(true)}
                onBlur={() => setPhoneActive(phoneNumber !== "")}
                className={styles.input(errors.phoneNumber)}
              />
              {errors.phoneNumber && (
                <p className={styles.errorText}>{errors.phoneNumber}</p>
              )}
            </div>

            <button
              onClick={handlePhoneNumberSubmit}
              disabled={loading}
              className={styles.button}
            >
              <Send fontSize="small" />
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <div className="relative mb-6">
              <label className={styles.label(otpActive || verificationCode)}>
                Enter OTP
              </label>
              <Lock className={styles.icon} />
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                onFocus={() => setOtpActive(true)}
                onBlur={() => setOtpActive(verificationCode !== "")}
                className={styles.input(errors.verificationCode)}
              />
              {errors.verificationCode && (
                <p className={styles.errorText}>{errors.verificationCode}</p>
              )}
            </div>

            <button
              onClick={handleVerificationCodeSubmit}
              className={styles.button}
            >
              <Lock fontSize="small" />
              Verify OTP
            </button>
          </>
        )}

        <div id="recaptcha-container" className={styles.recaptcha}></div>

        {user && (
          <div className={styles.successMessage}>
            Welcome, {user.phoneNumber}!
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpLogin;
