
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useTrip } from "@/contexts/TripContext";

const Layout = () => {
  const { trip } = useTrip();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {trip ? (
        <div className="pt-16 pb-20 flex-1">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-700">No trip selected</h2>
            <p className="mt-2 text-gray-500">Please create a trip first</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
