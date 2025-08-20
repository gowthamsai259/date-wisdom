import { useState } from "react";
import { Calendar, Star, Users, History, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DatePicker } from "@/components/DatePicker";
import { getFamousPeople, getHoroscope, getHistoricalEvents, type FamousPerson, type HistoricalEvent, type ZodiacSign } from "@/services/birthdayApi";

interface BirthdayData {
  horoscope: ZodiacSign | null;
  famousPeople: FamousPerson[];
  historicalEvents: HistoricalEvent[];
}

export const BirthdayInsights = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [birthdayData, setBirthdayData] = useState<BirthdayData>({
    horoscope: null,
    famousPeople: [],
    historicalEvents: []
  });
  const [loading, setLoading] = useState(false);

  const handleDateSelect = async (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    setLoading(true);
    
    try {
      // Fetch all data in parallel
      const [horoscope, famousPeople, historicalEvents] = await Promise.all([
        getHoroscope(date),
        getFamousPeople(date),
        getHistoricalEvents(date)
      ]);
      
      setBirthdayData({
        horoscope,
        famousPeople,
        historicalEvents
      });
    } catch (error) {
      console.error('Error fetching birthday data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Birthday Insights
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Date Selection */}
        <div className="max-w-md mx-auto mb-8">
          <Card className="shadow-card">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Select Your Birthday</span>
              </CardTitle>
              <CardDescription>
                Discover what makes your special day unique
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <DatePicker
                selected={selectedDate}
                onSelect={handleDateSelect}
                placeholder="Pick your birthday"
              />
            </CardContent>
          </Card>
        </div>

        {/* Ad Space */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                <div className="text-sm font-medium mb-1">Advertisement Space</div>
                <div className="text-xs">Google Ads can be placed here</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {selectedDate && (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Selected Date Display */}
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">
                {format(selectedDate, "MMMM do, yyyy")}
              </h2>
              <p className="text-muted-foreground">
                Exploring the significance of your special day
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Horoscope Section */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-primary" />
                    <span>Your Horoscope</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : birthdayData.horoscope ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <Badge variant="secondary" className="text-lg px-4 py-2">
                          {birthdayData.horoscope.sign}
                        </Badge>
                      </div>
                      <p className="text-sm leading-relaxed">
                        {birthdayData.horoscope.horoscope}
                      </p>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium text-xs">Key Traits:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {birthdayData.horoscope.traits.map((trait, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {trait}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-xs">
                          <span className="font-medium">Lucky Color:</span> {birthdayData.horoscope.luckyColor}
                        </div>
                        <div className="text-xs">
                          <span className="font-medium">Lucky Numbers:</span> {birthdayData.horoscope.luckyNumbers.join(', ')}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              {/* Famous People Section */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Famous People</span>
                  </CardTitle>
                  <CardDescription>Born or died on this day</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {birthdayData.famousPeople.map((person, index) => (
                        <div key={index} className="border-b border-border/50 pb-2 last:border-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{person.name}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {person.description}
                              </p>
                            </div>
                            <Badge 
                              variant={person.type === 'birth' ? 'default' : 'secondary'}
                              className="text-xs ml-2"
                            >
                              {person.type === 'birth' ? 'Born' : 'Died'} {person.year}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Historical Events Section */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <History className="h-5 w-5 text-primary" />
                    <span>Historical Events</span>
                  </CardTitle>
                  <CardDescription>What happened on this day</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-2/3" />
                          <Skeleton className="h-3 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {birthdayData.historicalEvents.map((event, index) => (
                        <div key={index} className="border-b border-border/50 pb-2 last:border-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{event.event}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {event.description}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs ml-2">
                              {event.year}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Bottom Ad Space */}
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  <div className="text-sm font-medium mb-1">Advertisement Space</div>
                  <div className="text-xs">Google Ads Banner - 728x90</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-secondary/50 border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold">Birthday Insights</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Discover the magic of your special day
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};