import { useState, useEffect } from "react";
import { Calendar, Star, Users, History, Sparkles, ArrowLeft, X, ArrowUp, ExternalLink } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "@/components/DatePicker";
import { AgeCalculationSection } from "@/components/AgeCalculationSection";
import { BirthdayCardGenerator } from "@/components/BirthdayCardGenerator";
import { fetchDailyHoroscope, fetchFamousPeopleForDate, fetchHistoricalEventsForDate, type FamousPerson, type HistoricalEvent, type ZodiacSign } from "@/services/birthdayApi";

interface BirthdayData {
  horoscope: ZodiacSign | null;
  famousPeople: FamousPerson[];
  historicalEvents: HistoricalEvent[];
}

type ViewMode = 'home' | 'famous-people' | 'historical-events';

export const BirthdayInsights = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [birthdayData, setBirthdayData] = useState<BirthdayData>({
    horoscope: null,
    famousPeople: [],
    historicalEvents: []
  });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [visibleHistoricalEvents, setVisibleHistoricalEvents] = useState<number>(10);
  const [loadingMoreEvents, setLoadingMoreEvents] = useState(false);
  const [visibleFamousPeople, setVisibleFamousPeople] = useState<number>(10);
  const [loadingMorePeople, setLoadingMorePeople] = useState(false);
  const isMobile = useIsMobile();

  // Auto-load today's data on component mount
  useEffect(() => {
    handleDateSelect(new Date());
  }, []);

  // Handle scroll detection for back to top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowBackToTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle lazy loading for historical events
  useEffect(() => {
    if (viewMode !== 'historical-events') return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Load more when user is near bottom (within 200px)
      if (scrollTop + windowHeight >= documentHeight - 200) {
        loadMoreEvents();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [viewMode, visibleHistoricalEvents, birthdayData.historicalEvents.length]);

  // Handle lazy loading for famous people
  useEffect(() => {
    if (viewMode !== 'famous-people') return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Load more when user is near bottom (within 200px)
      if (scrollTop + windowHeight >= documentHeight - 200) {
        loadMorePeople();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [viewMode, visibleFamousPeople, birthdayData.famousPeople.length]);

  const loadMoreEvents = () => {
    if (loadingMoreEvents || visibleHistoricalEvents >= birthdayData.historicalEvents.length) return;
    
    setLoadingMoreEvents(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleHistoricalEvents(prev => Math.min(prev + 10, birthdayData.historicalEvents.length));
      setLoadingMoreEvents(false);
    }, 500);
  };

  const loadMorePeople = () => {
    if (loadingMorePeople || visibleFamousPeople >= birthdayData.famousPeople.length) return;
    
    setLoadingMorePeople(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleFamousPeople(prev => Math.min(prev + 10, birthdayData.famousPeople.length));
      setLoadingMorePeople(false);
    }, 500);
  };

  const handleDateSelect = async (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    setLoading(true);
    
    try {
      // Fetch all data in parallel
      const [horoscope, famousPeople, historicalEvents] = await Promise.all([
        fetchDailyHoroscope(date),
        fetchFamousPeopleForDate(date),
        fetchHistoricalEventsForDate(date)
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

  const handleBackToHome = () => {
    setViewMode('home');
    setVisibleHistoricalEvents(10); // Reset lazy loading
    setVisibleFamousPeople(10); // Reset lazy loading
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === 'historical-events') {
      setVisibleHistoricalEvents(10); // Reset to initial load
    } else if (mode === 'famous-people') {
      setVisibleFamousPeople(10); // Reset to initial load
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Back to Top Button Component
  const BackToTopButton = () => (
    <Button
      onClick={handleBackToTop}
      className="fixed bottom-6 right-6 z-50 rounded-full w-12 h-12 shadow-lg bg-primary hover:bg-primary/90 transition-all duration-300 animate-in slide-in-from-bottom-4"
      data-id="back-to-top-button"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );

  // Full Screen Famous People View
  if (viewMode === 'famous-people') {
    return (
      <div className="min-h-screen bg-gradient-secondary animate-in slide-in-from-right duration-500" data-id="famous-people-full-view">
        {/* Sticky Back Button */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b" data-id="famous-people-header">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToHome}
                className="flex items-center space-x-2"
                data-id="famous-people-back-button"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <h1 className="text-xl font-bold" data-id="famous-people-title">Famous People</h1>
              <div className="w-20"></div> {/* Spacer for centering */}
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8" data-id="famous-people-main">
          <div className="max-w-4xl mx-auto" data-id="famous-people-container">
            <div className="text-center mb-8" data-id="famous-people-header-section">
              <h2 className="text-3xl font-bold mb-2" data-id="famous-people-date-title">
                {selectedDate ? format(selectedDate, "MMMM do, yyyy") : "Famous People"}
              </h2>
              <p className="text-muted-foreground" data-id="famous-people-subtitle">
                Notable people born or died on this day
              </p>
            </div>

            <div className="space-y-4" data-id="famous-people-list">
              {birthdayData.famousPeople.slice(0, visibleFamousPeople).map((person, index) => (
                <Card key={index} className="shadow-card animate-in slide-in-from-bottom duration-300 delay-100" data-id={`famous-person-card-${index}`}>
                  <CardContent className="p-6" data-id={`famous-person-content-${index}`}>
                    <div className="flex items-start gap-4" data-id={`famous-person-layout-${index}`}>
                      {person.imageUrl && (
                        <img
                          src={person.imageUrl}
                          alt={person.name}
                          className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                          data-id={`famous-person-image-${index}`}
                        />
                      )}
                      <div className="flex-1" data-id={`famous-person-info-${index}`}>
                        <div className="flex items-center space-x-2 mb-2">
                          {person.wikipediaUrl && (person.wikipediaUrl.desktop || person.wikipediaUrl.mobile) ? (
                            <a
                              href={isMobile ? person.wikipediaUrl.mobile : person.wikipediaUrl.desktop}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xl font-semibold text-primary hover:text-primary/80 transition-colors"
                              data-id={`famous-person-name-${index}`}
                            >
                              {person.name}
                            </a>
                          ) : (
                            <h3 className="text-xl font-semibold text-primary" data-id={`famous-person-name-${index}`}>{person.name}</h3>
                          )}
                          {person.wikipediaUrl && (person.wikipediaUrl.desktop || person.wikipediaUrl.mobile) && (
                            <a
                              href={isMobile ? person.wikipediaUrl.mobile : person.wikipediaUrl.desktop}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 transition-colors"
                              data-id={`famous-person-wiki-button-${index}`}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-3" data-id={`famous-person-description-${index}`}>
                          {person.description}
                        </p>
                        <div className="flex items-center space-x-2" data-id={`famous-person-badges-${index}`}>
                          <Badge 
                            variant={person.type === 'birth' ? 'default' : 'secondary'}
                            className="text-sm"
                            data-id={`famous-person-type-${index}`}
                          >
                            {person.type === 'birth' ? 'Born' : 'Died'}
                          </Badge>
                          <span className="text-sm font-medium" data-id={`famous-person-year-${index}`}>{person.year}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {loadingMorePeople && (
                <div className="text-center py-4">
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </div>
              )}
            </div>
          </div>
        </main>
        {showBackToTop && <BackToTopButton />}
      </div>
    );
  }

  // Full Screen Historical Events View
  if (viewMode === 'historical-events') {
    return (
      <div className="min-h-screen bg-gradient-secondary animate-in slide-in-from-right duration-500" data-id="historical-events-full-view">
        {/* Sticky Back Button */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b" data-id="historical-events-header">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToHome}
                className="flex items-center space-x-2"
                data-id="historical-events-back-button"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <h1 className="text-xl font-bold" data-id="historical-events-title">Historical Events</h1>
              <div className="w-20"></div> {/* Spacer for centering */}
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8" data-id="historical-events-main">
          <div className="max-w-4xl mx-auto" data-id="historical-events-container">
            <div className="text-center mb-8" data-id="historical-events-header-section">
              <h2 className="text-3xl font-bold mb-2" data-id="historical-events-date-title">
                {selectedDate ? format(selectedDate, "MMMM do, yyyy") : "Historical Events"}
              </h2>
              <p className="text-muted-foreground" data-id="historical-events-subtitle">
                Significant events that occurred on this day
              </p>
            </div>

            <div className="space-y-4" data-id="historical-events-list">
              {birthdayData.historicalEvents.slice(0, visibleHistoricalEvents).map((event, index) => (
                <Card key={index} className="shadow-card animate-in slide-in-from-bottom duration-300 delay-100" data-id={`historical-event-card-${index}`}>
                  <CardContent className="p-6" data-id={`historical-event-content-${index}`}>
                    <div className="flex items-start gap-4" data-id={`historical-event-layout-${index}`}>
                      {event.imageUrl && (
                        <img
                          src={event.imageUrl}
                          alt={event.event}
                          className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                          data-id={`historical-event-image-${index}`}
                        />
                      )}
                      <div className="flex-1" data-id={`historical-event-info-${index}`}>
                        <div className="flex items-center space-x-2 mb-2">
                          {event.wikipediaUrl && (event.wikipediaUrl.desktop || event.wikipediaUrl.mobile) ? (
                            <a
                              href={isMobile ? event.wikipediaUrl.mobile : event.wikipediaUrl.desktop}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xl font-semibold text-primary hover:text-primary/80 transition-colors"
                              data-id={`historical-event-title-${index}`}
                            >
                              {event.event}
                            </a>
                          ) : (
                            <h3 className="text-xl font-semibold text-primary" data-id={`historical-event-title-${index}`}>{event.event}</h3>
                          )}
                          {event.wikipediaUrl && (event.wikipediaUrl.desktop || event.wikipediaUrl.mobile) && (
                            <a
                              href={isMobile ? event.wikipediaUrl.mobile : event.wikipediaUrl.desktop}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 transition-colors"
                              data-id={`historical-event-wiki-button-${index}`}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-3" data-id={`historical-event-description-${index}`}>
                          {event.description}
                        </p>
                        <div className="flex items-center space-x-2" data-id={`historical-event-badges-${index}`}>
                          <Badge variant="outline" className="text-sm" data-id={`historical-event-year-${index}`}>
                            {event.year}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {loadingMoreEvents && (
                <div className="text-center py-4">
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </div>
              )}
            </div>
          </div>
        </main>
        {showBackToTop && <BackToTopButton />}
      </div>
    );
  }

  // Home View
  return (
    <div className="min-h-screen bg-gradient-secondary animate-in slide-in-from-left duration-500" data-id="home-view">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b" data-id="main-header">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2" data-id="header-content">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent" data-id="app-title">
                Birthday Insights
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8" data-id="main-content">
        {/* Date Selection */}
        <div className="max-w-md mx-auto mb-8" data-id="date-selection-section">
          <Card className="shadow-card animate-in slide-in-from-top duration-500" data-id="date-picker-card">
            <CardHeader className="text-center" data-id="date-picker-header">
              <CardTitle className="flex items-center justify-center space-x-2" data-id="date-picker-title">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Select Your Birthday</span>
              </CardTitle>
              <CardDescription data-id="date-picker-description">
                Discover fascinating insights about your special day
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center" data-id="date-picker-content">
              <DatePicker 
                selected={selectedDate} 
                onSelect={handleDateSelect}
                data-id="date-picker-component"
              />
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="life-analysis" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="life-analysis">Life Analysis</TabsTrigger>
            <TabsTrigger value="card-generator">Birthday Card</TabsTrigger>
            <TabsTrigger value="significance">Significance</TabsTrigger>
          </TabsList>

          {/* Life Analysis Tab */}
          <TabsContent value="life-analysis" className="space-y-8">
            {selectedDate && <AgeCalculationSection birthDate={selectedDate} />}
            
            {/* Horoscope Section */}
            {!loading && birthdayData.horoscope && (
              <div className="animate-in slide-in-from-bottom duration-500 delay-300">
                <Card className="shadow-card">
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center space-x-2">
                      <Star className="h-5 w-5 text-primary" />
                      <span>Your Zodiac Sign</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="text-6xl">⭐</div>
                      <h3 className="text-2xl font-bold text-primary">{birthdayData.horoscope.sign}</h3>
                      <p className="text-muted-foreground max-w-2xl mx-auto">
                        {birthdayData.horoscope.horoscope}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="p-4 rounded-lg bg-muted/50">
                          <h4 className="font-semibold text-primary mb-2">Traits</h4>
                          <div className="flex flex-wrap gap-2">
                            {birthdayData.horoscope.traits.map((trait, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {trait}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <h4 className="font-semibold text-primary mb-2">Lucky Color</h4>
                          <Badge variant="outline" className="text-xs">
                            {birthdayData.horoscope.luckyColor}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Birthday Card Generator Tab */}
          <TabsContent value="card-generator">
            <BirthdayCardGenerator birthDate={selectedDate} />
          </TabsContent>

          {/* Significance Tab */}
          <TabsContent value="significance" className="space-y-8">
            {/* Famous People Section */}
            {!loading && birthdayData.famousPeople.length > 0 && (
              <div className="animate-in slide-in-from-bottom duration-500 delay-500">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-primary" />
                        <span>Famous People</span>
                      </div>
                      {birthdayData.famousPeople.length > 3 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewModeChange('famous-people')}
                        >
                          View All ({birthdayData.famousPeople.length})
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {birthdayData.famousPeople.slice(0, 3).map((person, index) => (
                        <Card key={index} className="border-muted hover:border-primary/20 transition-colors">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              {person.imageUrl && (
                                <div className="aspect-[16/9] relative overflow-hidden rounded-lg">
                                  <img
                                    src={person.imageUrl}
                                    alt={person.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  {person.wikipediaUrl && (person.wikipediaUrl.desktop || person.wikipediaUrl.mobile) ? (
                                    <a
                                      href={isMobile ? person.wikipediaUrl.mobile : person.wikipediaUrl.desktop}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-semibold text-primary hover:text-primary/80 transition-colors"
                                    >
                                      {person.name}
                                    </a>
                                  ) : (
                                    <h3 className="font-semibold text-primary">{person.name}</h3>
                                  )}
                                  {person.wikipediaUrl && (person.wikipediaUrl.desktop || person.wikipediaUrl.mobile) && (
                                    <a
                                      href={isMobile ? person.wikipediaUrl.mobile : person.wikipediaUrl.desktop}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary hover:text-primary/80 transition-colors"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {person.description}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge 
                                    variant={person.type === 'birth' ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {person.type === 'birth' ? 'Born' : 'Died'}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">{person.year}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Historical Events Section */}
            {!loading && birthdayData.historicalEvents.length > 0 && (
              <div className="animate-in slide-in-from-bottom duration-500 delay-700">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <History className="h-5 w-5 text-primary" />
                        <span>Historical Events</span>
                      </div>
                      {birthdayData.historicalEvents.length > 3 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewModeChange('historical-events')}
                        >
                          View All ({birthdayData.historicalEvents.length})
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {birthdayData.historicalEvents.slice(0, 3).map((event, index) => (
                        <Card key={index} className="border-muted hover:border-primary/20 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              {event.imageUrl && (
                                <img
                                  src={event.imageUrl}
                                  alt={event.event}
                                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                                />
                              )}
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  {event.wikipediaUrl && (event.wikipediaUrl.desktop || event.wikipediaUrl.mobile) ? (
                                    <a
                                      href={isMobile ? event.wikipediaUrl.mobile : event.wikipediaUrl.desktop}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-semibold text-primary hover:text-primary/80 transition-colors line-clamp-2"
                                    >
                                      {event.event}
                                    </a>
                                  ) : (
                                    <h3 className="font-semibold text-primary line-clamp-2">{event.event}</h3>
                                  )}
                                  {event.wikipediaUrl && (event.wikipediaUrl.desktop || event.wikipediaUrl.mobile) && (
                                    <a
                                      href={isMobile ? event.wikipediaUrl.mobile : event.wikipediaUrl.desktop}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary hover:text-primary/80 transition-colors flex-shrink-0"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                  {event.description}
                                </p>
                                <Badge variant="outline" className="text-xs">
                                  {event.year}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      {showBackToTop && <BackToTopButton />}
    </div>
  );
};