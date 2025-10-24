
"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, Send, User, Loader2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { networkChat } from "@/ai/flows/network-chat-flow";
import { getDevices } from "@/lib/services/network-service";
import { Device } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

type Message = {
  from: 'bot' | 'user';
  text: string;
};

export function AiAnalyst() {
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: "Bonjour ! Je suis votre analyste de sécurité IA. Comment puis-je vous aider aujourd'hui ?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const { toast } = useToast();
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchDevices() {
        const deviceData = await getDevices();
        setDevices(deviceData);
    }
    fetchDevices();
  }, [])

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaViewportRef.current) {
      scrollAreaViewportRef.current.scrollTo({ top: scrollAreaViewportRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;
    
    const userMessage: Message = { from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const response = await networkChat({
            query: input,
            deviceData: JSON.stringify(devices, null, 2),
        });

        const botMessage: Message = { from: 'bot', text: response.response };
        setMessages(prev => [...prev, botMessage]);

    } catch (error) {
        console.error("Error chatting with AI:", error);
        const errorMessage: Message = { from: 'bot', text: "Désolé, je rencontre une erreur. Veuillez réessayer plus tard." };
        setMessages(prev => [...prev, errorMessage]);
        toast({
            variant: "destructive",
            title: "Erreur de l'IA",
            description: "Impossible d'obtenir une réponse de l'analyste IA.",
        })
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full flex-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot />
          Analyste de Sécurité IA
        </CardTitle>
        <CardDescription>
          Posez des questions en langage naturel sur votre réseau. Je peux analyser, expliquer et même agir sur vos appareils.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-1 pr-4 -mr-4" viewportRef={scrollAreaViewportRef}>
            <div className="space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.from === 'user' ? 'justify-end' : ''}`}>
                        {msg.from === 'bot' && (
                            <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                                <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                            </Avatar>
                        )}
                        <div className={`rounded-lg p-3 max-w-sm ${msg.from === 'bot' ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        {msg.from === 'user' && (
                             <Avatar className="h-8 w-8">
                                <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                            <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg p-3 max-w-sm bg-muted flex items-center">
                            <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>

        <div className="flex w-full items-center space-x-2">
          <Input 
            type="text" 
            placeholder="Ex: Bloque la TV du salon..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            />
          <Button type="submit" size="icon" onClick={handleSend} disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
