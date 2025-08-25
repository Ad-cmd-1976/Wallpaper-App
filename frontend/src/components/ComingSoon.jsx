import { motion } from "framer-motion";

export default function ComingSoon() {
  return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center p-8"
      >
        <motion.div
          initial={{ scale: 0.98 }}
          animate={{ scale: [0.98, 1, 0.98] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center gap-1"
        >
          <h1 className="text-4xl md:text-6xl font-thin tracking-tight">
            Coming soon ...
          </h1>
        </motion.div>
    </motion.div>
  );
}
