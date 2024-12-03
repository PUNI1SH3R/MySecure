import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { HelpCircle, Book, MessageCircle, FileQuestion, Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FAQ, SupportTicket } from '@/lib/types';

export function HelpFAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [supportTicket, setSupportTicket] = useState<SupportTicket>({
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const faqs: FAQ[] = [
    {
      question: "How does document encryption work?",
      answer: "Documents are encrypted using AES-256 encryption before being uploaded to IPFS. Only users with the correct decryption key can access the original content.",
      category: "security"
    },
    {
      question: "What is IPFS?",
      answer: "IPFS (InterPlanetary File System) is a peer-to-peer network for storing and sharing data in a distributed file system. Each file gets a unique CID (Content Identifier) for retrieval.",
      category: "technical"
    },
    {
      question: "How do I share encrypted documents?",
      answer: "After uploading, you'll receive a CID and QR code. Share these along with the decryption password with intended recipients. They can use our platform to decrypt and access the documents.",
      category: "usage"
    },
    {
      question: "Is my data secure?",
      answer: "Yes! We use industry-standard encryption, and your documents are encrypted before being uploaded. We never store your encryption keys, ensuring only you control access to your documents.",
      category: "security"
    }
  ];

  const filteredFaqs = searchQuery
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Ticket Submitted",
        description: "We'll get back to you as soon as possible.",
      });
      
      setSupportTicket({
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <HelpCircle className="h-5 w-5" />
            <h3 className="font-semibold">Frequently Asked Questions</h3>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs..."
              className="pl-9"
            />
          </div>

          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="space-y-2">
                <h4 className="font-medium">{faq.question}</h4>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
            {filteredFaqs.length === 0 && (
              <p className="text-center text-muted-foreground">
                No FAQs found matching your search.
              </p>
            )}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="space-y-4">
            <Book className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Documentation</h3>
            <p className="text-sm text-muted-foreground">
              Detailed guides on using all platform features
            </p>
            <Button variant="outline" className="w-full">View Docs</Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <FileQuestion className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Tutorials</h3>
            <p className="text-sm text-muted-foreground">
              Step-by-step guides for common tasks
            </p>
            <Button variant="outline" className="w-full">Watch Tutorials</Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <MessageCircle className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Support</h3>
            <p className="text-sm text-muted-foreground">
              Get help from our support team
            </p>
            <Button variant="outline" className="w-full">Contact Support</Button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmitTicket} className="space-y-4">
          <div className="flex items-center gap-2 text-primary mb-4">
            <MessageCircle className="h-5 w-5" />
            <h3 className="font-semibold">Contact Support</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              required
              value={supportTicket.email}
              onChange={(e) => setSupportTicket({ ...supportTicket, email: e.target.value })}
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              required
              value={supportTicket.subject}
              onChange={(e) => setSupportTicket({ ...supportTicket, subject: e.target.value })}
              placeholder="What's your question about?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              required
              value={supportTicket.message}
              onChange={(e) => setSupportTicket({ ...supportTicket, message: e.target.value })}
              placeholder="Describe your issue or question"
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Ticket'
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}