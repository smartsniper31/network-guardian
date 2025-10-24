
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, Send, User } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback } from "../ui/avatar";

export function AiAnalyst() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Bonjour ! Je suis votre analyste de sécurité IA. Comment puis-je vous aider aujourd'hui ?" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;
    
    // Placeholder logic - just echoes the message
    setMessages(prev => [...prev, { from: 'user', text: input }]);
    setTimeout(() => {
        setMessages(prev => [...prev, { from: 'bot', text: `Réponse de l'IA à "${input}"...` }]);
    }, 1000);

    setInput('');
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot />
          Analyste de Sécurité IA
        </CardTitle>
        <CardDescription>
          Posez des questions en langage naturel sur votre réseau.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <ScrollArea className="flex-1 pr-4 -mr-4">
            <div className="space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.from === 'user' ? 'justify-end' : ''}`}>
                        {msg.from === 'bot' && (
                            <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                                <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                            </Avatar>
                        )}
                        <div className={`rounded-lg p-3 max-w-sm ${msg.from === 'bot' ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                        {msg.from === 'user' && (
                             <Avatar className="h-8 w-8">
                                <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
            </div>
        </ScrollArea>

        <div className="flex w-full items-center space-x-2">
          <Input 
            type="text" 
            placeholder="Ex: Bloque la TV du salon..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
          <Button type="submit" size="icon" onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
