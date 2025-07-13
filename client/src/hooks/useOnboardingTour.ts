import { useState, useEffect } from 'react';

interface OnboardingState {
  hasCompletedTour: boolean;
  currentStep: number;
  isActive: boolean;
  earnedCredits: number;
}

export const useOnboardingTour = () => {
  const [state, setState] = useState<OnboardingState>({
    hasCompletedTour: false,
    currentStep: 0,
    isActive: false,
    earnedCredits: 0
  });

  // Check if user has completed onboarding
  useEffect(() => {
    const completed = localStorage.getItem('onboarding_completed');
    const shouldShowTour = !completed && window.location.pathname.includes('/jobs');
    
    setState(prev => ({
      ...prev,
      hasCompletedTour: completed === 'true',
      isActive: shouldShowTour
    }));
  }, []);

  const startTour = () => {
    setState(prev => ({
      ...prev,
      isActive: true,
      currentStep: 0
    }));
  };

  const completeTour = async () => {
    // Award bonus credits for completing the tour
    const bonusCredits = 100; // Total tour completion bonus
    
    try {
      const response = await fetch('/api/auth/award-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: bonusCredits,
          reason: 'Onboarding tour completion'
        }),
      });

      if (response.ok) {
        setState(prev => ({
          ...prev,
          hasCompletedTour: true,
          isActive: false,
          earnedCredits: bonusCredits
        }));
        
        localStorage.setItem('onboarding_completed', 'true');
        localStorage.setItem('onboarding_date', new Date().toISOString());
        
        // Show success notification
        if (window.location.pathname.includes('/jobs')) {
          setTimeout(() => {
            window.location.reload(); // Refresh to show updated credit balance
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Failed to award onboarding credits:', error);
      // Complete tour anyway
      setState(prev => ({
        ...prev,
        hasCompletedTour: true,
        isActive: false
      }));
      localStorage.setItem('onboarding_completed', 'true');
    }
  };

  const skipTour = () => {
    setState(prev => ({
      ...prev,
      isActive: false
    }));
    localStorage.setItem('onboarding_skipped', 'true');
  };

  const resetTour = () => {
    localStorage.removeItem('onboarding_completed');
    localStorage.removeItem('onboarding_skipped');
    localStorage.removeItem('onboarding_date');
    setState({
      hasCompletedTour: false,
      currentStep: 0,
      isActive: true,
      earnedCredits: 0
    });
  };

  return {
    ...state,
    startTour,
    completeTour,
    skipTour,
    resetTour
  };
};

export default useOnboardingTour;