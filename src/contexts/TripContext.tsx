
import React, { createContext, useContext, useState, ReactNode } from "react";

export type Preference = {
  id: string;
  name: string;
  icon: string;
};

export type Activity = {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string;
  price: number;
  category: string;
  duration: number;
  rating: number;
  date?: string;
  timeSlot?: string;
};

export type Trip = {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  activities: Activity[];
  travelerCount: number;
};

type TripContextType = {
  preferences: Preference[];
  setPreferences: React.Dispatch<React.SetStateAction<Preference[]>>;
  selectedPreferences: string[];
  setSelectedPreferences: React.Dispatch<React.SetStateAction<string[]>>;
  trip: Trip | null;
  setTrip: React.Dispatch<React.SetStateAction<Trip | null>>;
  budget: number;
  setBudget: React.Dispatch<React.SetStateAction<number>>;
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  addActivityToTrip: (activity: Activity) => void;
  removeActivityFromTrip: (activityId: string) => void;
  expenses: { category: string; amount: number }[];
  addExpense: (category: string, amount: number) => void;
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return context;
};

type TripProviderProps = {
  children: ReactNode;
};

export const TripProvider = ({ children }: TripProviderProps) => {
  const [preferences, setPreferences] = useState<Preference[]>([
    { id: "nature", name: "Nature & Outdoors", icon: "🌿" },
    { id: "culture", name: "Culture & History", icon: "🏛️" },
    { id: "food", name: "Food & Dining", icon: "🍽️" },
    { id: "adventure", name: "Adventure", icon: "🧗‍♀️" },
    { id: "relaxation", name: "Relaxation", icon: "🧘‍♂️" },
    { id: "shopping", name: "Shopping", icon: "🛍️" },
    { id: "nightlife", name: "Nightlife", icon: "🌃" },
    { id: "family", name: "Family Friendly", icon: "👨‍👩‍👧‍👦" },
  ]);
  
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [budget, setBudget] = useState<number>(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [expenses, setExpenses] = useState<{ category: string; amount: number }[]>([]);

  const addActivityToTrip = (activity: Activity) => {
    if (trip) {
      setTrip({
        ...trip,
        activities: [...trip.activities, activity],
      });
    }
  };

  const removeActivityFromTrip = (activityId: string) => {
    if (trip) {
      setTrip({
        ...trip,
        activities: trip.activities.filter((a) => a.id !== activityId),
      });
    }
  };

  const addExpense = (category: string, amount: number) => {
    setExpenses([...expenses, { category, amount }]);
  };

  return (
    <TripContext.Provider
      value={{
        preferences,
        setPreferences,
        selectedPreferences,
        setSelectedPreferences,
        trip,
        setTrip,
        budget,
        setBudget,
        activities,
        setActivities,
        addActivityToTrip,
        removeActivityFromTrip,
        expenses,
        addExpense,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};
