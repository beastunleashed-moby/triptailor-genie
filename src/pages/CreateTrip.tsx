
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useTrip } from "@/contexts/TripContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { CalendarIcon, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const destinations = [
  { id: "paris", name: "Paris, France", image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80" },
  { id: "tokyo", name: "Tokyo, Japan", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80" },
  { id: "nyc", name: "New York City, USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80" },
  { id: "rome", name: "Rome, Italy", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80" },
  { id: "bali", name: "Bali, Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80" },
  { id: "barcelona", name: "Barcelona, Spain", image: "https://images.unsplash.com/photo-1560979710-ccfb4627c4d8?auto=format&fit=crop&q=80" },
];

const CreateTrip = () => {
  const navigate = useNavigate();
  const { setTrip, budget, selectedPreferences, preferences } = useTrip();
  
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [travelerCount, setTravelerCount] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!tripName) newErrors.tripName = "Trip name is required";
    if (!destination) newErrors.destination = "Destination is required";
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";
    
    if (startDate && endDate && startDate > endDate) {
      newErrors.endDate = "End date must be after start date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateTrip = () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Generate a random ID
    const id = Math.random().toString(36).substring(2, 9);
    
    // Create new trip
    setTrip({
      id,
      name: tripName,
      destination: destinations.find(d => d.id === destination)?.name || destination,
      startDate: startDate!.toISOString(),
      endDate: endDate!.toISOString(),
      budget,
      activities: [],
      travelerCount,
    });
    
    // Simulate loading and navigate to itinerary
    setTimeout(() => {
      setIsLoading(false);
      navigate("/itinerary");
    }, 1000);
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Your Trip</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="tripName">Trip Name</Label>
            <Input
              id="tripName"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              placeholder="Summer Vacation 2023"
              className={errors.tripName ? "border-red-500" : ""}
            />
            {errors.tripName && <p className="text-sm text-red-500">{errors.tripName}</p>}
          </div>
          
          <div className="space-y-2">
            <Label>Destination</Label>
            <Select
              value={destination}
              onValueChange={setDestination}
            >
              <SelectTrigger className={errors.destination ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a destination" />
              </SelectTrigger>
              <SelectContent>
                {destinations.map((dest) => (
                  <SelectItem key={dest.id} value={dest.id}>
                    {dest.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.destination && <p className="text-sm text-red-500">{errors.destination}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground",
                      errors.startDate && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground",
                      errors.endDate && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => date < new Date() || (startDate && date < startDate)}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="travelers">Number of Travelers</Label>
            <Select
              value={travelerCount.toString()}
              onValueChange={(value) => setTravelerCount(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select number of travelers" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "traveler" : "travelers"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleCreateTrip} 
            className="w-full bg-travel-primary hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Creating Trip..." : "Create Trip"}
          </Button>
        </div>
        
        {/* Destination preview */}
        <div className="hidden md:block">
          {destination ? (
            <div className="rounded-lg overflow-hidden shadow-lg h-80 relative">
              <img 
                src={destinations.find(d => d.id === destination)?.image} 
                alt={destinations.find(d => d.id === destination)?.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <div className="flex items-center">
                  <MapPin className="text-white mr-2" />
                  <h3 className="text-xl font-semibold text-white">
                    {destinations.find(d => d.id === destination)?.name}
                  </h3>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-gray-100 h-80 flex items-center justify-center">
              <p className="text-gray-500">Select a destination to see preview</p>
            </div>
          )}
          
          {selectedPreferences.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Your Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {selectedPreferences.map((prefId) => {
                  const pref = preferences.find(p => p.id === prefId);
                  return pref ? (
                    <div key={pref.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                      <span className="mr-1">{pref.icon}</span>
                      {pref.name}
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
