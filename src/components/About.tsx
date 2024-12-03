import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Database, Users, ArrowRight, Github } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function About() {
  const [showMore, setShowMore] = useState(false);
  const { toast } = useToast();

  const features = [
    {
      icon: Shield,
      title: "Secure Storage",
      description: "End-to-end encryption ensures your documents remain private and secure."
    },
    {
      icon: Database,
      title: "Decentralized",
      description: "Built on IPFS for reliable, distributed document storage."
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your encryption keys never leave your device."
    },
    {
      icon: Users,
      title: "Easy Sharing",
      description: "Share documents securely with QR codes and encryption keys."
    }
  ];

  const handleJoinWaitlist = () => {
    toast({
      title: "Joined Waitlist",
      description: "Thank you for your interest! We'll notify you when we launch.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Secure Document Storage for the Web3 Era</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            BlockDocs combines the power of blockchain technology with advanced encryption 
            to provide a secure, decentralized platform for document storage and sharing.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={handleJoinWaitlist}>
              Join Waitlist
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline">
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="space-y-4">
              <feature.icon className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-center">Our Mission</h3>
          <div className="relative">
            <p className={`text-center text-muted-foreground max-w-2xl mx-auto ${!showMore && 'line-clamp-3'}`}>
              We're building the future of document storage and sharing, where privacy 
              and security are fundamental rights, not optional features. Our platform 
              leverages blockchain technology and IPFS to ensure your documents remain 
              secure, accessible, and under your control. We believe in a decentralized 
              future where users have complete ownership of their data and can share it 
              securely with anyone, anywhere in the world.
            </p>
            {!showMore && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent" />
            )}
          </div>
          <Button
            variant="ghost"
            onClick={() => setShowMore(!showMore)}
            className="mx-auto block"
          >
            {showMore ? 'Show Less' : 'Read More'}
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-primary/5 hover:bg-primary/10 transition-colors duration-300">
        <div className="space-y-6 text-center">
          <h3 className="text-2xl font-bold">Ready to Get Started?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who trust BlockDocs for their secure document storage needs.
          </p>
          <Button size="lg" className="animate-pulse">
            Try BlockDocs Now
          </Button>
        </div>
      </Card>
    </div>
  );
}