import { Link } from "react-router-dom";
import Logo from "../assets/logo.jpg";
import { motion } from "framer-motion";
import Button from "../components/ui/Button"; // your reusable button

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 max-w-md text-center"
      >
        {/* Image without rounded corners */}
        <motion.img
          src={Logo}
          alt="Logo"
          className="mx-auto mb-6 h-20 w-auto object-contain"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        />

        <motion.h1
          className="text-4xl font-bold text-gray-800 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          404
        </motion.h1>

        <motion.h2
          className="text-xl font-semibold text-gray-700 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Page Not Found
        </motion.h2>

        <motion.p
          className="text-gray-600 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          The page you’re looking for doesn’t exist or has been moved.
        </motion.p>

        {/* Reusable Buttons */}
        <motion.div
          className="flex flex-col space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/">
            <Button full>Go Home</Button>
          </Link>

          <Link to="/login">
            <Button full variant="outline">
              Login
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
