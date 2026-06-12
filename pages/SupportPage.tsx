import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Phone, 
  Search, 
  ChevronDown,
  ExternalLink,
  BookOpen,
  MessageCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '../components/ui/accordion';
import { toast } from 'sonner';

const SupportPage: React.FC = () => {
  const { t } = useTranslation();

  const faqs = [
    {
      q: "How accurate is the AI classification?",
      a: "Our AI uses the latest Gemini 3.0 models, which are trained on millions of professional profiles. While highly accurate, we recommend reviewing and refining the results to best match your personal brand."
    },
    {
      q: "Can I export my results to LinkedIn?",
      a: "Yes! You can copy the brand summary directly to your LinkedIn 'About' section. You can also download a PDF version to use as a reference for your profile updates."
    },
    {
      q: "How do I earn commissions as an affiliate?",
      a: "Simply share your referral link found in the Affiliate section. When someone signs up for a Pro plan using your link, you'll earn a 30% recurring commission."
    },
    {
      q: "What data do you store?",
      a: "We store your professional bio and the generated classifications to provide you with a history of your brand evolution. We never share this data with third parties."
    },
    {
      q: "How do I cancel my Pro subscription?",
      a: "You can cancel anytime from the Subscription section in your settings. Your Pro features will remain active until the end of your current billing cycle."
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! Our support team will get back to you within 24 hours.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">How can we help?</h1>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search for help articles..." className="pl-10 h-12 text-lg shadow-sm" />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold">Knowledge Base</h3>
            <p className="text-xs text-muted-foreground">Detailed guides and tutorials for every feature.</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold">Community Forum</h3>
            <p className="text-xs text-muted-foreground">Connect with other professionals and share tips.</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold">Live Chat</h3>
            <p className="text-xs text-muted-foreground">Real-time support from our dedicated team.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button variant="link" className="px-0 gap-2">
            View all FAQs <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>Can't find what you're looking for? We're here to help.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Your email" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What can we help with?" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea 
                  id="message" 
                  className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Tell us more about your issue..."
                  required
                />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="pt-12 border-t">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <Mail className="w-6 h-6 text-primary mx-auto" />
            <h4 className="font-bold">Email Support</h4>
            <p className="text-sm text-muted-foreground">support@brandvision.ai</p>
          </div>
          <div className="space-y-2">
            <Phone className="w-6 h-6 text-primary mx-auto" />
            <h4 className="font-bold">Phone Support</h4>
            <p className="text-sm text-muted-foreground">+1 (555) 000-0000</p>
          </div>
          <div className="space-y-2">
            <HelpCircle className="w-6 h-6 text-primary mx-auto" />
            <h4 className="font-bold">Help Center</h4>
            <p className="text-sm text-muted-foreground">help.brandvision.ai</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
