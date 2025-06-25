import React,{useState} from 'react'
import { useAppContext } from '../context/AppContext'
import toast from "react-hot-toast";
function Login() {
    const [state, setState] =useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] =useState("");

    const [otpSent, setOtpSent] = useState(false);
const [otp, setOtp] = useState("");
const [timer, setTimer] = useState(30);
const [canResend, setCanResend] = useState(false);
const [isOtpSubmitting, setIsOtpSubmitting] = useState(false);


    const {setUserLogin,setUser,user,axios,navigate} =useAppContext();

   // Send OTP
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        setIsOtpSubmitting(true);
      const { data } = await axios.post("/api/user/register/send-otp", {
        name,
        email,
        password,
      });
      if (data.success) {
        toast.success("OTP sent to your email");
        setOtpSent(true);
        startTimer();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message ||"Something went wrong");
    }finally {
        setIsOtpSubmitting(false);
      }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
      setIsOtpSubmitting(true);
    try {
      const { data } = await axios.post("/api/user/register/verify-otp", {
        email,
        otp,
        password,
        name
      });
      if (data.success) {
        toast.success("Registration Successful!");
        setUser(data.user);
        setUserLogin(false);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("OTP Verification failed");
    }finally{
        setIsOtpSubmitting(false);
    }
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsOtpSubmitting(true);
    try {
      const { data } = await axios.post("/api/user/login", {
        email,
        password,
      });

      if (data.success) {
        toast.success("Login successful");
        setUser(data.user);
        setUserLogin(false);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response.data.message || "Login failed, please try again");
      console.log(err);
    }finally{
        setIsOtpSubmitting(false);
    }
  };

  const startTimer = () => {
    setCanResend(false);
    setTimer(30);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resendOTP = async () => {
    
    try {
        setIsOtpSubmitting(true);
      const { data } = await axios.post("/api/user/register/send-otp", {
        name,
        email,
        password,
      });
      if (data.success) {
        toast.success("OTP resent");
        startTimer();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to resend OTP");
      console.error(err);
    }finally {
        setIsOtpSubmitting(false);
      }
  };
      
const emailEdit=async()=>{
   await setOtpSent(false);
    setEmail("");
}
    return (
        <div
          onClick={() => setUserLogin(false)}
          className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50"
        >
          <form
            onSubmit={state === "register" ? (otpSent ? handleVerifyOtp : handleRegister) : handleLogin}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
          >
            <p className="text-2xl font-medium m-auto">
              <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
    
            {state === "register" && !otpSent && (
              <>
                <div className="w-full">
                  <p>Name</p>
                  <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    placeholder="type here"
                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                    type="text"
                    required
                  />
                </div>
              </>
            )}
    
            <div className="w-full">
              <p>Email{ otpSent ? (<span className='text-primary ml-1 cursor-pointer' onClick={emailEdit}>(Edit)</span>):null}</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="type here"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                type="email"
                required
                disabled={otpSent}
              />
            </div>
    
            {(state === "login" || !otpSent) && (
              <div className="w-full">
                <p>Password</p>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="type here"
                  className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                  type="password"
                  required
                />
              </div>
            )}
    
            {state === "register" && otpSent && (
              <>
                <div className="w-full">
                  <p>Enter OTP</p>
                  <input
                    onChange={(e) => setOtp(e.target.value)}
                    value={otp}
                    placeholder="123456"
                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                    type="text"
                    maxLength={6}
                    required
                  /> 
                </div>
                <p className="text-sm text-gray-500  mt-1">
                  {canResend ? (
                    <span onClick={resendOTP} className="text-primary cursor-pointer">Resend OTP</span>
                  ) : (
                    <>Resend in <span className='text-primary'>{timer}s</span></>
                  )}
                </p>
              </>
            )}
    
            {state === "register" ? (
              <p>
                Already have an account?{" "}
                <span onClick={() => { setState("login"); setOtpSent(false); }} className="text-primary cursor-pointer">click here</span>
              </p>
            ) : (
              <p>
                Create an account?{" "}
                <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
              </p>
            )}
    
    <button
  onClick={state === "register" ? (otpSent ? handleVerifyOtp : handleRegister) : handleLogin}
  className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer flex items-center justify-center gap-2"
  disabled={isOtpSubmitting}
>
  {state === "register" ? (
    isOtpSubmitting ? (
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    ) : otpSent ? (
      "Verify OTP"
    ) : (
      "Send OTP"
    )
  ) : (
    "Login"
  )}
</button>
          </form>
        </div>
      );
            }

export default Login
