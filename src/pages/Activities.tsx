
import { useState, useEffect } from "react";
import { useTrip } from "@/contexts/TripContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Star, Clock, MapPin, DollarSign, Plus } from "lucide-react";
import { toast } from "sonner";

const categoryIcons: { [key: string]: string } = {
  attraction: "🏛️",
  museum: "🖼️",
  tour: "🧭",
  dining: "🍽️",
  outdoor: "🌿",
  nightlife: "🌃",
  shopping: "🛍️",
};

// Mock data based on preferences
const mockActivitiesData = {
  nature: [
    {
      id: "n1",
      name: "Luxembourg Gardens",
      description: "Beautiful park with fountains, statues, and relaxing atmosphere.",
      location: "6th Arrondissement, Paris",
      image: "https://images.unsplash.com/photo-1519693360196-4ddb69a7a793?auto=format&fit=crop&q=80",
      price: 0,
      category: "outdoor",
      duration: 2,
      rating: 4.7,
    },
    {
      id: "n2",
      name: "Seine River Cruise",
      description: "Scenic boat tour along the Seine River offering unique views of Paris landmarks.",
      location: "Port de la Conférence, Pont de l'Alma",
      image: "https://images.unsplash.com/photo-1499856871958-5b9357976b82?auto=format&fit=crop&q=80",
      price: 15,
      category: "tour",
      duration: 1,
      rating: 4.5,
    },
  ],
  culture: [
    {
      id: "c1",
      name: "Louvre Museum",
      description: "World's largest art museum housing thousands of works including the Mona Lisa.",
      location: "Rue de Rivoli, 75001 Paris",
      image: "https://images.unsplash.com/photo-1499856871958-5b9357976b82?auto=format&fit=crop&q=80",
      price: 17,
      category: "museum",
      duration: 4,
      rating: 4.8,
    },
    {
      id: "c2",
      name: "Musée d'Orsay",
      description: "Museum housed in a former railway station, featuring impressionist masterpieces.",
      location: "1 Rue de la Légion d'Honneur, 75007 Paris",
      image: "https://images.unsplash.com/photo-1580628942689-8aa776dae4cc?auto=format&fit=crop&q=80",
      price: 16,
      category: "museum",
      duration: 3,
      rating: 4.7,
    },
  ],
  food: [
    {
      id: "f1",
      name: "Le Jules Verne",
      description: "Upscale dining with panoramic views inside the Eiffel Tower.",
      location: "Eiffel Tower, Avenue Gustave Eiffel",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80",
      price: 150,
      category: "dining",
      duration: 2,
      rating: 4.9,
    },
    {
      id: "f2",
      name: "Les Papilles",
      description: "Cozy bistro offering a fixed menu of seasonal French cuisine.",
      location: "30 Rue Gay-Lussac, 75005 Paris",
      image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80",
      price: 35,
      category: "dining",
      duration: 2,
      rating: 4.6,
    },
  ],
  adventure: [
    {
      id: "a1",
      name: "Hot Air Balloon Ride",
      description: "Unforgettable aerial views of Paris and surrounding countryside.",
      location: "Parc André Citroën, 75015 Paris",
      image: "https://images.unsplash.com/photo-1507608443039-bfde4fbcd142?auto=format&fit=crop&q=80",
      price: 250,
      category: "tour",
      duration: 3,
      rating: 4.9,
    },
    {
      id: "a2",
      name: "Paris Catacombs Skip-the-Line Tour",
      description: "Guided exploration of the underground tunnels lined with human remains.",
      location: "1 Avenue du Colonel Henri Rol-Tanguy, 75014 Paris",
      image: "https://images.unsplash.com/photo-1589405858862-f96c10407899?auto=format&fit=crop&q=80",
      price: 29,
      category: "tour",
      duration: 2,
      rating: 4.5,
    },
  ],
  relaxation: [
    {
      id: "r1",
      name: "Spa Day at Chuan",
      description: "Luxury spa treatments including massage, facial, and hydrotherapy.",
      location: "10 Rue de la Paix, 75002 Paris",
      image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80",
      price: 180,
      category: "outdoor",
      duration: 3,
      rating: 4.8,
    },
    {
      id: "r2",
      name: "Picnic at Champ de Mars",
      description: "Relaxing picnic with views of the Eiffel Tower.",
      location: "Champ de Mars, 75007 Paris",
      image: "https://images.unsplash.com/photo-1483648969698-5e7dcaa3444f?auto=format&fit=crop&q=80",
      price: 0,
      category: "outdoor",
      duration: 2,
      rating: 4.5,
    },
  ],
  shopping: [
    {
      id: "s1",
      name: "Galeries Lafayette",
      description: "Iconic department store with designer fashion and stunning architecture.",
      location: "40 Boulevard Haussmann, 75009 Paris",
      image: "https://images.unsplash.com/photo-1608505777887-8a53e7aaa47a?auto=format&fit=crop&q=80",
      price: 0,
      category: "shopping",
      duration: 3,
      rating: 4.6,
    },
    {
      id: "s2",
      name: "Le Marais Shopping Tour",
      description: "Explore trendy boutiques and vintage shops in this historic district.",
      location: "Le Marais, 75004 Paris",
      image: "https://images.unsplash.com/photo-1482304620417-5e2511ca9103?auto=format&fit=crop&q=80",
      price: 0,
      category: "shopping",
      duration: 3,
      rating: 4.4,
    },
  ],
  nightlife: [
    {
      id: "n1",
      name: "Moulin Rouge Show",
      description: "Legendary cabaret featuring the French cancan and elaborate costumes.",
      location: "82 Boulevard de Clichy, 75018 Paris",
      image: "https://images.unsplash.com/photo-1582977501629-b208b2790586?auto=format&fit=crop&q=80",
      price: 110,
      category: "nightlife",
      duration: 2,
      rating: 4.7,
    },
    {
      id: "n2",
      name: "Jazz Club at Le Caveau de la Huchette",
      description: "Historic jazz club featured in the film La La Land.",
      location: "5 Rue de la Huchette, 75005 Paris",
      image: "https://images.unsplash.com/photo-1598899246709-c8273815f3ef?auto=format&fit=crop&q=80",
      price: 15,
      category: "nightlife",
      duration: 3,
      rating: 4.6,
    },
  ],
  family: [
    {
      id: "f1",
      name: "Disneyland Paris",
      description: "Magical theme park with rides, shows, and Disney characters.",
      location: "Boulevard de Parc, 77700 Coupvray",
      image: "https://images.unsplash.com/photo-1568377210220-69b4c38c29a4?auto=format&fit=crop&q=80",
      price: 89,
      category: "attraction",
      duration: 8,
      rating: 4.6,
    },
    {
      id: "f2",
      name: "Jardin d'Acclimatation",
      description: "Amusement park and garden with rides, zoo animals, and play areas.",
      location: "Bois de Boulogne, 75116 Paris",
      image: "https://images.unsplash.com/photo-1594732832278-abd644401426?auto=format&fit=crop&q=80",
      price: 5,
      category: "outdoor",
      duration: 4,
      rating: 4.4,
    },
  ],
};

type ActivityType = {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string;
  price: number;
  category: string;
  duration: number;
  rating: number;
};

const Activities = () => {
  const { selectedPreferences, trip, addActivityToTrip } = useTrip();
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Load activities based on preferences
  useEffect(() => {
    if (selectedPreferences.length > 0) {
      // Simulate API call to get activities
      setIsLoading(true);
      
      setTimeout(() => {
        // Get activities for selected preferences
        const activitiesArray: ActivityType[] = [];
        
        selectedPreferences.forEach(prefId => {
          if (mockActivitiesData[prefId as keyof typeof mockActivitiesData]) {
            activitiesArray.push(...mockActivitiesData[prefId as keyof typeof mockActivitiesData]);
          }
        });
        
        // Remove duplicates
        const uniqueActivities = Array.from(new Map(activitiesArray.map(item => [item.id, item])).values());
        
        setActivities(uniqueActivities);
        setFilteredActivities(uniqueActivities);
        setIsLoading(false);
      }, 1000);
    } else {
      // If no preferences, show some default activities
      const defaultActivities = [
        ...mockActivitiesData.culture,
        ...mockActivitiesData.food,
        ...mockActivitiesData.nature,
      ];
      
      setActivities(defaultActivities);
      setFilteredActivities(defaultActivities);
      setIsLoading(false);
    }
  }, [selectedPreferences]);

  // Filter activities by search query and tab
  useEffect(() => {
    let filtered = activities;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        activity => 
          activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (currentTab !== "all") {
      filtered = filtered.filter(activity => activity.category === currentTab);
    }
    
    setFilteredActivities(filtered);
  }, [searchQuery, currentTab, activities]);

  // Get all unique categories from activities
  const categories = Array.from(new Set(activities.map(activity => activity.category)));

  // Add activity to trip
  const handleAddActivity = (activity: ActivityType) => {
    if (trip) {
      // Check if activity already exists in trip
      const alreadyAdded = trip.activities.some(a => a.id === activity.id);
      
      if (alreadyAdded) {
        toast.error("This activity is already in your itinerary");
        return;
      }
      
      addActivityToTrip(activity);
      toast.success(`Added "${activity.name}" to your itinerary`);
    }
  };

  if (!trip) {
    return <div>No trip selected</div>;
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Discover Activities</h1>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search activities, locations..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-6 flex overflow-x-auto space-x-1 pb-1">
          <TabsTrigger value="all" className="flex-shrink-0">
            All
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="flex-shrink-0"
            >
              <span className="mr-1">{categoryIcons[category] || "🏷️"}</span>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {renderActivityGrid(filteredActivities)}
        </TabsContent>
        
        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            {renderActivityGrid(filteredActivities)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
  
  function renderActivityGrid(activities: ActivityType[]) {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-travel-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading activities...</p>
        </div>
      );
    }
    
    if (activities.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">No activities found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <Card key={activity.id} className="overflow-hidden activity-card">
            <div className="aspect-video relative">
              <img 
                src={activity.image} 
                alt={activity.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-2 right-2 bg-travel-accent">
                {categoryIcons[activity.category] || "🏷️"} {activity.category}
              </Badge>
            </div>
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{activity.name}</h3>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{activity.rating}</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{activity.description}</p>
              
              <div className="flex flex-wrap text-sm text-gray-500 space-y-1 mb-4">
                <div className="flex items-center w-full">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{activity.location}</span>
                </div>
                <div className="flex items-center w-full sm:w-1/2">
                  <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span>{activity.duration} hour{activity.duration !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center w-full sm:w-1/2">
                  <DollarSign className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span>{activity.price > 0 ? `$${activity.price}` : 'Free'}</span>
                </div>
              </div>
              
              <Button 
                onClick={() => handleAddActivity(activity)} 
                className="w-full bg-travel-primary hover:bg-blue-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Itinerary
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
};

export default Activities;
