import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

// Pages
import LandingPage from '@/pages/LandingPage';
import SignInPage from '@/pages/auth/SignInPage';
import SignUpPage from '@/pages/auth/SignUpPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import DashboardPage from '@/pages/DashboardPage';
import CareerIntelligencePage from '@/pages/CareerIntelligencePage';
import CareerTwinPage from '@/pages/CareerTwinPage';
import CareerMultiversePage from '@/pages/CareerMultiversePage';
import JobsPage from '@/pages/JobsPage';
import ResumeStudioPage from '@/pages/ResumeStudioPage';
import InterviewCoachPage from '@/pages/InterviewCoachPage';
import RelocationPage from '@/pages/RelocationPage';
import SalaryIntelligencePage from '@/pages/SalaryIntelligencePage';
import NationalizationPage from '@/pages/NationalizationPage';
import SettingsPage from '@/pages/SettingsPage';
import AIDecisionEnginePage from '@/pages/AIDecisionEnginePage';

// Layout
import AppLayout from '@/components/layout/AppLayout';
import { ProfileProvider } from '@/context/ProfileContext';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={LandingPage} />

      {/* Auth Routes — standalone layout, no AppLayout wrapper */}
      <Route path="/sign-in" component={SignInPage} />
      <Route path="/sign-up" component={SignUpPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />

      {/* Authenticated Routes wrapped in AppLayout */}
      <Route path="/dashboard">
        <AppLayout><DashboardPage /></AppLayout>
      </Route>
      <Route path="/career-intelligence">
        <AppLayout><CareerIntelligencePage /></AppLayout>
      </Route>
      <Route path="/career-twin">
        <AppLayout><CareerTwinPage /></AppLayout>
      </Route>
      <Route path="/career-multiverse">
        <AppLayout><CareerMultiversePage /></AppLayout>
      </Route>
      <Route path="/jobs">
        <AppLayout><JobsPage /></AppLayout>
      </Route>
      <Route path="/resume-studio">
        <AppLayout><ResumeStudioPage /></AppLayout>
      </Route>
      <Route path="/interview-coach">
        <AppLayout><InterviewCoachPage /></AppLayout>
      </Route>
      <Route path="/relocation">
        <AppLayout><RelocationPage /></AppLayout>
      </Route>
      <Route path="/salary-intelligence">
        <AppLayout><SalaryIntelligencePage /></AppLayout>
      </Route>
      <Route path="/nationalization">
        <AppLayout><NationalizationPage /></AppLayout>
      </Route>
      <Route path="/ai-decision-engine">
        <AppLayout><AIDecisionEnginePage /></AppLayout>
      </Route>
      <Route path="/settings">
        <AppLayout><SettingsPage /></AppLayout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ProfileProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
        </ProfileProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
