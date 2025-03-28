
import { useState, useEffect } from "react";
import { useTrip } from "@/contexts/TripContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Cell, Pie, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { DollarSign, TrendingUp, TrendingDown, Calendar, Users } from "lucide-react";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Budget = () => {
  const { trip, expenses } = useTrip();
  const [totalSpent, setTotalSpent] = useState(0);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [budgetPerDay, setBudgetPerDay] = useState(0);
  const [budgetPerPerson, setBudgetPerPerson] = useState(0);
  
  useEffect(() => {
    if (trip) {
      // Calculate total spent based on activities in the itinerary
      const activityCosts = trip.activities.reduce((total, activity) => total + activity.price, 0);
      
      // Add any additional expenses
      const additionalCosts = expenses.reduce((total, expense) => total + expense.amount, 0);
      
      setTotalSpent(activityCosts + additionalCosts);
      
      // Calculate budget per day
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      const tripDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
      setBudgetPerDay(trip.budget / tripDays);
      
      // Calculate budget per person
      setBudgetPerPerson(trip.budget / Math.max(1, trip.travelerCount));
      
      // Prepare data for pie chart - category breakdown
      const categories: { [key: string]: number } = {};
      
      // Add activity costs by category
      trip.activities.forEach(activity => {
        const category = activity.category || 'Other';
        categories[category] = (categories[category] || 0) + activity.price;
      });
      
      // Add additional expenses by category
      expenses.forEach(expense => {
        const category = expense.category || 'Other';
        categories[category] = (categories[category] || 0) + expense.amount;
      });
      
      const categoryArray = Object.keys(categories).map(key => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: categories[key],
      }));
      
      setCategoryData(categoryArray);
      
      // Prepare data for daily spending chart
      const dailySpending: { [key: string]: number } = {};
      
      // Group activities by date
      trip.activities.forEach(activity => {
        if (activity.date) {
          const date = activity.date;
          dailySpending[date] = (dailySpending[date] || 0) + activity.price;
        }
      });
      
      const dailyArray = Object.keys(dailySpending).map(date => ({
        name: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: dailySpending[date],
        date,
      }));
      
      // Sort by date
      dailyArray.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setDailyData(dailyArray);
    }
  }, [trip, expenses]);
  
  if (!trip) {
    return <div>No trip selected</div>;
  }
  
  // Calculate percentage of budget spent
  const percentSpent = Math.min(100, Math.round((totalSpent / trip.budget) * 100));
  const budgetStatus = totalSpent <= trip.budget ? 'on-budget' : 'over-budget';
  
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Budget Tracker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Budget Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Budget</p>
                <h3 className="text-2xl font-bold">${trip.budget.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <DollarSign className="h-6 w-6 text-travel-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Spent So Far Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Spent So Far</p>
                <h3 className="text-2xl font-bold">${totalSpent.toLocaleString()}</h3>
              </div>
              <div className={`p-2 rounded-full ${
                budgetStatus === 'on-budget' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {budgetStatus === 'on-budget' ? (
                  <TrendingDown className="h-6 w-6 text-green-600" />
                ) : (
                  <TrendingUp className="h-6 w-6 text-red-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Per Day Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Budget Per Day</p>
                <h3 className="text-2xl font-bold">${budgetPerDay.toLocaleString(undefined, {maximumFractionDigits: 0})}</h3>
              </div>
              <div className="p-2 bg-amber-100 rounded-full">
                <Calendar className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Per Person Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Budget Per Person</p>
                <h3 className="text-2xl font-bold">${budgetPerPerson.toLocaleString(undefined, {maximumFractionDigits: 0})}</h3>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Budget Progress */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">${totalSpent.toLocaleString()} spent</span>
              <span className="text-sm font-medium">${trip.budget.toLocaleString()} total</span>
            </div>
            <Progress value={percentSpent} className="h-3" />
            <div className="flex justify-between text-sm">
              <span
                className={`${
                  budgetStatus === 'on-budget' ? 'text-green-600' : 'text-red-600'
                } font-medium`}
              >
                {budgetStatus === 'on-budget' 
                  ? `${100 - percentSpent}% remaining` 
                  : `${percentSpent - 100}% over budget`}
              </span>
              <span>{percentSpent}% used</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="breakdown" className="mb-8">
        <TabsList>
          <TabsTrigger value="breakdown">Category Breakdown</TabsTrigger>
          <TabsTrigger value="daily">Daily Spending</TabsTrigger>
        </TabsList>
        
        <TabsContent value="breakdown" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => [`$${value}`, 'Amount']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No spending data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="daily" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {dailyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dailyData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any) => [`$${value}`, 'Amount']}
                      />
                      <Legend />
                      <Bar dataKey="amount" name="Spending" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No daily spending data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="text-center text-sm text-gray-500 mt-6">
        <p>This budget tracker shows your planned expenses based on activities in your itinerary.</p>
      </div>
    </div>
  );
};

export default Budget;
