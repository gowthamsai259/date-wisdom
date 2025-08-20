import { useState, useEffect } from "react";
import { Calendar, Star, Users, History, Sparkles, ArrowLeft, X, ArrowUp } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DatePicker } from "@/components/DatePicker";
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

  const handleDateSelect = async (date: Date) => {
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
                        <h3 className="text-xl font-semibold mb-2" data-id={`famous-person-name-${index}`}>{person.name}</h3>
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
                        <h3 className="text-xl font-semibold mb-2" data-id={`historical-event-title-${index}`}>{event.event}</h3>
                        <p className="text-muted-foreground mb-3" data-id={`historical-event-description-${index}`}>
                          {event.description}
                        </p>
                        <Badge variant="outline" className="text-sm" data-id={`historical-event-year-${index}`}>
                          {event.year}
                        </Badge>
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
          <Card className="shadow-card" data-id="date-selection-card">
            <CardHeader className="text-center" data-id="date-selection-header">
              <CardTitle className="flex items-center justify-center space-x-2" data-id="date-selection-title">
                <Calendar className="h-5 w-5" />
                <span>Today's Insights</span>
              </CardTitle>
              <CardDescription data-id="date-selection-description">
                {format(selectedDate, "MMMM do, yyyy")} • Change date to explore other days
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center" data-id="date-selection-content">
              <DatePicker
                selected={selectedDate}
                onSelect={(date) => date && handleDateSelect(date)}
                placeholder="Pick a different date"
                data-id="date-picker"
              />
            </CardContent>
          </Card>
        </div>

        {/* Ad Space */}
        <div className="max-w-4xl mx-auto mb-8" data-id="ad-space-top">
          <Card className="bg-muted/50 border-dashed" data-id="ad-card-top">
            <CardContent className="py-8" data-id="ad-content-top">
              <div className="text-center text-muted-foreground" data-id="ad-text-top">
                <div className="text-sm font-medium mb-1">Advertisement Space</div>
                <div className="text-xs">Google Ads can be placed here</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="max-w-6xl mx-auto space-y-8" data-id="results-section">
          {/* Selected Date Display */}
          <div className="text-center" data-id="date-display-section">
            <h2 className="text-3xl font-bold mb-2" data-id="current-date-title">
              {format(selectedDate, "MMMM do, yyyy")}
            </h2>
            <p className="text-muted-foreground" data-id="date-subtitle">
              Exploring the significance of this day
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6" data-id="insights-grid">
            {/* Horoscope Section */}
            <Card className="shadow-card" data-id="horoscope-card">
              <CardHeader data-id="horoscope-header">
                <CardTitle className="flex items-center space-x-2" data-id="horoscope-title">
                  <Star className="h-5 w-5 text-primary" />
                  <span>Your Horoscope</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" data-id="horoscope-content">
                {loading ? (
                  <div className="space-y-3" data-id="horoscope-loading">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : birthdayData.horoscope ? (
                  <div className="space-y-4" data-id="horoscope-data">
                    <div className="text-center" data-id="horoscope-sign-section">
                      <Badge variant="secondary" className="text-lg px-4 py-2" data-id="horoscope-sign">
                        {birthdayData.horoscope.sign}
                      </Badge>
                    </div>
                    <p className="text-sm leading-relaxed" data-id="horoscope-text">
                      {birthdayData.horoscope.horoscope}
                    </p>
                    <div className="space-y-2" data-id="horoscope-details">
                      <div data-id="horoscope-traits-section">
                        <span className="font-medium text-xs">Key Traits:</span>
                        <div className="flex flex-wrap gap-1 mt-1" data-id="horoscope-traits-list">
                          {birthdayData.horoscope.traits.map((trait, index) => (
                            <Badge key={index} variant="outline" className="text-xs" data-id={`horoscope-trait-${index}`}>
                              {trait}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs" data-id="horoscope-lucky-color">
                        <span className="font-medium">Lucky Color:</span> {birthdayData.horoscope.luckyColor}
                      </div>
                      <div className="text-xs" data-id="horoscope-lucky-numbers">
                        <span className="font-medium">Lucky Numbers:</span> {birthdayData.horoscope.luckyNumbers.join(', ')}
                      </div>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Famous People Section */}
            <Card className="shadow-card" data-id="famous-people-card">
              <CardHeader data-id="famous-people-card-header">
                <CardTitle className="flex items-center space-x-2" data-id="famous-people-card-title">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Famous People</span>
                </CardTitle>
                <CardDescription data-id="famous-people-card-description">Born or died on this day</CardDescription>
              </CardHeader>
              <CardContent data-id="famous-people-card-content">
                {loading ? (
                  <div className="space-y-3" data-id="famous-people-loading">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="space-y-2" data-id={`famous-people-skeleton-${i}`}>
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3" data-id="famous-people-data">
                    <div className="max-h-80 overflow-y-auto space-y-3" data-id="famous-people-list-preview">
                      {birthdayData.famousPeople.slice(0, 5).map((person, index) => (
                        <div key={index} className="border-b border-border/50 pb-2 last:border-0" data-id={`famous-person-preview-${index}`}>
                          <div className="flex items-start justify-between" data-id={`famous-person-preview-layout-${index}`}>
                            <div className="flex-1 flex items-start gap-3" data-id={`famous-person-preview-content-${index}`}>
                              {person.imageUrl ? (
                                <img
                                  src={person.imageUrl}
                                  alt={person.name}
                                  className="w-12 h-12 rounded object-cover flex-shrink-0"
                                  data-id={`famous-person-preview-image-${index}`}
                                />
                              ) : null}
                              <div data-id={`famous-person-preview-info-${index}`}>
                                <h4 className="font-medium text-sm" data-id={`famous-person-preview-name-${index}`}>{person.name}</h4>
                                <p className="text-xs text-muted-foreground mt-1" data-id={`famous-person-preview-description-${index}`}>
                                  {person.description}
                                </p>
                              </div>
                            </div>
                            <Badge 
                              variant={person.type === 'birth' ? 'default' : 'secondary'}
                              className="text-xs ml-2"
                              data-id={`famous-person-preview-badge-${index}`}
                            >
                              {person.type === 'birth' ? 'Born' : 'Died'} {person.year}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    {birthdayData.famousPeople.length > 5 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => handleViewModeChange('famous-people')}
                        data-id="famous-people-view-more-button"
                      >
                        View More...
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Historical Events Section */}
            <Card className="shadow-card" data-id="historical-events-card">
              <CardHeader data-id="historical-events-card-header">
                <CardTitle className="flex items-center space-x-2" data-id="historical-events-card-title">
                  <History className="h-5 w-5 text-primary" />
                  <span>Historical Events</span>
                </CardTitle>
                <CardDescription data-id="historical-events-card-description">What happened on this day</CardDescription>
              </CardHeader>
              <CardContent data-id="historical-events-card-content">
                {loading ? (
                  <div className="space-y-3" data-id="historical-events-loading">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-2" data-id={`historical-events-skeleton-${i}`}>
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3" data-id="historical-events-data">
                    <div className="max-h-80 overflow-y-auto space-y-3" data-id="historical-events-list-preview">
                      {birthdayData.historicalEvents.slice(0, 5).map((event, index) => (
                        <div key={index} className="border-b border-border/50 pb-2 last:border-0" data-id={`historical-event-preview-${index}`}>
                          <div className="flex items-start justify-between" data-id={`historical-event-preview-layout-${index}`}>
                            <div className="flex-1 flex items-start gap-3" data-id={`historical-event-preview-content-${index}`}>
                              {event.imageUrl ? (
                                <img
                                  src={event.imageUrl}
                                  alt={event.event}
                                  className="w-12 h-12 rounded object-cover flex-shrink-0"
                                  data-id={`historical-event-preview-image-${index}`}
                                />
                              ) : null}
                              <div data-id={`historical-event-preview-info-${index}`}>
                                <h4 className="font-medium text-sm" data-id={`historical-event-preview-title-${index}`}>{event.event}</h4>
                                <p className="text-xs text-muted-foreground mt-1" data-id={`historical-event-preview-description-${index}`}>
                                  {event.description}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs ml-2" data-id={`historical-event-preview-year-${index}`}>
                              {event.year}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    {birthdayData.historicalEvents.length > 5 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => handleViewModeChange('historical-events')}
                        data-id="historical-events-view-more-button"
                      >
                        View More...
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bottom Ad Space */}
          <Card className="bg-muted/50 border-dashed" data-id="ad-card-bottom">
            <CardContent className="py-8" data-id="ad-content-bottom">
              <div className="text-center text-muted-foreground" data-id="ad-text-bottom">
                <div className="text-sm font-medium mb-1">Advertisement Space</div>
                <div className="text-xs">Google Ads Banner - 728x90</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      {showBackToTop && <BackToTopButton />}

      {/* Footer */}
      <footer className="bg-secondary/50 border-t mt-16" data-id="main-footer">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center" data-id="footer-content">
            <div className="flex items-center justify-center space-x-2 mb-4" data-id="footer-header">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold" data-id="footer-title">Birthday Insights</span>
            </div>
            <p className="text-sm text-muted-foreground" data-id="footer-description">
              Discover the magic of your special day
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};