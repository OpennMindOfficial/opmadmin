
// src/app/actions/api-testing/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TestTube2 as PageIcon, Play, Loader2, AlertTriangle, CheckCircle, XCircle, RefreshCw, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useRef } from 'react';
import { getApiTestConfigsAction } from '@/app/actions/apiTestActions';
import type { ApiTestConfigRecord } from '@/services/baserowService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { apiTestChat, type ApiTestChatInput } from '@/ai/flows/apiTestChatFlow';
import { cn } from '@/lib/utils';

// Function to parse comma-separated API keys
const parseApiKeys = (dataField?: string): string[] => {
  if (!dataField) return [];
  return dataField.split(',').map(key => key.trim()).filter(key => key);
};

const getStatusIndicator = (activeValue?: boolean | string) => {
  const isActive = activeValue === true || (typeof activeValue === 'string' && String(activeValue).toLowerCase() === 'true');
  if (isActive) return <CheckCircle className="h-5 w-5 text-green-500" title="Active" />;
  return <XCircle className="h-5 w-5 text-red-500" title="Inactive"/>;
};

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export default function ApiTestingPage() {
  const { toast } = useToast();
  const [configs, setConfigs] = useState<ApiTestConfigRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [currentTestApiKey, setCurrentTestApiKey] = useState<string | null>(null);
  const [currentTestConfig, setCurrentTestConfig] = useState<ApiTestConfigRecord | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentUserInput, setCurrentUserInput] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatScrollAreaRef.current) {
        const scrollViewport = chatScrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollViewport) {
            scrollViewport.scrollTop = scrollViewport.scrollHeight;
        }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);


  const fetchConfigs = async () => {
    setIsLoading(true); setError(null);
    try {
      const result = await getApiTestConfigsAction();
      if (result.success && result.configs) {
        setConfigs(result.configs);
      } else {
        setError(result.error || "Failed to load API test configurations.");
        toast({ variant: "destructive", title: "Error", description: result.error || "Failed to load configurations." });
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTestButtonClick = (apiKey: string, config: ApiTestConfigRecord) => {
    setCurrentTestApiKey(apiKey);
    setCurrentTestConfig(config);
    setChatMessages([]); // Clear previous chat messages
    setCurrentUserInput("");
    toast({
      title: `API Test Session Started`,
      description: `Chat with AI to discuss testing API: ${config.Type || 'N/A'} with key ${apiKey.substring(0,8)}...`,
    });
    setIsTestDialogOpen(true);
  };

  const handleSendMessage = async () => {
    if (!currentUserInput.trim() || !currentTestApiKey || !currentTestConfig) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: currentUserInput };
    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = currentUserInput;
    setCurrentUserInput("");
    setIsSendingMessage(true);

    try {
      const flowInput: ApiTestChatInput = {
        userInput: currentInput,
        apiKey: currentTestApiKey,
        apiConfigType: currentTestConfig.Type || 'N/A',
        apiUseCase: currentTestConfig['Use case'] || 'N/A',
      };
      const result = await apiTestChat(flowInput);
      const aiMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: result.aiResponse };
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (e: any) {
      const errorMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: "Sorry, I encountered an error. Please try again." };
      setChatMessages(prev => [...prev, errorMessage]);
      toast({ variant: "destructive", title: "Chat Error", description: e.message || "Failed to get AI response." });
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <section className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <PageIcon className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">API Testing Configurations</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              View and initiate tests for configured API endpoints. (Table ID: 542783)
            </p>
          </div>
           <Button onClick={fetchConfigs} variant="outline" disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Configurations
          </Button>
        </section>

        <section className="space-y-6">
           <Card>
            <CardHeader>
              <CardTitle>Available API Configurations</CardTitle>
              <CardDescription>List of APIs sourced from Baserow for testing.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-2">Loading configurations...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 text-destructive">
                  <AlertTriangle className="h-8 w-8 mb-2" />
                  <p className="font-semibold">Error loading configurations</p>
                  <p className="text-sm">{error}</p>
                  <Button onClick={fetchConfigs} variant="outline" className="mt-4">Try Again</Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>API Keys (Data)</TableHead>
                        <TableHead>Use Case</TableHead>
                        <TableHead>Active</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {configs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                            No API configurations found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        configs.map((config) => (
                          <TableRow key={config.id}>
                            <TableCell className="font-medium">{config.ID || 'N/A'}</TableCell>
                            <TableCell>{config.Type || 'N/A'}</TableCell>
                            <TableCell>
                              {parseApiKeys(config.Data).length > 0 ? (
                                <div className="flex flex-col gap-1.5">
                                  {parseApiKeys(config.Data).map((apiKey, index) => (
                                    <div key={index} className="flex items-center justify-between gap-2">
                                      <span className="text-xs font-mono bg-muted p-1 rounded break-all">{apiKey}</span>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="px-2 py-0.5 h-auto text-xs"
                                        onClick={() => handleTestButtonClick(apiKey, config)}
                                      >
                                        <Play className="mr-1 h-3 w-3" /> Test
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              ) : <span className="text-xs text-muted-foreground">No keys</span>}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{config['Use case'] || 'N/A'}</TableCell>
                            <TableCell>{getStatusIndicator(config.Active)}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
            <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl flex flex-col h-[70vh] sm:h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Test API: {currentTestConfig?.Type || 'N/A'}</DialogTitle>
                    <DialogDescription>
                        API Key: <span className="font-mono bg-muted p-0.5 rounded text-xs">{currentTestApiKey ? `${currentTestApiKey.substring(0,8)}...` : 'N/A'}</span>
                        {' | '} Use Case: {currentTestConfig?.['Use case'] || 'N/A'}
                    </DialogDescription>
                </DialogHeader>
                
                <ScrollArea className="flex-1 my-2 pr-3 -mr-2" ref={chatScrollAreaRef}>
                  <div className="space-y-4 pr-2">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex w-full max-w-[85%] flex-col gap-1",
                          msg.sender === 'user' ? 'ml-auto items-end' : 'items-start'
                        )}
                      >
                        <div
                          className={cn(
                            "rounded-lg p-2.5 text-sm shadow-md",
                            msg.sender === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                     {chatMessages.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                            <p>Start by typing a message to the API Testing Assistant below.</p>
                            <p className="text-xs mt-1">e.g., "How should I test this API?" or "Check connectivity."</p>
                        </div>
                    )}
                  </div>
                </ScrollArea>
                
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="mt-auto pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Input
                      value={currentUserInput}
                      onChange={(e) => setCurrentUserInput(e.target.value)}
                      placeholder="Ask about testing this API..."
                      disabled={isSendingMessage}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isSendingMessage || !currentUserInput.trim()}>
                      {isSendingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      <span className="sr-only">Send</span>
                    </Button>
                  </div>
                </form>
                
            </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
