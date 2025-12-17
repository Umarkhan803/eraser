import { useState } from "react";
import { useAuth } from "../context/Auth.context";

const Home: React.FC = () => {
  const { signUp, message } = useAuth();
  const [name, setName] = useState("test");
  const [email, setEmail] = useState("umarkhan803@gmail.com  ");
  const [password, setPassword] = useState("test123");
  const handleLogin = () => {
    signUp(name, email, password);
    console.log(message);
  };
  return (
    <>
      <h1 className="text-2xl font-bold">Home</h1>
      <button
        className="bg-blue-400 text-white px-6 py-5 ml-5 rounded-md"
        onClick={handleLogin}
      >
        login
      </button>
    </>
  );
};

export default Home;
