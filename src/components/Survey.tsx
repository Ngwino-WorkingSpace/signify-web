import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';

interface SurveyProps {
  onComplete: () => void;
}

const questions = [
  {
    id: 1,
    text: "Have you or anyone in your household experienced fever in the last 7 days?",
    type: "yesno" as const,
  },
  {
    id: 2,
    text: "Have you or anyone in your household had difficulty breathing?",
    type: "yesno" as const,
  },
  {
    id: 3,
    text: "How many people live in your household?",
    type: "number" as const,
  },
  {
    id: 4,
    text: "Do you have access to clean drinking water daily?",
    type: "yesno" as const,
  },
  {
    id: 5,
    text: "Have you noticed any unusual health symptoms in your community?",
    type: "yesno" as const,
  },
];

export function Survey({ onComplete }: SurveyProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [numberInput, setNumberInput] = useState("");

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (answer: string | number) => {
    setAnswers({ ...answers, [question.id]: answer });
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setNumberInput("");
    } else {
      // Survey complete
      setTimeout(() => {
        onComplete();
      }, 300);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="min-h-[600px] px-6 py-8 flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={handleBack}
          disabled={currentQuestion === 0}
          className="mb-6 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#18392b]" />
        </button>

        {/* Progress */}
        <div className="mb-2">
          <p className="text-sm text-gray-600 mb-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#18392b] transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col">
        <h2 className="text-2xl text-gray-800 mb-8 leading-relaxed">
          {question.text}
        </h2>

        {/* Answer Options */}
        {question.type === "yesno" && (
          <div className="space-y-4">
            <button
              onClick={() => handleAnswer("yes")}
              className="w-full bg-[#18392b] text-white py-6 rounded-2xl text-xl font-semibold shadow-lg hover:bg-[#18392b]/90 transition-all active:scale-98 flex items-center justify-center gap-3"
            >
              <Check className="w-6 h-6" />
              Yes
            </button>
            <button
              onClick={() => handleAnswer("no")}
              className="w-full bg-gray-100 text-gray-800 py-6 rounded-2xl text-xl font-semibold hover:bg-gray-200 transition-all active:scale-98 flex items-center justify-center gap-3"
            >
              No
            </button>
          </div>
        )}

        {question.type === "number" && (
          <div className="space-y-4">
            <input
              type="number"
              value={numberInput}
              onChange={(e) => setNumberInput(e.target.value)}
              placeholder="Enter number"
              className="w-full border-2 border-gray-300 rounded-2xl px-6 py-5 text-2xl text-center focus:border-[#18392b] focus:outline-none"
              min="0"
            />
            <button
              onClick={() => {
                if (numberInput && parseInt(numberInput) > 0) {
                  handleAnswer(parseInt(numberInput));
                }
              }}
              disabled={!numberInput || parseInt(numberInput) <= 0}
              className="w-full bg-[#18392b] text-white py-6 rounded-2xl text-xl font-semibold shadow-lg hover:bg-[#18392b]/90 transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}
      </div>

      {/* Helper Text */}
      <p className="text-center text-sm text-gray-500 mt-8">
        Your responses are private and help protect your community
      </p>
    </div>
  );
}
