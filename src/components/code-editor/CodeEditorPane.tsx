
// src/components/code-editor/CodeEditorPane.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

const mockFiles = {
  'index.tsx': {
    language: 'typescript',
    content: `
const mongoose = require('mongoose');
const User = require('./UserModel');

mongoose.connect('mongodb://localhost:27017/yourDatabase', { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const createUser = async () => {
  try {
    const user = new User({
      username: 'johndoe',
      email: 'johndoe@example.com',
    });
    await user.save();
    console.log('User created:', user);
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

createUser();
`.trim(),
  },
  'README.md': {
    language: 'markdown',
    content: `
# fintech_webapp

This is a sample FinTech web application.

## Features
- User authentication
- Account management
- Transaction history

## Setup
1. Clone the repository.
2. Install dependencies: \`npm install\`
3. Configure your \`.env\` file.
4. Run the application: \`npm run dev\`
`.trim(),
  },
    '.gitignore': {
    language: 'plaintext',
    content: `
# Dependencies
/node_modules
/.pnp
.pnp.js

# Build output
/dist
/out

# Environment variables
.env
.env*.local
!.env.example

# IDE files
.vscode/
.idea/
*.swp
*.swo
`.trim(),
  },
};

const SyntaxHighlight: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  // Basic syntax highlighting for demonstration
  const highlight = (line: string) => {
    if (language === 'typescript' || language === 'javascript') {
      line = line.replace(/\b(const|let|var|async|await|try|catch|new|return|if|else|true|false|null|undefined)\b/g, '<span class="text-purple-400">$1</span>');
      line = line.replace(/\b(mongoose|User|console|require|module|exports|process|__dirname|__filename)\b/g, '<span class="text-blue-400">$1</span>');
      line = line.replace(/(\'.*?\'|\`.*?\`)/g, '<span class="text-green-400">$1</span>');
      line = line.replace(/(\/\/.*)/g, '<span class="text-gray-500">$1</span>');
      line = line.replace(/(\{\}|\(\)|\=\>)/g, '<span class="text-yellow-400">$1</span>');
    } else if (language === 'markdown') {
        line = line.replace(/^(#+)\s*(.*)/g, '<span class="text-blue-400 font-semibold">$1 $2</span>'); // Headings
        line = line.replace(/(\*\*|__)(.*?)\1/g, '<span class="font-bold">$2</span>'); // Bold
        line = line.replace(/(\*|_)(.*?)\1/g, '<span class="italic">$2</span>'); // Italic
        line = line.replace(/(\`)(.*?)\1/g, '<span class="bg-muted text-red-400 px-1 rounded">$2</span>'); // Inline code
    } else if (language === 'plaintext') {
        line = line.replace(/^(#.*)/g, '<span class="text-gray-500">$1</span>'); // Comments in .gitignore
    }
    return { __html: line };
  };

  return (
    <pre className="text-sm leading-relaxed">
      {code.split('\n').map((line, i) => (
        <div key={i} className="flex">
          <span className="w-10 pr-4 text-right text-muted-foreground select-none">{i + 1}</span>
          <span dangerouslySetInnerHTML={highlight(line)} />
        </div>
      ))}
    </pre>
  );
};


export function CodeEditorPane() {
  // In a real app, this would be managed by state, e.g., from FileExplorer selection
  const [openTabs, setOpenTabs] = useState([
    { id: 'index.tsx', name: 'index.tsx' },
    { id: 'README.md', name: 'README.md' },
    { id: '.gitignore', name: '.gitignore' },
  ]);
  const [activeTab, setActiveTab] = useState('index.tsx');

  const handleCloseTab = (tabIdToClose: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent tab selection when clicking close icon
    setOpenTabs(prevTabs => {
      const newTabs = prevTabs.filter(tab => tab.id !== tabIdToClose);
      if (activeTab === tabIdToClose && newTabs.length > 0) {
        setActiveTab(newTabs[0].id);
      } else if (newTabs.length === 0) {
        setActiveTab('');
      }
      return newTabs;
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1">
        <TabsList className="bg-card border-b border-border rounded-none justify-start h-10 px-0">
          {openTabs.map(tab => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="px-3 py-1.5 h-full data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-xs relative group"
            >
              {tab.name}
              <button 
                onClick={(e) => handleCloseTab(tab.id, e)}
                className="ml-2 p-0.5 rounded hover:bg-muted-foreground/20 opacity-0 group-hover:opacity-100 data-[state=active]:opacity-100"
                aria-label={`Close ${tab.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </TabsTrigger>
          ))}
        </TabsList>
        {openTabs.map(tab => (
          <TabsContent key={tab.id} value={tab.id} className="flex-1 overflow-hidden mt-0">
            <ScrollArea className="h-full p-4">
              <SyntaxHighlight code={mockFiles[tab.id as keyof typeof mockFiles]?.content || ''} language={mockFiles[tab.id as keyof typeof mockFiles]?.language || 'plaintext'} />
            </ScrollArea>
          </TabsContent>
        ))}
        {openTabs.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>Select a file to view its content.</p>
            </div>
        )}
      </Tabs>
    </div>
  );
}
