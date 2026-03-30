import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TimesheetForm from './components/TimesheetForm';
import Footer from './components/Footer';
import { loadTimesheetData, clearTimesheetData } from './utils/localStorage';

/**
 * Main App component
 * Mobile-first responsive design
 */
function App() {
  const [timesheetData, setTimesheetData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data from localStorage on component mount
  useEffect(() => {
    const loadData = () => {
      try {
        const data = loadTimesheetData();
        setTimesheetData(data);
      } catch (error) {
        console.error('Error loading timesheet data:', error);
        setTimesheetData(loadTimesheetData());
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle data changes from the form
  const handleDataChange = (data) => {
    setTimesheetData(data);
  };

  // Handle clear all action
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all entries? This action cannot be undone.')) {
      clearTimesheetData();
      const freshData = loadTimesheetData();
      setTimesheetData(freshData);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow py-4 md:py-8">
        <TimesheetForm
          initialData={timesheetData}
          onDataChange={handleDataChange}
          onClear={handleClearAll}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
