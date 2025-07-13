import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { 
  FileText, 
  Wand2, 
  Save, 
  Download, 
  Share2, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Target,
  Brain,
  Sparkles,
  Eye,
  Edit3,
  Plus,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProposalSection {
  id: string;
  section_type: string;
  title: string;
  content: string;
  word_count: number;
  order_index: number;
  is_ai_generated: boolean;
  ai_confidence?: number;
  is_approved: boolean;
  last_modified: string;
}

interface Proposal {
  id: string;
  title: string;
  proposal_type: string;
  status: string;
  progress_percentage: number;
  word_count: number;
  sections_count: number;
  deadline?: string;
  last_modified: string;
  created_at: string;
}

const ProposalEditor: React.FC = () => {
  const { proposalId } = useParams<{ proposalId: string }>();
  const navigate = useNavigate();
  
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [sections, setSections] = useState<ProposalSection[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingContent, setEditingContent] = useState<string>('');
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [selectedAIModel, setSelectedAIModel] = useState('deepseek');
  const [customInstructions, setCustomInstructions] = useState('');
  const [selectedSections, setSelectedSections] = useState<string[]>([]);

  useEffect(() => {
    if (proposalId) {
      loadProposal();
      loadSections();
    }
  }, [proposalId]);

  const loadProposal = async () => {
    try {
      const response = await fetch(`/api/proposals/${proposalId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProposal(data);
      } else {
        toast({ title: "Error", description: "Failed to load proposal", variant: "destructive" });
      }
    } catch (error) {
      console.error('Load proposal error:', error);
      toast({ title: "Error", description: "Failed to load proposal", variant: "destructive" });
    }
  };

  const loadSections = async () => {
    try {
      const response = await fetch(`/api/proposals/${proposalId}/sections`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSections(data.sort((a: ProposalSection, b: ProposalSection) => a.order_index - b.order_index));
        if (data.length > 0 && !activeSection) {
          setActiveSection(data[0].id);
          setEditingContent(data[0].content);
        }
      }
    } catch (error) {
      console.error('Load sections error:', error);
    }
  };

  const handleSectionSelect = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      setActiveSection(sectionId);
      setEditingContent(section.content);
    }
  };

  const saveSection = async () => {
    if (!activeSection) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/proposals/sections/${activeSection}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: editingContent })
      });

      if (response.ok) {
        toast({ title: "Success", description: "Section saved successfully" });
        loadSections();
        loadProposal(); // Refresh metrics
      } else {
        toast({ title: "Error", description: "Failed to save section", variant: "destructive" });
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({ title: "Error", description: "Failed to save section", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const generateAIContent = async () => {
    if (selectedSections.length === 0) {
      toast({ title: "Error", description: "Please select sections to generate", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`/api/proposals/${proposalId}/ai-generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          proposal_id: proposalId,
          ai_model: selectedAIModel,
          generate_sections: selectedSections,
          custom_instructions: customInstructions || null,
          tone: 'professional',
          include_citations: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast({ 
          title: "Success", 
          description: `Generated ${data.generated_sections.length} sections with AI` 
        });
        loadSections();
        loadProposal();
        setShowAIDialog(false);
        setSelectedSections([]);
        setCustomInstructions('');
      } else {
        toast({ title: "Error", description: "Failed to generate AI content", variant: "destructive" });
      }
    } catch (error) {
      console.error('AI generation error:', error);
      toast({ title: "Error", description: "Failed to generate AI content", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const exportProposal = async (format: string) => {
    try {
      const response = await fetch(`/api/proposals/${proposalId}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ format })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${proposal?.title || 'proposal'}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({ title: "Success", description: `Exported as ${format.toUpperCase()}` });
      } else {
        toast({ title: "Error", description: "Failed to export proposal", variant: "destructive" });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({ title: "Error", description: "Failed to export proposal", variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'in_progress': return 'bg-blue-500';
      case 'review': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'submitted': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getSectionIcon = (sectionType: string) => {
    switch (sectionType) {
      case 'executive_summary': return <Target className="h-4 w-4" />;
      case 'project_description': return <FileText className="h-4 w-4" />;
      case 'objectives': return <CheckCircle className="h-4 w-4" />;
      case 'methodology': return <Brain className="h-4 w-4" />;
      case 'timeline': return <Clock className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const activeProposalSection = sections.find(s => s.id === activeSection);

  if (!proposal) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading proposal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/proposals')}>
              ← Back to Proposals
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{proposal.title}</h1>
              <div className="flex items-center space-x-4 mt-1">
                <Badge className={getStatusColor(proposal.status)}>
                  {proposal.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-500">
                  {proposal.word_count.toLocaleString()} words
                </span>
                <span className="text-sm text-gray-500">
                  {sections.length} sections
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-purple-600 border-purple-200">
                  <Wand2 className="h-4 w-4 mr-2" />
                  AI Generate
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                    AI Content Generation
                  </DialogTitle>
                  <DialogDescription>
                    Select sections to generate with AI assistance
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">AI Model</label>
                    <Select value={selectedAIModel} onValueChange={setSelectedAIModel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deepseek">DeepSeek (Recommended)</SelectItem>
                        <SelectItem value="gemini">Google Gemini</SelectItem>
                        <SelectItem value="mixed">Mixed Models</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Sections to Generate</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {sections.map((section) => (
                        <label key={section.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedSections.includes(section.section_type)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSections([...selectedSections, section.section_type]);
                              } else {
                                setSelectedSections(selectedSections.filter(s => s !== section.section_type));
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{section.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Custom Instructions (Optional)</label>
                    <Textarea
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                      placeholder="Any specific requirements or style preferences..."
                      className="mt-1"
                    />
                  </div>
                  
                  <Button 
                    onClick={generateAIContent} 
                    disabled={isGenerating || selectedSections.length === 0}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              onClick={saveSection} 
              disabled={isSaving || !activeSection}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
            
            <Select onValueChange={exportProposal}>
              <SelectTrigger className="w-32">
                <Download className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="docx">Word</SelectItem>
                <SelectItem value="markdown">Markdown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Completion Progress</span>
            <span>{Math.round(proposal.progress_percentage)}%</span>
          </div>
          <Progress value={proposal.progress_percentage} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar - Sections List */}
        <div className="w-80 bg-white border-r flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Proposal Sections</h2>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2">
              {sections.map((section) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg mb-2 cursor-pointer transition-all ${
                    activeSection === section.id 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSectionSelect(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getSectionIcon(section.section_type)}
                      <span className="font-medium text-sm">{section.title}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {section.is_ai_generated && (
                        <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI
                        </Badge>
                      )}
                      {section.is_approved && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>{section.word_count} words</span>
                      {section.ai_confidence && (
                        <span>AI: {Math.round(section.ai_confidence * 100)}%</span>
                      )}
                    </div>
                  </div>
                  
                  {section.content && (
                    <div className="mt-1">
                      <Progress 
                        value={Math.min((section.word_count / 500) * 100, 100)} 
                        className="h-1" 
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          {activeProposalSection ? (
            <>
              <div className="bg-white border-b p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{activeProposalSection.title}</h2>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>{activeProposalSection.word_count} words</span>
                      {activeProposalSection.is_ai_generated && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          <Brain className="h-3 w-3 mr-1" />
                          AI Generated
                        </Badge>
                      )}
                      <span>Last modified: {new Date(activeProposalSection.last_modified).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Comments
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-6 bg-gray-50">
                <Card className="h-full">
                  <CardContent className="p-6 h-full">
                    <Textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      placeholder={`Write your ${activeProposalSection.title.toLowerCase()} here...`}
                      className="h-full resize-none border-0 bg-white text-base leading-relaxed"
                      style={{ minHeight: '500px' }}
                    />
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a section to start editing</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalEditor;