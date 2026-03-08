import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const AnimatedLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10"
      >
        <Heart className="h-10 w-10 text-primary" fill="currentColor" />
      </motion.div>
      <div className="text-center">
        <p className="font-display text-lg font-medium text-foreground">Reading your report...</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Our AI is carefully translating your medical results into plain English.
        </p>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            className="h-2 w-2 rounded-full bg-primary"
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedLoader;
