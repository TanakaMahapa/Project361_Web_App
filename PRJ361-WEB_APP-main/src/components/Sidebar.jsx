import React from "react";
import { Button } from "@/components/ui/button";
import { Home, Bell, Settings, X } from "lucide-react";
import { Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  return (
    <>
      {isOpen && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      <Motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        exit={{ x: "-100%" }}
        transition={{ type: "tween" }}
        className="fixed left-0 top-0 w-72 h-full bg-app-navy text-card-foreground z-50 shadow-lg flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-semibold">OWNER'S NAME</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-12 text-card-foreground hover:bg-app-navy-lighter"
            onClick={() => {
              navigate("/");
              onClose();
            }}
          >
            <Home className="w-5 h-5" />
            Home
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-12 text-card-foreground hover:bg-app-navy-lighter"
            onClick={() => {
              navigate("/notifications");
              onClose();
            }}
          >
            <Bell className="w-5 h-5" />
            Notifications
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-12 text-card-foreground hover:bg-app-navy-lighter"
            onClick={() => {
              navigate("/settings");
              onClose();
            }}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Button>
        </nav>
      </Motion.aside>
    </>
  );
};

export default Sidebar;

