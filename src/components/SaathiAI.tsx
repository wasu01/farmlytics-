import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, Loader2, Mic } from "lucide-react";
import { useState as useLocalState } from "react";
import { VoiceSaathiAI } from "@/components/VoiceSaathiAI";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const SaathiAI = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Namaste! I am Saathi AI, your agricultural assistant. I can help you with weather information, government schemes, crop advice, market prices, and any farming-related queries. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("saathi-ai", {
        body: { message: userMessage, conversationHistory: messages },
      });

      if (error) throw error;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error: any) {
      console.error("Saathi AI error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to get response from Saathi AI",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Local state for voice assistant popover/modal
  const [voiceOpen, setVoiceOpen] = useLocalState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageSquare className="w-4 h-4" />
          Saathi AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl w-full h-[520px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Saathi AI - Your Agriculture Assistant
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-w-0">
          <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saathi is thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="flex gap-2 pt-4 border-t items-center">
            <Input
              placeholder="Ask about weather, government schemes, farming tips..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant={voiceOpen ? "default" : "outline"}
              size="icon"
              className="ml-1"
              aria-label="Open Voice Assistant"
              onClick={() => setVoiceOpen((v) => !v)}
            >
              <Mic className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Voice Assistant Popover/Modal */}
        {voiceOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            style={{ top: 0, left: 0 }}
            onClick={() => setVoiceOpen(false)}
          >
            <div
              className="bg-card rounded-xl shadow-2xl border-2 border-primary/20 min-w-[320px] max-w-[90vw] p-4 relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-muted-foreground hover:text-primary"
                onClick={() => setVoiceOpen(false)}
                aria-label="Close Voice Assistant"
              >
                ×
              </button>
              <VoiceSaathiAI />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
