"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2, Pill, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePatients } from "@/context/patient-context";
import { generateChatResponse } from "@/lib/ai-agents";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const suggestedQuestions = [
  "What are the side effects of my medications?",
  "Can I take my medications with food?",
  "What should I do if I miss a dose?",
  "Are there any drug interactions I should know about?",
];

export default function PatientChatPage() {
  const { prescriptions } = usePatients();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I'm your Medbridge health assistant. I can help you understand your medications, answer health questions, and provide general wellness guidance. ${
        prescriptions.length > 0
          ? `I can see you have ${prescriptions.length} prescription(s) on file - feel free to ask me about them!`
          : "Start by scanning a prescription, or ask me any health question."
      }`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Build context from prescriptions
      const context = prescriptions.length > 0
        ? `Patient has the following prescriptions: ${prescriptions
            .map((rx) => `${rx.drugName} ${rx.dosage} (${rx.frequency})`)
            .join(", ")}.`
        : "No prescriptions on file.";

      const response = await generateChatResponse(messageText, context);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Health Assistant</h1>
        <p className="text-muted-foreground">
          Ask questions about your health, medications, or get wellness tips
        </p>
      </div>

      <div className="grid flex-1 gap-4 lg:grid-cols-3 overflow-hidden">
        {/* Chat Area */}
        <Card className="flex flex-col lg:col-span-2 overflow-hidden">
          <CardHeader className="shrink-0 border-b">
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              Medbridge Assistant
            </CardTitle>
          </CardHeader>
          
          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`mt-1 text-xs ${
                        message.role === "user"
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl bg-muted px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* Input */}
          <div className="shrink-0 border-t p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your health question..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={() => handleSend()} disabled={!input.trim() || isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4 overflow-y-auto">
          {/* Suggested Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-primary" />
                Suggested Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedQuestions.map((question, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2 px-3"
                  onClick={() => handleSend(question)}
                  disabled={isLoading}
                >
                  <span className="text-sm line-clamp-2">{question}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Active Prescriptions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Pill className="h-4 w-4 text-primary" />
                Your Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {prescriptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No prescriptions on file. Scan a prescription to get personalized advice.
                </p>
              ) : (
                <div className="space-y-2">
                  {prescriptions.slice(0, 5).map((rx) => (
                    <div
                      key={rx.id}
                      className="rounded-lg bg-muted/50 p-2"
                    >
                      <p className="text-sm font-medium text-foreground">{rx.drugName}</p>
                      <p className="text-xs text-muted-foreground">{rx.dosage}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="bg-warning/5 border-warning/20">
            <CardContent className="flex items-start gap-2 p-3">
              <AlertCircle className="h-4 w-4 shrink-0 text-warning-foreground mt-0.5" />
              <p className="text-xs text-warning-foreground">
                This assistant provides general health information only. Always consult a healthcare professional for medical advice.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
