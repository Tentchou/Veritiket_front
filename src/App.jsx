import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import LandingPage from './components/LandingPage';
import DashboardOverview from './pages/DashboardOverview';
import EventsList from './pages/EventsList'; // <-- Import de la nouvelle page
import { ThemeProvider } from './contexts/ThemeContext';
import TicketsList from './pages/TicketsList';
import CreateEvent from './pages/CreateEvent';
import GenerateTickets from './pages/GenerateTickets';
import PrintTickets from './pages/PrintTickets';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Toaster position="top-right" richColors closeButton />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardOverview />} />
          
          {/* NOUVELLE ROUTE : Connectée au menu 'Mes Événements' de la Sidebar */}
          <Route path="/dashboard/events" element={<EventsList />} />
          <Route path="/dashboard/tickets" element={<TicketsList />} />
          <Route path="/dashboard/events/new" element={<CreateEvent />} />
          <Route path="/dashboard/tickets/generate" element={<GenerateTickets />} />
          <Route path="/dashboard/tickets/print" element={<PrintTickets />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}