import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import OtpInput from "react-otp-input";
import { MdVerifiedUser } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa6";
import Swal from "sweetalert2"; // Import SweetAlert2
import { resendOtp, verifyOtp } from "../../api/fetching";
import axios from "axios";

const OTPPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [code, setCode] = useState(null);
  const [timer, setTimer] = useState(60); // Timer awal dalam detik
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const email = localStorage.getItem("registeredEmail");

  useEffect(() => {
    let interval;

    if (isTimerActive) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 0) {
            clearInterval(interval);
            setIsTimerActive(false);
            return 60; // Setel ulang timer ke 60 detik setelah mencapai 0
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval); // Membersihkan interval saat komponen dilepas
  }, [isTimerActive]);

  const handleResendCode = async () => {
    try {
      const res = await resendOtp(email);
      Swal.fire({
        title: "Kode OTP Terkirim",
        text: "Kode OTP baru telah dikirim ke email Anda.",
        icon: "success",
        confirmButtonText: "OK",
      });
      setAlertMessage({ type: "success", res });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        Swal.fire({
          title: "Gagal Mengirim OTP",
          text: err.response.data.message || "Terjadi kesalahan saat mengirim OTP. Silakan coba lagi.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setAlertMessage({
          type: "error",
          message: err.response.data.message,
        });
        return;
      }
      setAlertMessage({ type: "error", message: err.message });
    }

    // Setelah mengirim ulang, aktifkan timer
    setIsTimerActive(true);
  };

  const handleVerify = async () => {
    try {
      const res = await verifyOtp(code, userId);
      Swal.fire({
        title: "Verifikasi Berhasil",
        text: "Akun Anda telah berhasil diverifikasi.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/login");
      });
      setAlertMessage({ type: "success", message: res });
    } catch (err) {
      Swal.fire({
        title: "Verifikasi Gagal",
        text: err.response?.data?.message || "Terjadi kesalahan dalam permintaan.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setAlertMessage({
        type: "error",
        message: "Terjadi kesalahan dalam permintaan.",
      });
    }
  };

  return (
    <>
      <div className="relative flex flex-col justify-center min-h-screen py-32 overflow-hidden bg-gray-50 rounded-3xl">
        <div className="pt-24 lg:pt-32 absolute top-0 translate-x-[-50%] left-[50%]  w-full lg:w-9/12  pb-10">
          <div>
            <Link to={"/register"}>
              <h3 className="flex items-center ml-4 font-semibold duration-300 hover:scale-105 hover:underline lg:ml-0">
                <span className="mr-3">
                  <FaArrowLeft />
                </span>
                Kembali ke Register
              </h3>
            </Link>
          </div>
        </div>
        <div className="w-full max-w-lg px-6 pt-10 mx-auto bg-white shadow-2xl relativ pb-9 rounded-2xl">
          <div className="flex flex-col w-full max-w-md mx-auto space-y-7">
            <div className="flex flex-col items-center justify-center text-center">
              <MdVerifiedUser className="items-center justify-center w-24 h-24 text-[#0092A4]" />
              <div className="text-2xl font-semibold ">OTP VERIFICATION</div>
              <p className="font-poppins text-md">
                Enter the OTP sent to you verify your identity
              </p>
            </div>

            <div className="flex flex-col space-y-6">
              <div className="flex flex-row items-center justify-center w-full max-w-sm mx-auto">
                <OtpInput
                  value={code}
                  onChange={setCode}
                  numInputs={4}
                  renderSeparator={<span className="px-2"> </span>}
                  renderInput={(props) => (
                    <input
                      {...props}
                      className="w-24 mx-2 text-5xl text-center border rounded-md h-14"
                    />
                  )}
                />
              </div>
              <div className="flex flex-col items-center space-y-5">
                {alertMessage && (
                  <div
                    className={`flex justify-center items-center mx-auto text-xs  font-montserrat ${alertMessage.type === "success"
                      ? "text-[#73CA5C]"
                      : "text-[#FF4949]"
                      }`}
                  >
                    <span className="inline-block">{alertMessage.res}</span>
                  </div>
                )}

                <button
                  onClick={handleVerify}
                  className="flex px-6 py-3 text-sm text-center text-white bg-[#0092A4] border border-none outline-none rounded-xl hover:bg-gray-300"
                >
                  Verify OTP
                </button>
                <button
                  className="px-3 py-2 text-sm text-center text-white bg-black border border-none outline-none rounded-xl hover:bg-gray-300"
                >
                  Clear OTP
                </button>

                <p className="mt-2 text-sm text-center text-gray-600 font-poppins">
                  {isTimerActive ? (
                    <p>Resend OTP in {timer} seconds</p>
                  ) : (
                    <p>
                      Didn't get code? &nbsp;
                      <button
                        className="font-bold text-blue-950 font-poppins"
                        onClick={handleResendCode}
                      >
                        Resend OTP
                      </button>
                    </p>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OTPPage;
