// Birthday API service functions
export interface FamousPerson {
  name: string;
  year: number;
  description: string;
  type: 'birth' | 'death';
  imageUrl?: string;
  wikipediaUrl?: {
    desktop: string;
    mobile: string;
  };
}

export interface HistoricalEvent {
  year: number;
  event: string;
  description: string;
  imageUrl?: string;
  wikipediaUrl?: {
    desktop: string;
    mobile: string;
  };
}

export interface ZodiacSign {
  sign: string;
  horoscope: string;
  traits: string[];
  luckyNumbers: number[];
  luckyColor: string;
}

// Get zodiac sign based on date
export const getZodiacSign = (month: number, day: number): string => {
  const zodiacDates = [
    { sign: 'Capricorn', start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
    { sign: 'Aquarius', start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
    { sign: 'Pisces', start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
    { sign: 'Aries', start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
    { sign: 'Taurus', start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
    { sign: 'Gemini', start: { month: 5, day: 21 }, end: { month: 6, day: 20 } },
    { sign: 'Cancer', start: { month: 6, day: 21 }, end: { month: 7, day: 22 } },
    { sign: 'Leo', start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
    { sign: 'Virgo', start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
    { sign: 'Libra', start: { month: 9, day: 23 }, end: { month: 10, day: 22 } },
    { sign: 'Scorpio', start: { month: 10, day: 23 }, end: { month: 11, day: 21 } },
    { sign: 'Sagittarius', start: { month: 11, day: 22 }, end: { month: 12, day: 21 } },
  ];

  for (const zodiac of zodiacDates) {
    if (zodiac.sign === 'Capricorn') {
      if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
        return zodiac.sign;
      }
    } else {
      if ((month === zodiac.start.month && day >= zodiac.start.day) ||
          (month === zodiac.end.month && day <= zodiac.end.day)) {
        return zodiac.sign;
      }
    }
  }
  return 'Unknown';
};

// Mock data for horoscope (in real app, you'd use an API)
const horoscopeData: Record<string, Omit<ZodiacSign, 'sign'>> = {
  Aries: {
    horoscope: "Today brings new opportunities for leadership and innovation. Your natural enthusiasm will inspire others around you.",
    traits: ["Leadership", "Enthusiasm", "Courage", "Independence"],
    luckyNumbers: [1, 8, 17],
    luckyColor: "Red"
  },
  Taurus: {
    horoscope: "Focus on stability and practical matters today. Your patience and determination will lead to lasting success.",
    traits: ["Reliability", "Patience", "Practicality", "Determination"],
    luckyNumbers: [2, 6, 20],
    luckyColor: "Green"
  },
  Gemini: {
    horoscope: "Communication and learning are highlighted today. Embrace new ideas and social connections.",
    traits: ["Adaptability", "Communication", "Curiosity", "Wit"],
    luckyNumbers: [3, 12, 21],
    luckyColor: "Yellow"
  },
  Cancer: {
    horoscope: "Emotional intuition guides you today. Trust your feelings and nurture important relationships.",
    traits: ["Empathy", "Intuition", "Loyalty", "Creativity"],
    luckyNumbers: [4, 7, 22],
    luckyColor: "Silver"
  },
  Leo: {
    horoscope: "Your natural charisma shines bright today. Take center stage and inspire others with your confidence.",
    traits: ["Confidence", "Generosity", "Leadership", "Creativity"],
    luckyNumbers: [5, 19, 23],
    luckyColor: "Gold"
  },
  Virgo: {
    horoscope: "Attention to detail and organization will serve you well today. Perfect timing for important projects.",
    traits: ["Perfectionism", "Analytical", "Helpful", "Organized"],
    luckyNumbers: [6, 15, 24],
    luckyColor: "Navy Blue"
  },
  Libra: {
    horoscope: "Balance and harmony are key today. Your diplomatic nature will help resolve conflicts peacefully.",
    traits: ["Balance", "Diplomacy", "Fairness", "Charm"],
    luckyNumbers: [7, 16, 25],
    luckyColor: "Pink"
  },
  Scorpio: {
    horoscope: "Deep transformation and powerful insights await you today. Trust your instincts completely.",
    traits: ["Intensity", "Passion", "Intuition", "Determination"],
    luckyNumbers: [8, 18, 26],
    luckyColor: "Deep Red"
  },
  Sagittarius: {
    horoscope: "Adventure and expansion call to you today. Embrace new philosophies and broaden your horizons.",
    traits: ["Adventure", "Optimism", "Freedom", "Wisdom"],
    luckyNumbers: [9, 14, 27],
    luckyColor: "Purple"
  },
  Capricorn: {
    horoscope: "Discipline and ambition drive you toward success today. Your hard work will soon pay off.",
    traits: ["Ambition", "Discipline", "Responsibility", "Patience"],
    luckyNumbers: [10, 13, 28],
    luckyColor: "Brown"
  },
  Aquarius: {
    horoscope: "Innovation and humanitarian causes inspire you today. Your unique vision can change the world.",
    traits: ["Innovation", "Independence", "Humanitarian", "Originality"],
    luckyNumbers: [11, 22, 29],
    luckyColor: "Electric Blue"
  },
  Pisces: {
    horoscope: "Compassion and creativity flow through you today. Trust your artistic and spiritual instincts.",
    traits: ["Compassion", "Intuition", "Creativity", "Spirituality"],
    luckyNumbers: [12, 24, 30],
    luckyColor: "Sea Green"
  }
};

// Get horoscope for zodiac sign
export const fetchDailyHoroscope = async (date: Date): Promise<ZodiacSign> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
  
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const sign = getZodiacSign(month, day);
  
  return {
    sign,
    ...horoscopeData[sign]
  };
};

// Get famous people born/died on this date
export const fetchFamousPeopleForDate = async (date: Date): Promise<FamousPerson[]> => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Format month and day with leading zeros
  const monthStr = month.toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');
  
  try {
    // Fetch both births and deaths from Wikipedia API
    const [birthsResponse, deathsResponse] = await Promise.all([
      fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/${monthStr}/${dayStr}`),
      fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/deaths/${monthStr}/${dayStr}`)
    ]);

    if (!birthsResponse.ok || !deathsResponse.ok) {
      throw new Error('Failed to fetch data from Wikipedia API');
    }

    const birthsData = await birthsResponse.json();
    const deathsData = await deathsResponse.json();

    const famousPeople: FamousPerson[] = [];

    // Process births (take all births)
    if (birthsData.births && Array.isArray(birthsData.births)) {
      birthsData.births.forEach((birth: any) => {
        const name = birth.text.split(',')[0]; // Extract name before the comma
        const description = birth.text.split(',')[1]?.trim() || 'Famous person';
        
        // Extract image and Wikipedia URLs from pages array
        const pageWithImage = (birth.pages || []).find((p: any) => p?.originalimage?.source || p?.thumbnail?.source);
        const imageUrl = pageWithImage?.originalimage?.source || pageWithImage?.thumbnail?.source;
        
        // Extract Wikipedia URLs
        const pageWithUrl = (birth.pages || [])[0]; // Use first page for URL
        const wikipediaUrl = pageWithUrl?.content_urls ? {
          desktop: pageWithUrl.content_urls.desktop?.page || '',
          mobile: pageWithUrl.content_urls.mobile?.page || ''
        } : undefined;
        
        famousPeople.push({
          name,
          year: birth.year,
          description,
          type: 'birth' as const,
          imageUrl,
          wikipediaUrl
        });
      });
    }

    // Process deaths (take all deaths)
    if (deathsData.deaths && Array.isArray(deathsData.deaths)) {
      deathsData.deaths.forEach((death: any) => {
        const name = death.text.split(',')[0]; // Extract name before the comma
        const description = death.text.split(',')[1]?.trim() || 'Famous person';
        
        // Extract image and Wikipedia URLs from pages array
        const pageWithImage = (death.pages || []).find((p: any) => p?.originalimage?.source || p?.thumbnail?.source);
        const imageUrl = pageWithImage?.originalimage?.source || pageWithImage?.thumbnail?.source;
        
        // Extract Wikipedia URLs
        const pageWithUrl = (death.pages || [])[0]; // Use first page for URL
        const wikipediaUrl = pageWithUrl?.content_urls ? {
          desktop: pageWithUrl.content_urls.desktop?.page || '',
          mobile: pageWithUrl.content_urls.mobile?.page || ''
        } : undefined;
        
        famousPeople.push({
          name,
          year: death.year,
          description,
          type: 'death' as const,
          imageUrl,
          wikipediaUrl
        });
      });
    }

    return famousPeople;
  } catch (error) {
    console.error('Error fetching famous people:', error);
    // Fallback to mock data if API fails
    const mockData: FamousPerson[] = [
      { name: "Albert Einstein", year: 1879, description: "Theoretical physicist, developed theory of relativity", type: "birth" },
      { name: "Leonardo da Vinci", year: 1452, description: "Renaissance artist and inventor", type: "birth" },
      { name: "Marie Curie", year: 1867, description: "First woman to win Nobel Prize", type: "birth" },
      { name: "William Shakespeare", year: 1564, description: "English playwright and poet", type: "birth" },
      { name: "Nelson Mandela", year: 1918, description: "Anti-apartheid leader and former president", type: "birth" },
      { name: "John F. Kennedy", year: 1963, description: "35th President of the United States", type: "death" },
      { name: "Princess Diana", year: 1997, description: "Princess of Wales, humanitarian", type: "death" },
      { name: "Martin Luther King Jr.", year: 1968, description: "Civil rights leader and activist", type: "death" },
      { name: "Frida Kahlo", year: 1907, description: "Mexican artist known for self-portraits", type: "birth" },
      { name: "Stephen Hawking", year: 1942, description: "Theoretical physicist and cosmologist", type: "birth" }
    ];
    
    // Randomize based on date for variety
    const seed = month * 31 + day;
    const shuffled = mockData.sort(() => Math.sin(seed) - 0.5);
    
    return shuffled.slice(0, 6); // Return 6 items (3 births + 3 deaths) to match API structure
  }
};

// Get historical events for this date
export const fetchHistoricalEventsForDate = async (date: Date): Promise<HistoricalEvent[]> => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Format month and day with leading zeros
  const monthStr = month.toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');
  
  try {
    // Fetch historical events from Wikipedia API
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${monthStr}/${dayStr}`);

    if (!response.ok) {
      throw new Error('Failed to fetch events from Wikipedia API');
    }

    const data = await response.json();

    if (data.events && Array.isArray(data.events)) {
      // Return all events, not just top 5
      return data.events.map((evt: any) => {
        const pageWithImage = (evt.pages || []).find((p: any) => p?.originalimage?.source || p?.thumbnail?.source);
        const imageUrl = pageWithImage?.originalimage?.source || pageWithImage?.thumbnail?.source;
        
        // Extract Wikipedia URLs
        const pageWithUrl = (evt.pages || [])[0]; // Use first page for URL
        const wikipediaUrl = pageWithUrl?.content_urls ? {
          desktop: pageWithUrl.content_urls.desktop?.page || '',
          mobile: pageWithUrl.content_urls.mobile?.page || ''
        } : undefined;
        
        const [titlePart, descPart] = (evt.text || '').split(' – ');
        return {
          year: evt.year,
          event: titlePart || evt.text,
          description: descPart || evt.text,
          imageUrl,
          wikipediaUrl
        } as HistoricalEvent;
      });
    }

    return [];
  } catch (error) {
    console.error('Error fetching historical events:', error);
    // Fallback to mock data if API fails
    const mockEvents: HistoricalEvent[] = [
      { year: 1969, event: "Apollo 11 Moon Landing", description: "First humans landed on the moon" },
      { year: 1989, event: "Fall of Berlin Wall", description: "Symbol of Cold War division comes down" },
      { year: 1776, event: "Declaration of Independence", description: "American colonies declare independence" },
      { year: 1945, event: "End of World War II", description: "Japan surrenders, ending WWII" },
      { year: 1963, event: "March on Washington", description: "Historic civil rights demonstration" }
    ];
    
    // Randomize based on date
    const seed = month * 31 + day;
    const shuffled = mockEvents.sort(() => Math.sin(seed) - 0.5);
    
    return shuffled.slice(0, 5);
  }
};