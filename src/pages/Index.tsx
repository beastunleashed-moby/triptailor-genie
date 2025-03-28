
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, MapPin, PieChart, LogIn, UserPlus } from "lucide-react";

const Index = () => {
  const [isAnimated, setIsAnimated] = useState(false);

  // Trigger animation after component mounts
  useState(() => {
    setIsAnimated(true);
  });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-travel-primary">TripTailor</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-600 hover:text-travel-primary">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-travel-primary hover:bg-blue-600 text-white">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="relative">
          {/* Hero image */}
          <div className="absolute inset-0 z-0">
            <div 
              className="w-full h-full bg-cover bg-center" 
              style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80')",
                backgroundBlendMode: "overlay",
              }}
            >
              <div className="w-full h-full bg-black bg-opacity-40"></div>
            </div>
          </div>

          {/* Hero content */}
          <div className="relative z-10 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
            <div className="max-w-2xl mx-auto text-center">
              <h1 
                className={`text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl ${isAnimated ? 'animate-enter' : 'opacity-0'}`}
                style={{ transitionDelay: '0.2s' }}
              >
                Plan Your Perfect Trip
              </h1>
              <p 
                className={`mt-6 text-xl text-white ${isAnimated ? 'animate-enter' : 'opacity-0'}`}
                style={{ transitionDelay: '0.4s' }}
              >
                Create personalized travel itineraries tailored to your preferences, budget, and time constraints.
              </p>
              <div 
                className={`mt-10 ${isAnimated ? 'animate-enter' : 'opacity-0'}`}
                style={{ transitionDelay: '0.6s' }}
              >
                <Link to="/preferences">
                  <Button className="bg-travel-primary hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full text-lg">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features section */}
        <div className="bg-white py-16 sm:py-24">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Plan Smarter, Travel Better
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                Our intelligent travel planner creates personalized itineraries based on your preferences.
              </p>
            </div>

            <div className="mt-16">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-travel-primary rounded-md shadow-lg">
                          <Calendar className="h-6 w-6 text-white" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Personalized Itineraries</h3>
                      <p className="mt-5 text-base text-gray-500">
                        Get custom travel plans based on your interests, budget, and available time.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-travel-secondary rounded-md shadow-lg">
                          <MapPin className="h-6 w-6 text-white" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Curated Activities</h3>
                      <p className="mt-5 text-base text-gray-500">
                        Discover the best attractions, restaurants, and experiences at your destination.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-travel-accent rounded-md shadow-lg">
                          <PieChart className="h-6 w-6 text-white" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Budget Management</h3>
                      <p className="mt-5 text-base text-gray-500">
                        Track your travel expenses and stay within your planned budget.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800">
        <div className="container max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-400">
            &copy; 2023 TripTailor. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
