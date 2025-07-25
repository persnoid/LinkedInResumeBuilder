import React from 'react';

interface PageLayoutProps {
  sidebarContent: React.ReactNode;
  mainContent: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ 
  sidebarContent, 
  mainContent 
}) => {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
        {sidebarContent}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {mainContent}
      </div>
    </div>
  );
};