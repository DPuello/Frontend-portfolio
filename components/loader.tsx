import { Spinner } from "@heroui/spinner";
import { motion } from "framer-motion";

import { personalData } from "@/config/personal-data";

function Loader() {
  return (
    <motion.div
      className="w-full h-screen flex flex-col gap-2 items-center justify-center bg-gradient-to-tr from-secondary-900 to-secondary-800"
      exit={{ opacity: 0 }}
    >
      <h2 className="font-semibold text-sm text-primary-100">Portfolio</h2>
      <h1 className="font-bold text-3xl text-secondary-100">
        {personalData.name}
      </h1>
      <Spinner className="mt-4" size="lg" />
    </motion.div>
  );
}

export default Loader;
