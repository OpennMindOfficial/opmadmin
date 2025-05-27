
// src/app/code-changes/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Code2, GitFork, GitMerge, ChevronDown, Lightbulb, Bug, RefreshCw, MessageSquare, GitCommit, FileCheck, FileDiff as FileDiffIcon } from 'lucide-react';
import { CodeDiffViewer } from '@/components/code-editor/CodeDiffViewer'; // Renamed for clarity

const mockDiffData = [
  { type: 'hunk', content: '@@ -1,4 +1,4 @@' },
  { type: 'context', oldLineNum: 1, newLineNum: 1, content: '# My Project' },
  { type: 'deletion', oldLineNum: 2, newLineNum: null, content: '-This is the old README.' },
  { type: 'addition', oldLineNum: null, newLineNum: 2, content: '+## Getting Started' },
  { type: 'context', oldLineNum: 3, newLineNum: 3, content: 'To get started with the project, follow these steps:' },
  { type: 'context', oldLineNum: 4, newLineNum: 4, content: '' },
  { type: 'context', oldLineNum: 5, newLineNum: 5, content: '1. Clone the repository:' },
  { type: 'context', oldLineNum: 6, newLineNum: 6, content: '   ```bash' },
  { type: 'context', oldLineNum: 7, newLineNum: 7, content: '   git clone https://github.com/my-org/my-project.git' },
  { type: 'context', oldLineNum: 8, newLineNum: 8, content: '   ```' },
  { type: 'context', oldLineNum: 9, newLineNum: 9, content: '' },
  { type: 'context', oldLineNum: 10, newLineNum: 10, content: '2. Navigate to the project directory:' },
  { type: 'context', oldLineNum: 11, newLineNum: 11, content: '   ```bash' },
  { type: 'context', oldLineNum: 12, newLineNum: 12, content: '   cd my-project' },
  { type: 'context', oldLineNum: 13, newLineNum: 13, content: '   ```' },
  { type: 'context', oldLineNum: 14, newLineNum: 14, content: '' },
  { type: 'context', oldLineNum: 15, newLineNum: 15, content: '3. Install the dependencies:' },
  { type: 'addition', oldLineNum: null, newLineNum: 16, content: '+   Install dependencies using your preferred package manager (e.g., npm, yarn, pnpm).' },
  { type: 'addition', oldLineNum: null, newLineNum: 17, content: '+   Example using npm:' },
  { type: 'context', oldLineNum: 16, newLineNum: 18, content: '   ```bash' },
  { type: 'context', oldLineNum: 17, newLineNum: 19, content: '   npm install' },
  { type: 'context', oldLineNum: 18, newLineNum: 20, content: '   ```' },
  { type: 'context', oldLineNum: 19, newLineNum: 21, content: '' },
  { type: 'context', oldLineNum: 20, newLineNum: 22, content: '4. Run the tests:' },
  { type: 'addition', oldLineNum: null, newLineNum: 23, content: '+   Make sure all tests pass before proceeding.' },
  { type: 'context', oldLineNum: 21, newLineNum: 24, content: '   ```bash' },
  { type: 'context', oldLineNum: 22, newLineNum: 25, content: '   npm test' },
  { type: 'context', oldLineNum: 23, newLineNum: 26, content: '   ```' },
  { type: 'context', oldLineNum: 24, newLineNum: 27, content: '' },
  { type: 'context', oldLineNum: 25, newLineNum: 28, content: '5. Start the development server:' },
  { type: 'addition', oldLineNum: null, newLineNum: 29, content: '+   This will typically start the server on localhost.' },
  { type: 'context', oldLineNum: 26, newLineNum: 30, content: '   ```bash' },
  { type: 'context', oldLineNum: 27, newLineNum: 31, content: '   npm start' },
  { type: 'context', oldLineNum: 28, newLineNum: 32, content: '   ```' },
  { type: 'context', oldLineNum: 29, newLineNum: 33, content: 'The application should now be running at `http://localhost:3000`.' },
  { type: 'addition', oldLineNum: null, newLineNum: 34, content: '+' },
  { type: 'addition', oldLineNum: null, newLineNum: 35, content: '+## Environment Setup' },
  { type: 'addition', oldLineNum: null, newLineNum: 36, content: '+Ensure you have Node.js version X.Y.Z or higher.' },
  { type: 'addition', oldLineNum: null, newLineNum: 37, content: '+Create a `.env` file based on `.env.example` for local configuration.' },
  { type: 'context', oldLineNum: 30, newLineNum: 38, content: '' },
  { type: 'context', oldLineNum: 31, newLineNum: 39, content: '## Contributing' },
  { type: 'deletion', oldLineNum: 32, newLineNum: null, content: '-We welcome contributions!' },
  { type: 'addition', oldLineNum: null, newLineNum: 40, content: '+We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for more information.' },
  { type: 'context', oldLineNum: 33, newLineNum: 41, content: '' },
  { type: 'context', oldLineNum: 34, newLineNum: 42, content: '## License' },
  { type: 'context', oldLineNum: 35, newLineNum: 43, content: 'This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.' },
  { type: 'addition', oldLineNum: null, newLineNum: 44, content: '+' },
  { type: 'addition', oldLineNum: null, newLineNum: 45, content: '+## Code of Conduct' },
  { type: 'addition', oldLineNum: null, newLineNum: 46, content: '+Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.' },
  { type: 'context', oldLineNum: 36, newLineNum: 47, content: '' },
  { type: 'context', oldLineNum: 37, newLineNum: 48, content: '## Contact' },
  { type: 'context', oldLineNum: 38, newLineNum: 49, content: 'If you have any questions or feedback, please contact us at support@example.com.' },
];


export default function CodeChangesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Main Header */}
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code2 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">CodeChange Review</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <GitFork className="mr-2 h-4 w-4" /> View Repository
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" className="bg-green-600 hover:bg-green-700 text-white">
                  <GitMerge className="mr-2 h-4 w-4" /> Merge Pull Request <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Create a merge commit</DropdownMenuItem>
                <DropdownMenuItem>Squash and merge</DropdownMenuItem>
                <DropdownMenuItem>Rebase and merge</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>Merging is blocked</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="person user" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </section>

        {/* PR Details Section */}
        <section className="space-y-3 border-b pb-6 border-border">
          <h2 className="text-2xl font-semibold">Update README.md</h2>
          <p className="text-muted-foreground text-sm">
            Updated the README file to include more detailed instructions on setting up the development environment and running tests.
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Lightbulb className="mr-2 h-4 w-4" /> Provide Suggestions
            </Button>
            <Button variant="outline" size="sm">
              <Bug className="mr-2 h-4 w-4" /> Check for Bugs
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
        </section>

        {/* Tabs Section */}
        <Tabs defaultValue="files" className="w-full">
          <TabsList className="border-b border-border rounded-none bg-transparent p-0 justify-start">
            <TabsTrigger value="conversation" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 py-2 text-muted-foreground">
              <MessageSquare className="mr-2 h-4 w-4" /> Conversation
            </TabsTrigger>
            <TabsTrigger value="commits" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 py-2 text-muted-foreground">
              <GitCommit className="mr-2 h-4 w-4" /> Commits <span className="ml-2 bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs">3</span>
            </TabsTrigger>
            <TabsTrigger value="checks" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 py-2 text-muted-foreground">
              <FileCheck className="mr-2 h-4 w-4" /> Checks
            </TabsTrigger>
            <TabsTrigger value="files" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 py-2 text-muted-foreground">
              <FileDiffIcon className="mr-2 h-4 w-4" /> Files changed <span className="ml-2 bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs">1</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="conversation" className="py-6">
            <p className="text-muted-foreground">Conversation content will go here.</p>
          </TabsContent>
          <TabsContent value="commits" className="py-6">
            <p className="text-muted-foreground">Commits list will go here.</p>
          </TabsContent>
          <TabsContent value="checks" className="py-6">
            <p className="text-muted-foreground">Checks information will go here.</p>
          </TabsContent>
          <TabsContent value="files" className="py-6">
            <CodeDiffViewer diff={mockDiffData} fileName="README.md" additions={10} deletions={2} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

    