
import { useState, useEffect } from "react";
import { format, addDays, differenceInDays } from "date-fns";
import { useTrip } from "@/contexts/TripContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Calendar, Clock, DollarSign, MapPin, Plus, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

// Mock activities data
const mockActivities = [
  {
    id: "a1",
    name: "Eiffel Tower Visit",
    description: "Enjoy panoramic views of Paris from the iconic Eiffel Tower.",
    location: "Champ de Mars, 5 Avenue Anatole France",
    image: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&q=80",
    price: 25,
    category: "attraction",
    duration: 3,
    rating: 4.7,
  },
  {
    id: "a2",
    name: "Louvre Museum",
    description: "Explore one of the world's largest art museums, home to thousands of works including the Mona Lisa.",
    location: "Rue de Rivoli, 75001 Paris",
    image: "https://images.unsplash.com/photo-1499856871958-5b9357976b82?auto=format&fit=crop&q=80",
    price: 17,
    category: "museum",
    duration: 4,
    rating: 4.8,
  },
  {
    id: "a3",
    name: "Seine River Cruise",
    description: "See Paris from a different perspective on a relaxing boat cruise along the Seine River.",
    location: "Port de la Conférence, Pont de l'Alma",
    image: "https://images.unsplash.com/photo-1499856871958-5b9357976b82?auto=format&fit=crop&q=80",
    price: 15,
    category: "tour",
    duration: 1,
    rating: 4.5,
  },
  {
    id: "a4",
    name: "Montmartre Walking Tour",
    description: "Discover the charming streets of Montmartre, famous for its artistic history and the Sacré-Cœur Basilica.",
    location: "Place du Tertre, 75018 Paris",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80",
    price: 0,
    category: "tour",
    duration: 2,
    rating: 4.6,
  },
  {
    id: "a5",
    name: "Dinner at Le Jules Verne",
    description: "Enjoy a gourmet dinner at this Michelin-starred restaurant inside the Eiffel Tower.",
    location: "Eiffel Tower, Avenue Gustave Eiffel",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80",
    price: 150,
    category: "dining",
    duration: 2,
    rating: 4.9,
  },
];

// Add missing import
import { v4 as uuidv4 } from 'uuid';

// Dummy implementation of uuidv4 since we don't have the actual dependency
function uuidv4() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const Itinerary = () => {
  const { trip, setTrip } = useTrip();
  const [days, setDays] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState("0");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize days based on trip dates
  useEffect(() => {
    if (trip) {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      const dayCount = differenceInDays(end, start) + 1;
      
      const daysArray = Array.from({ length: dayCount }, (_, i) => {
        const date = addDays(start, i);
        return format(date, "yyyy-MM-dd");
      });
      
      setDays(daysArray);
      
      // Generate sample itinerary if none exists
      if (trip.activities.length === 0) {
        generateSampleItinerary(daysArray);
      } else {
        setIsLoading(false);
      }
    }
  }, [trip?.startDate, trip?.endDate]);

  // Generate a sample itinerary
  const generateSampleItinerary = (daysArray: string[]) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (trip) {
        // Create a copy of mock activities with assigned dates for first two days
        const activitiesWithDates = [
          { ...mockActivities[0], id: uuidv4(), date: daysArray[0], timeSlot: "09:00" },
          { ...mockActivities[1], id: uuidv4(), date: daysArray[0], timeSlot: "14:00" },
          { ...mockActivities[2], id: uuidv4(), date: daysArray[1], timeSlot: "10:00" },
          { ...mockActivities[3], id: uuidv4(), date: daysArray[1], timeSlot: "15:00" },
        ];
        
        setTrip({
          ...trip,
          activities: activitiesWithDates,
        });
        
        setIsLoading(false);
        toast.success("Sample itinerary generated successfully!");
      }
    }, 1500);
  };

  // Get activities for a specific day
  const getActivitiesForDay = (date: string) => {
    return trip?.activities.filter(activity => activity.date === date) || [];
  };

  // Handle drag and drop
  const onDragEnd = (result: any) => {
    if (!result.destination || !trip) return;
    
    const { source, destination } = result;
    
    // If dropped in the same day, reorder
    if (source.droppableId === destination.droppableId) {
      const dayActivities = getActivitiesForDay(source.droppableId);
      const [reorderedItem] = dayActivities.splice(source.index, 1);
      dayActivities.splice(destination.index, 0, reorderedItem);
      
      // Update trip with new order
      const updatedActivities = trip.activities.filter(
        activity => activity.date !== source.droppableId
      ).concat(dayActivities);
      
      setTrip({
        ...trip,
        activities: updatedActivities,
      });
    } 
    // If dropped in a different day, change the date
    else {
      const sourceActivities = getActivitiesForDay(source.droppableId);
      const [movedActivity] = sourceActivities.splice(source.index, 1);
      
      // Update the date of the moved activity
      const updatedActivity = {
        ...movedActivity,
        date: destination.droppableId,
      };
      
      // Remove the activity from the old day and add to the new
      const updatedActivities = trip.activities
        .filter(activity => activity.id !== movedActivity.id)
        .concat(updatedActivity);
      
      setTrip({
        ...trip,
        activities: updatedActivities,
      });
      
      toast.success(`Moved "${updatedActivity.name}" to ${format(new Date(destination.droppableId), "EEEE, MMM d")}`);
    }
  };

  // Add a new activity
  const addActivity = (activity: any) => {
    if (!trip) return;
    
    // Add a new activity to the first day
    const newActivity = {
      ...activity,
      id: uuidv4(),
      date: days[parseInt(currentTab)],
      timeSlot: "12:00",
    };
    
    setTrip({
      ...trip,
      activities: [...trip.activities, newActivity],
    });
    
    setDialogOpen(false);
    toast.success(`Added "${newActivity.name}" to your itinerary`);
  };

  // Remove an activity
  const removeActivity = (activityId: string) => {
    if (!trip) return;
    
    const activityToRemove = trip.activities.find(a => a.id === activityId);
    
    setTrip({
      ...trip,
      activities: trip.activities.filter(activity => activity.id !== activityId),
    });
    
    if (activityToRemove) {
      toast.success(`Removed "${activityToRemove.name}" from your itinerary`);
    }
  };

  if (!trip) {
    return <div>No trip selected</div>;
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Your Itinerary</h1>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-travel-primary hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Activity to Itinerary</DialogTitle>
              <DialogDescription>
                Choose an activity to add to your itinerary for day {parseInt(currentTab) + 1}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {mockActivities.map((activity) => (
                <Card key={activity.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4" onClick={() => addActivity(activity)}>
                    <div className="aspect-video overflow-hidden rounded-md mb-3">
                      <img 
                        src={activity.image} 
                        alt={activity.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium">{activity.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{activity.duration} hour{activity.duration !== 1 ? 's' : ''}</span>
                      <span className="mx-2">•</span>
                      <DollarSign className="h-3 w-3 mr-1" />
                      <span>${activity.price}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-travel-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Generating your itinerary...</p>
        </div>
      ) : (
        <Tabs defaultValue="0" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="mb-6 flex overflow-x-auto space-x-1 pb-1">
            {days.map((day, index) => (
              <TabsTrigger 
                key={day} 
                value={index.toString()}
                className="flex-shrink-0"
              >
                <div className="text-center">
                  <div className="font-medium">Day {index + 1}</div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(day), "EEE, MMM d")}
                  </div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <DragDropContext onDragEnd={onDragEnd}>
            {days.map((day, index) => (
              <TabsContent key={day} value={index.toString()} className="mt-0">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Day {index + 1}: {format(new Date(day), "EEEE, MMMM d, yyyy")}
                  </h2>
                  
                  <Droppable droppableId={day}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4"
                      >
                        {getActivitiesForDay(day).length > 0 ? (
                          getActivitiesForDay(day).map((activity, activityIndex) => (
                            <Draggable
                              key={activity.id}
                              draggableId={activity.id}
                              index={activityIndex}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Card className="bg-white">
                                    <CardContent className="p-0">
                                      <div className="flex flex-col sm:flex-row">
                                        <div className="sm:w-1/4 h-32 sm:h-auto">
                                          <img 
                                            src={activity.image} 
                                            alt={activity.name}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                        <div className="p-4 sm:p-6 flex-1">
                                          <div className="flex justify-between items-start">
                                            <div>
                                              <h3 className="font-semibold text-lg">{activity.name}</h3>
                                              <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => removeActivity(activity.id)}
                                              className="text-gray-400 hover:text-red-500"
                                            >
                                              <Trash className="h-4 w-4" />
                                            </Button>
                                          </div>
                                          
                                          <div className="flex flex-wrap items-center mt-4 text-sm text-gray-500 gap-4">
                                            {activity.timeSlot && (
                                              <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-1" />
                                                <span>{activity.timeSlot}</span>
                                              </div>
                                            )}
                                            <div className="flex items-center">
                                              <MapPin className="h-4 w-4 mr-1" />
                                              <span>{activity.location}</span>
                                            </div>
                                            <div className="flex items-center">
                                              <DollarSign className="h-4 w-4 mr-1" />
                                              <span>${activity.price}</span>
                                            </div>
                                            <div className="flex items-center">
                                              <Clock className="h-4 w-4 mr-1" />
                                              <span>{activity.duration} hour{activity.duration !== 1 ? 's' : ''}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))
                        ) : (
                          <div className="bg-white border border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <Calendar className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                            <h3 className="text-lg font-medium text-gray-700 mb-1">No activities planned</h3>
                            <p className="text-gray-500 mb-4">Add activities to this day to start building your itinerary</p>
                            <Button onClick={() => setDialogOpen(true)} variant="outline">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Activity
                            </Button>
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </TabsContent>
            ))}
          </DragDropContext>
        </Tabs>
      )}
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Drag and drop activities to rearrange your itinerary or move them between days.</p>
      </div>
    </div>
  );
};

export default Itinerary;
