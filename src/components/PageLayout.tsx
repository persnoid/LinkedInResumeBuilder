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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {sidebarContent}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {mainContent}
      </div>
    </div>
  );
};