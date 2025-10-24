import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";
import { requestNotificationPermission } from "./firebase"; 
import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import toast from "react-hot-toast";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Ask for notification permission and get FCM token
    requestNotificationPermission();

    //Handle foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);

      // Show toast notification in the UI
      toast(payload.notification?.title || "New Notification", {
        icon: "🔔",
        style: {
          background: "#222",
          color: "#fff",
        },
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Global toast provider */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
            },
            success: {
              style: {
                background: "green",
                color: "#fff",
              },
            },
            error: {
              style: {
                background: "red",
                color: "#fff",
              },
            },
          }}
        />

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} /> 
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
