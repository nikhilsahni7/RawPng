import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DashboardShellProps extends HTMLMotionProps<"div"> {}

function DashboardShell({
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  className,
  ...props
}: DashboardShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container grid items-start gap-8 pb-8 pt-6 md:py-10"
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default DashboardShell;
