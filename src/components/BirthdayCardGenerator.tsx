import { useState, useRef } from "react";
import { Download, Upload, Palette, Sparkles, Heart, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface BirthdayCardTemplate {
  id: string;
  name: string;
  background: string;
  textColor: string;
  accentColor: string;
  pattern: string;
}

const cardTemplates: BirthdayCardTemplate[] = [
  {
    id: "classic",
    name: "Classic Celebration",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    textColor: "#ffffff",
    accentColor: "#ffd700",
    pattern: "🎉"
  },
  {
    id: "rainbow",
    name: "Rainbow Dreams",
    background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 25%, #fecfef 75%, #a8edea 100%)",
    textColor: "#4a5568",
    accentColor: "#e53e3e",
    pattern: "🌈"
  },
  {
    id: "elegant",
    name: "Golden Elegance",
    background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
    textColor: "#ecf0f1",
    accentColor: "#f39c12",
    pattern: "✨"
  },
  {
    id: "nature",
    name: "Nature Bliss",
    background: "linear-gradient(135deg, #74b9ff 0%, #0984e3 50%, #00b894 100%)",
    textColor: "#ffffff",
    accentColor: "#fdcb6e",
    pattern: "🌸"
  },
  {
    id: "sunset",
    name: "Sunset Vibes",
    background: "linear-gradient(135deg, #ff7b7b 0%, #667eea 100%)",
    textColor: "#ffffff",
    accentColor: "#ffd700",
    pattern: "🌅"
  },
  {
    id: "cosmic",
    name: "Cosmic Wonder",
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    textColor: "#ffffff",
    accentColor: "#ff6b6b",
    pattern: "🌟"
  }
];

interface BirthdayCardGeneratorProps {
  birthDate: Date;
}

export const BirthdayCardGenerator = ({ birthDate }: BirthdayCardGeneratorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<BirthdayCardTemplate>(cardTemplates[0]);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCard = async () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 500;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    const colors = selectedTemplate.background.match(/rgb\([^)]+\)|#[0-9a-f]{6}|#[0-9a-f]{3}/gi);
    
    if (colors && colors.length >= 2) {
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(1, colors[1]);
    } else {
      gradient.addColorStop(0, selectedTemplate.background);
      gradient.addColorStop(1, selectedTemplate.accentColor);
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add decorative pattern
    ctx.font = '60px Arial';
    ctx.fillStyle = selectedTemplate.accentColor + '40';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.fillText(selectedTemplate.pattern, x, y);
    }

    // Add main text
    ctx.fillStyle = selectedTemplate.textColor;
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎂 Happy Birthday! 🎂', canvas.width / 2, 100);

    if (userName) {
      ctx.font = 'bold 36px Arial';
      ctx.fillStyle = selectedTemplate.accentColor;
      ctx.fillText(userName, canvas.width / 2, 160);
    }

    // Add birth date
    ctx.font = '24px Arial';
    ctx.fillStyle = selectedTemplate.textColor;
    const formattedDate = birthDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    ctx.fillText(formattedDate, canvas.width / 2, 200);

    // Add decorative message
    ctx.font = '20px Arial';
    ctx.fillText('Wishing you joy, happiness, and all the best!', canvas.width / 2, 250);

    // Add user image if available
    if (userImage) {
      const img = new Image();
      img.onload = () => {
        const size = 120;
        const x = canvas.width / 2 - size / 2;
        const y = 300;
        
        // Create circular clipping path
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
        ctx.clip();
        
        // Draw image
        ctx.drawImage(img, x, y, size, size);
        
        // Add border
        ctx.restore();
        ctx.strokeStyle = selectedTemplate.accentColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
        ctx.stroke();
      };
      img.src = userImage;
    }
  };

  const downloadCard = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `birthday-card-${userName || 'special'}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    toast.success("Birthday card downloaded successfully! 🎉");
  };

  return (
    <div className="max-w-6xl mx-auto mb-8" data-id="birthday-card-section">
      <Card className="shadow-card" data-id="birthday-card-generator">
        <CardHeader className="text-center" data-id="card-generator-header">
          <CardTitle className="flex items-center justify-center space-x-2" data-id="card-generator-title">
            <Palette className="h-5 w-5 text-primary" />
            <span>Birthday Card Generator</span>
          </CardTitle>
          <CardDescription data-id="card-generator-description">
            Create and download personalized birthday cards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-id="card-generator-content">
          {/* Template Selection */}
          <div className="space-y-3" data-id="template-section">
            <Label className="text-sm font-medium">Choose a template:</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3" data-id="template-grid">
              {cardTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedTemplate.id === template.id 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  data-id={`template-${template.id}`}
                >
                  <div 
                    className="w-full h-20 rounded mb-2"
                    style={{ background: template.background }}
                    data-id={`template-preview-${template.id}`}
                  />
                  <div className="text-xs font-medium text-center" data-id={`template-name-${template.id}`}>
                    {template.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* User Input Section */}
          <div className="grid md:grid-cols-2 gap-6" data-id="user-input-section">
            <div className="space-y-4" data-id="text-inputs">
              <div className="space-y-2" data-id="name-input-section">
                <Label htmlFor="userName">Your Name (optional)</Label>
                <Input
                  id="userName"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  data-id="name-input"
                />
              </div>
              
              <div className="space-y-2" data-id="image-upload-section">
                <Label>Upload Your Photo (optional)</Label>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center space-x-2"
                  data-id="upload-button"
                >
                  <Upload className="h-4 w-4" />
                  <span>{userImage ? 'Change Photo' : 'Upload Photo'}</span>
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  data-id="file-input"
                />
                {userImage && (
                  <div className="flex justify-center" data-id="image-preview">
                    <img 
                      src={userImage} 
                      alt="Preview" 
                      className="w-20 h-20 rounded-full object-cover border-2 border-primary" 
                      data-id="preview-image"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4" data-id="card-actions">
              <div className="space-y-2" data-id="generate-section">
                <Label>Generate & Download</Label>
                <Button
                  onClick={generateCard}
                  className="w-full flex items-center space-x-2"
                  data-id="generate-button"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Card</span>
                </Button>
              </div>
              
              <Button
                onClick={downloadCard}
                variant="secondary"
                className="w-full flex items-center space-x-2"
                data-id="download-button"
              >
                <Download className="h-4 w-4" />
                <span>Download Card</span>
              </Button>
            </div>
          </div>

          {/* Canvas Preview */}
          <div className="text-center" data-id="canvas-section">
            <Label className="text-sm font-medium mb-2 block">Card Preview:</Label>
            <div className="inline-block border rounded-lg p-4 bg-muted/50" data-id="canvas-container">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto rounded"
                style={{ maxWidth: '400px' }}
                data-id="card-canvas"
              />
            </div>
          </div>

          {/* Selected Template Info */}
          <div className="flex items-center justify-center space-x-2" data-id="template-info">
            <Badge variant="outline" data-id="selected-template-badge">
              {selectedTemplate.pattern} {selectedTemplate.name}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};