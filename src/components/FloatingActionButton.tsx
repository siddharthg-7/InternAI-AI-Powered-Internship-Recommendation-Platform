import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaRobot, FaComments, FaSearch, FaUser } from "react-icons/fa";

const fabItems = [
  { icon: FaComments, label: "AI Chat", path: "/chat" },
  { icon: FaSearch, label: "Search", path: "/search" },
  { icon: FaUser, label: "Profile", path: "/my-profile" },
];

export function FloatingActionButton() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on landing and sign-in pages
  if (location.pathname === "/" || location.pathname === "/sign-in") return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      {/* FAB items */}
      <AnimatePresence>
        {open &&
          fabItems.map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 400, damping: 20 }}
              onClick={() => {
                navigate(item.path);
                setOpen(false);
              }}
              className="flex items-center gap-2 bg-card border border-border shadow-lg rounded-full pl-4 pr-3 py-2.5 hover:bg-secondary transition-colors"
            >
              <span className="text-xs font-medium text-foreground whitespace-nowrap">{item.label}</span>
              <item.icon className="w-4 h-4 text-primary" />
            </motion.button>
          ))}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full gradient-primary shadow-glow flex items-center justify-center text-primary-foreground"
      >
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaRobot className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </div>
  );
}
