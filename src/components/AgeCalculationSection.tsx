import { useState, useEffect } from "react";
import { Clock, Calendar, Star, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateAge, formatDayOfLife, type AgeCalculation } from "@/utils/ageCalculations";

interface AgeCalculationSectionProps {
  birthDate: Date;
}

export const AgeCalculationSection = ({ birthDate }: AgeCalculationSectionProps) => {
  const [ageData, setAgeData] = useState<AgeCalculation | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const updateAge = () => {
      const now = new Date();
      setCurrentTime(now);
      setAgeData(calculateAge(birthDate, now));
    };

    updateAge();
    
    // Update every minute to keep it live
    const interval = setInterval(updateAge, 60000);
    
    return () => clearInterval(interval);
  }, [birthDate]);

  if (!ageData) return null;

  return (
    <div className="max-w-4xl mx-auto mb-8" data-id="age-calculation-section">
      <Card className="shadow-card border-primary/20" data-id="age-calculation-card">
        <CardHeader className="text-center" data-id="age-calculation-header">
          <CardTitle className="flex items-center justify-center space-x-2" data-id="age-calculation-title">
            <Clock className="h-5 w-5 text-primary" />
            <span>Life Statistics</span>
          </CardTitle>
          <CardDescription data-id="age-calculation-description">
            Your journey through time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-id="age-calculation-content">
          {/* Years, Months, Days */}
          <div className="grid md:grid-cols-3 gap-4" data-id="age-breakdown-grid">
            <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg" data-id="years-section">
              <div className="text-2xl font-bold text-primary mb-1" data-id="years-count">
                {ageData.years}
              </div>
              <div className="text-sm text-muted-foreground" data-id="years-label">
                Years
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg" data-id="months-section">
              <div className="text-2xl font-bold text-secondary-foreground mb-1" data-id="months-count">
                {ageData.months}
              </div>
              <div className="text-sm text-muted-foreground" data-id="months-label">
                Additional Months
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg" data-id="days-section">
              <div className="text-2xl font-bold text-accent-foreground mb-1" data-id="days-count">
                {ageData.days}
              </div>
              <div className="text-sm text-muted-foreground" data-id="days-label">
                Additional Days
              </div>
            </div>
          </div>

          {/* Alternative Age Formats */}
          <div className="space-y-3" data-id="alternative-formats">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg" data-id="total-days-row">
              <div className="flex items-center space-x-2" data-id="total-days-label">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium">Total Days on Earth:</span>
              </div>
              <Badge variant="secondary" data-id="total-days-badge">
                {ageData.totalDays.toLocaleString()} days
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg" data-id="total-hours-row">
              <div className="flex items-center space-x-2" data-id="total-hours-label">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium">Total Hours on Earth:</span>
              </div>
              <Badge variant="secondary" data-id="total-hours-badge">
                {Math.floor((Date.now() - birthDate.getTime()) / (1000 * 60 * 60)).toLocaleString()} hours
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg" data-id="total-minutes-row">
              <div className="flex items-center space-x-2" data-id="total-minutes-label">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium">Total Minutes on Earth:</span>
              </div>
              <Badge variant="secondary" data-id="total-minutes-badge">
                {Math.floor((Date.now() - birthDate.getTime()) / (1000 * 60)).toLocaleString()} minutes
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg" data-id="total-seconds-row">
              <div className="flex items-center space-x-2" data-id="total-seconds-label">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium">Total Seconds on Earth:</span>
              </div>
              <Badge variant="secondary" data-id="total-seconds-badge">
                {Math.floor((Date.now() - birthDate.getTime()) / 1000).toLocaleString()} seconds
              </Badge>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="text-center pt-4 border-t" data-id="fun-facts">
            <p className="text-sm text-muted-foreground" data-id="celebration-message">
              🎉 You've successfully lived <span className="font-semibold text-foreground">{ageData.totalDays.toLocaleString()}</span> amazing days!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
