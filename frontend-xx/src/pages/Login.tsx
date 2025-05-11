import React from 'react';
interface LoginProps {
  onLogin: () => void;
}
const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return <div><h2>Login Page</h2><button onClick={onLogin}>Login</button></div>;
};
export default Login;
