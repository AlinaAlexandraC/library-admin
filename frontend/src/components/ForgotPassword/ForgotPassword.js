// import "./ForgotPassword.css";
// import Form from "../Form/Form";
// import formImage from "../../assets/images/login-vertical.jpg";
// import formImageHorizontal from "../../assets/images/login-horizontal.jpg";
// import { useState } from "react";
// import { fetchSignInMethodsForEmail, getAuth, sendPasswordResetEmail } from "firebase/auth";
// import { auth } from "../../firebase";

// const ForgotPassword = () => {
//     const [email, setEmail] = useState("");
//     const [message, setMessage] = useState("");
//     const [error, setError] = useState("");

//     const handleResetPassword = async (e) => {
//         e.preventDefault(e);

//         try {
//             const methods = await fetchSignInMethodsForEmail(auth, email);

//             if (methods.length === 0) {
//                 setError("Email is not registered. Please check the email address.");
//                 setTimeout(() => {
//                     setError("");
//                 }, 2000);
//                 return;
//             }

//             await sendPasswordResetEmail(auth, email);
//             setMessage("Password reset email sent! Please check your inbox.");
//             setTimeout(() => {
//                 setMessage("");
//             }, 2000);
//         } catch (error) {
//             setError("Error sending reset email. Please try again.");
//             setTimeout(() => {
//                 setError("");
//             }, 2000);
//         }
//     };

//     return (
//         <div className="forgot-password-container">
//             <Form formImage={formImage} formImageHorizontal={formImageHorizontal}>
//                 <form className="forgot-password-wrapper" onSubmit={handleResetPassword}>
//                     <div className="forgot-password-title">Forgot Password</div>
//                     <div className="forgot-password-email-container">
//                         <label htmlFor="email">Email address</label>
//                         <input
//                             type="email"
//                             id="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <button type="submit" className="login-button btn" >Send Reset Link</button>
//                 </form>
//                 <div className={`${error ? "error" : "success"}`}>{error ? error : message}</div>
//             </Form>
//         </div>
//     );
// };

// export default ForgotPassword;