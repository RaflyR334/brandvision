import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from './ui/dialog';
import { Button } from './ui/button';
import { Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

const Onboarding: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('brandvision_onboarding_seen');
    if (!hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    localStorage.setItem('brandvision_onboarding_seen', 'true');
    setIsOpen(false);
  };

  const steps = [
    {
      title: t('onboarding_welcome'),
      description: t('onboarding_step1'),
      icon: Sparkles,
      color: "text-primary"
    },
    {
      title: "AI Analysis",
      description: t('onboarding_step2'),
      icon: Zap,
      color: "text-amber-500"
    },
    {
      title: "Secure & Export",
      description: t('onboarding_step3'),
      icon: Shield,
      color: "text-emerald-500"
    }
  ];

  const currentStep = steps[step - 1];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <currentStep.icon className={cn("w-10 h-10", currentStep.color)} />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">{currentStep.title}</DialogTitle>
          <DialogDescription className="text-center text-lg">
            {currentStep.description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-2 py-4">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                step === i ? "w-8 bg-primary" : "bg-muted"
              )} 
            />
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleNext} className="w-full h-12 text-lg gap-2">
            {step === 3 ? t('finish') : "Next"}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Onboarding;
