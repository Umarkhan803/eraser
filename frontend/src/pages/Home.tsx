import { Link } from "react-router-dom";
import Button from "../components/buttons/Button";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <h1 className="text-4xl font-bold mb-8">Welcome to Eraser</h1>
      <p className="text-lg mb-8">A collaborative drawing tool</p>
      <div className=" flex  space-x-4 gap-3">
        <Link to="/login">
          <Button text="Login" />
        </Link>
        <Link to="/signup">
          <Button text="Signup" />
        </Link>
      </div>
    </div>
  );
};

export default Home;
