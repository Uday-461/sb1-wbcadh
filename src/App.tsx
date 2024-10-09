import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

type Question = {
  id: number;
  question: string;
  options: string[];
  customInput?: {
    type: 'text' | 'textarea';
    placeholder: string;
  };
};

const questions: Question[] = [
  {
    id: 1,
    question: "What's your perfect weekend vibe?",
    options: [
      "Cozy brunch with good coffee",
      "Exploring a new place",
      "Netflix and snacks all day",
      "Something spontaneous and exciting",
      "Custom option"
    ],
    customInput: {
      type: 'textarea',
      placeholder: "These are good, but I want to do this..."
    }
  },
  {
    id: 2,
    question: "If you had to pick a way to discover a new spot, you'd choose...",
    options: [
      "Stumbling upon it by chance",
      "A friend's recommendation",
      "Reviews on Instagram",
      "Letting someone surprise you",
      "Custom option"
    ],
    customInput: {
      type: 'text',
      placeholder: "I already know my favourite first date spot, and it is..."
    }
  },
  {
    id: 3,
    question: "Would you say yes to...",
    options: [
      "Grabbing a drink with someone fun",
      "Trying out a new restaurant",
      "An adventure this weekend",
      "All of the above (with me, of course)"
    ]
  },
  {
    id: 4,
    question: "How do you feel about letting me plan a fun day out for us?",
    options: [
      "Sure, surprise me!",
      "I'm intrigued, let's do it",
      "Only if I get to pick next time!",
      "Why not—what could go wrong?"
    ]
  }
];

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

function App() {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [customInputs, setCustomInputs] = useState<Record<number, string>>({});
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  const handleStart = () => {
    setStarted(true);
  };

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: answer });
  };

  const handleCustomInput = (input: string) => {
    setCustomInputs({ ...customInputs, [questions[currentQuestion].id]: input });
  };

  const handleDaySelection = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentQuestion === questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowSummary(true);
    }
  };

  const generateEmailContent = () => {
    let content = `Hi,\n\nHope you're doing well.\n\nI would enjoy going out on a date with you. Here's what I like:\n\n`;
    questions.forEach((q) => {
      content += `${q.question}\n`;
      content += `- ${answers[q.id]}\n`;
      if (customInputs[q.id] && answers[q.id] === "Custom option") {
        content += `- Custom input: ${customInputs[q.id]}\n`;
      }
      content += '\n';
    });
    content += `Which day of the week would you like to go out?\n- ${selectedDays.join(', ')}\n\n`;
    return encodeURIComponent(content);
  };

  const handleSendEmail = () => {
    const emailContent = generateEmailContent();
    window.location.href = `mailto:thatguyfromthatdatingapp@gmail.com?subject=Let's Go On A Date!&body=${emailContent}`;
  };

  const renderQuestion = (question: Question) => (
    <div className="space-y-4">
      <RadioGroup onValueChange={handleAnswer} value={answers[question.id]}>
        {question.options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`option-${index}`} />
            <Label htmlFor={`option-${index}`}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
      {question.customInput && answers[question.id] === "Custom option" && (
        <div className="mt-4">
          {question.customInput.type === 'textarea' ? (
            <Textarea
              placeholder={question.customInput.placeholder}
              value={customInputs[question.id] || ''}
              onChange={(e) => handleCustomInput(e.target.value)}
            />
          ) : (
            <Input
              placeholder={question.customInput.placeholder}
              value={customInputs[question.id] || ''}
              onChange={(e) => handleCustomInput(e.target.value)}
            />
          )}
        </div>
      )}
    </div>
  );

  const renderDaySelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Which days of the week do you prefer for dates?</h3>
      <p className="text-sm text-muted-foreground">(Select all that apply)</p>
      {daysOfWeek.map((day) => (
        <div key={day} className="flex items-center space-x-2">
          <Checkbox
            id={day}
            checked={selectedDays.includes(day)}
            onCheckedChange={() => handleDaySelection(day)}
          />
          <label
            htmlFor={day}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {day}
          </label>
        </div>
      ))}
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Responses:</h3>
      {questions.map((q) => (
        <div key={q.id} className="space-y-2">
          <p className="font-medium">{q.question}</p>
          <p>- {answers[q.id]}</p>
          {customInputs[q.id] && answers[q.id] === "Custom option" && <p>- Custom input: {customInputs[q.id]}</p>}
        </div>
      ))}
      <div className="space-y-2">
        <p className="font-medium">Preferred days for dates:</p>
        <p>- {selectedDays.join(', ')}</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>
            {!started 
              ? "Let's Make This Official-ish!" 
              : showSummary 
                ? "Your Date Preferences" 
                : currentQuestion < questions.length 
                  ? questions[currentQuestion].question
                  : "Choose Your Date Days"}
          </CardTitle>
          <CardDescription>{!started && "Just a few fun questions before we decide if this is Netflix and chill or candlelit dinner."}</CardDescription>
        </CardHeader>
        <CardContent>
          {!started ? (
            <div className="space-y-4">
              <p>Before we swipe right on that calendar and pick the perfect date (pun totally intended), let's get to know each other in the most adorable and non-awkward way possible. Answer a few quirky questions, and we'll see if we're vibing enough to grab drinks, dinner, or maybe even match our snack preferences!</p>
              <p className="text-sm italic text-muted-foreground">Warning: Bad jokes ahead. Proceed with caution… and maybe a glass of wine.</p>
            </div>
          ) : showSummary ? (
            renderSummary()
          ) : currentQuestion < questions.length ? (
            renderQuestion(questions[currentQuestion])
          ) : (
            renderDaySelection()
          )}
        </CardContent>
        <CardFooter>
          {!started ? (
            <Button onClick={handleStart} className="w-full">Let's Play Cupid!</Button>
          ) : showSummary ? (
            <Button onClick={handleSendEmail} className="w-full">Send Email</Button>
          ) : (
            <Button 
              onClick={handleNext} 
              disabled={currentQuestion < questions.length ? !answers[questions[currentQuestion].id] : selectedDays.length === 0} 
              className="w-full"
            >
              {currentQuestion < questions.length - 1 ? "Next" : currentQuestion === questions.length - 1 ? "Choose Date Days" : "See Summary"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;