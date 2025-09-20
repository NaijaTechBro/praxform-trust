import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Public pages
import HomePage from './pages/Home';
import SignIn from './pages/Auth/User/SignIn';
import CreateAccount from './pages/Auth/User/CreateAccount';
import BusinessSetup from './pages/Auth/User/BusinessSetup';
import LoginCode from './pages/Auth/User/LoginCode';
import ForgotPassword from './pages/Auth/User/ForgotPassword';
import ResetPassword from './pages/Auth/User/ResetPassword';
import ResendVerification from './pages/Auth/User/ResendVerification';
import VerifyCode from './pages/Auth/User/VerifyCode';
import BookADemo from './components/Home/BookADemo';
import Pricing from './components/Home/Pricing';

// New Public Form Page
import PublicForm from './pages/Submission/PublicForm';

// Protected components that use the Layout
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout/Layout';
import NewFormPage from './pages/Form/NewFormPage';
import BlankFormPage from './pages/Form/BlankFormPage';
import EditFormPage from './pages/Form/EditFormPage';
import Ach from './pages/Templates/ach/Ach';
import W9 from './pages/Templates/w9/W9';
import CreditCard from './pages/Templates/credit_card/Credit_Card';
import Templates from './pages/Templates/Templates';
import Forms from './pages/Form/Forms';
import Auditlogs from './pages/Audit/AuditLogs';
import ChangePassword from './pages/Auth/User/ChangePassword';
import Submissions from './pages/Submission/Submission';
import CreateFromTemplatePage from './components/Template/CreateFormTemplate';
import SettingsPage from './pages/Settings/SettingsPage';
import BillingSettings from './pages/Settings/BillingSettings';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { FormProvider } from './context/FormContext';
import { SubmissionProvider } from './context/SubmissionContext';
import { WebhookProvider } from './context/WebhookContext';
import { AuditProvider } from './context/AuditContext';
import { TemplateProvider } from './context/TemplateContext';
import { OrganizationProvider } from './context/OrganizationContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { PaymentProvider } from './context/PaymentContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { UploadProvider } from './context/UploadContext';

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ThemeProvider>
    <AuthProvider>
      <FormProvider>
        <SubmissionProvider>
          <WebhookProvider>
            <AuditProvider>
            <TemplateProvider>
              <OrganizationProvider>
              <NotificationProvider>
                <PaymentProvider>
                  <UploadProvider>
            <Router>
              <Routes>
                {/* --- Public Routes (Accessible to everyone) --- */}
                <Route path="/" element={<HomePage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<CreateAccount />} />
                <Route path="/login-code" element={<LoginCode />} />
                <Route path="/business-setup" element={<BusinessSetup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
                <Route path="/verify-code" element={<VerifyCode />} />
                <Route path="/resend-verification" element={<ResendVerification />} />
                <Route path="/demo" element={<BookADemo />} />
                <Route path="/pricing" element={<Pricing />} />

                {/* The PublicForm route must be public to allow anyone with the link to access it */}
                <Route path="/form/:formId/:accessCode" element={<PublicForm />} />

                <Route path="/form/public/:formId/:accessCode" element={<PublicForm />} />

                {/* --- Protected Routes (Require authentication) --- */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<Layout />}>
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/create-form' element={<NewFormPage />} />
                    <Route path='/templates' element={<Templates />} />
                    <Route path='/templates/ach' element={<Ach />} />
                    <Route path='/templates/w9' element={<W9 />} />
                    <Route path='/templates/credit-card' element={<CreditCard />} />
                    <Route path='/forms' element={<Forms />} />
                    <Route path='/audit-logs' element={<Auditlogs />} />
                    <Route path='/change-password' element={<ChangePassword />} />
                    <Route path='/submissions' element={<Submissions />} />
                    <Route path='/settings' element={<SettingsPage />} />
                    <Route path='/settings/billing' element={<BillingSettings />} />
                  </Route>
                  {/* Full-screen protected routes */}
                  <Route path='/forms/new' element={<BlankFormPage />} />
                  <Route path='/forms/edit/:id' element={<EditFormPage />} />

                  <Route path='/forms/new/template/:templateId' element={<CreateFromTemplatePage />} />
                </Route>
              </Routes>
            </Router>
            </UploadProvider>
            </PaymentProvider>
            </NotificationProvider>
            </OrganizationProvider>
            </TemplateProvider>
            </AuditProvider>
          </WebhookProvider>
        </SubmissionProvider>
      </FormProvider>
    </AuthProvider>
    </ThemeProvider>
    </GoogleOAuthProvider>
  );
};

export default App;

