
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Search, Clock, PieChart } from "lucide-react";
import { useTrip } from "@/contexts/TripContext";

const Navbar = () => {
  const location = useLocation();
  const { trip } = useTrip();

  if (!trip) return null;

  const navItems = [
    {
      name: "Home",
      path: "/create-trip",
      icon: <Home className="w-5 h-5" />,
    },
    {
      name: "Itinerary",
      path: "/itinerary",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      name: "Activities",
      path: "/activities",
      icon: <Search className="w-5 h-5" />,
    },
    {
      name: "Budget",
      path: "/budget",
      icon: <PieChart className="w-5 h-5" />,
    },
  ];

  return (
    <>
      {/* Top navbar */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-travel-primary">TripTailor</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {trip && (
                <div className="text-sm font-medium text-gray-700">
                  {trip.destination} | {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Bottom navbar for mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 md:hidden">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center ${
                location.pathname === item.path
                  ? "text-travel-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Sidebar for desktop */}
      <div className="hidden md:block fixed top-16 left-0 bottom-0 w-56 bg-white border-r border-gray-200 z-10">
        <div className="flex flex-col h-full py-6">
          <div className="px-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-900">{trip?.name || "Your Trip"}</h2>
          </div>
          <nav className="flex-1 space-y-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  location.pathname === item.path
                    ? "bg-travel-primary bg-opacity-10 text-travel-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
