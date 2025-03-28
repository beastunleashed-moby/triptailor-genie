
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTrip } from "@/contexts/TripContext";
import { Card, CardContent } from "@/components/ui/card";

const Preferences = () => {
  const navigate = useNavigate();
  const { preferences, selectedPreferences, setSelectedPreferences, setBudget } = useTrip();
  const [selectedBudget, setSelectedBudget] = useState<string>("medium");
  const [isLoading, setIsLoading] = useState(false);

  const togglePreference = (preferenceId: string) => {
    if (selectedPreferences.includes(preferenceId)) {
      setSelectedPreferences(selectedPreferences.filter(id => id !== preferenceId));
    } else {
      setSelectedPreferences([...selectedPreferences, preferenceId]);
    }
  };

  const handleBudgetChange = (budget: string) => {
    setSelectedBudget(budget);
    
    // Set budget amount based on selection
    switch (budget) {
      case "low":
        setBudget(1000);
        break;
      case "medium":
        setBudget(3000);
        break;
      case "high":
        setBudget(5000);
        break;
      case "luxury":
        setBudget(10000);
        break;
      default:
        setBudget(3000);
    }
  };

  const handleContinue = () => {
    if (selectedPreferences.length === 0) {
      alert("Please select at least one preference");
      return;
    }

    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      navigate("/create-trip");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">Tell us about your travel preferences</h1>
          <p className="mt-2 text-lg text-gray-600">
            This will help us create a personalized travel experience for you.
          </p>
        </div>
        
        <div className="space-y-8">
          {/* Travel interests */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">What are you interested in?</h2>
            <p className="text-gray-600 mb-4">Select all that apply</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {preferences.map((preference) => (
                <div 
                  key={preference.id}
                  onClick={() => togglePreference(preference.id)}
                  className={`
                    cursor-pointer rounded-lg border-2 p-4 text-center transition-all
                    ${selectedPreferences.includes(preference.id) 
                      ? 'border-travel-primary bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'}
                  `}
                >
                  <div className="text-3xl mb-2">{preference.icon}</div>
                  <div className="font-medium text-sm">{preference.name}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Budget */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">What's your budget range?</h2>
            <p className="text-gray-600 mb-4">This helps us recommend suitable activities and accommodations</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: "low", label: "Budget", description: "Under $1,000", icon: "$" },
                { id: "medium", label: "Moderate", description: "$1,000 - $3,000", icon: "$$" },
                { id: "high", label: "Upscale", description: "$3,000 - $5,000", icon: "$$$" },
                { id: "luxury", label: "Luxury", description: "$5,000+", icon: "$$$$" },
              ].map((budget) => (
                <Card 
                  key={budget.id}
                  onClick={() => handleBudgetChange(budget.id)}
                  className={`cursor-pointer transition-all hover:-translate-y-1 ${
                    selectedBudget === budget.id 
                      ? 'border-2 border-travel-primary shadow-md' 
                      : 'border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="text-xl font-bold text-center mb-1">{budget.icon}</div>
                    <h3 className="font-semibold text-center">{budget.label}</h3>
                    <p className="text-sm text-gray-500 text-center">{budget.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="pt-6 flex justify-end">
            <Button 
              onClick={handleContinue}
              className="bg-travel-primary hover:bg-blue-600 px-6"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Continue"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
