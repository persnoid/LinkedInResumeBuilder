export interface PageSection {
  id: string;
  type: 'text' | 'image' | 'video' | 'form' | 'custom';
  title: string;
  content: any;
  styles: {
    width: 'full' | 'half' | 'third' | 'quarter' | 'custom';
    customWidth?: string;
    background: string;
    padding: string;
    margin: string;
    borderRadius: string;
    shadow: string;
    textAlign: 'left' | 'center' | 'right';
    minHeight?: string;
  };
  order: number;
  visible: boolean;
}

export interface SidebarWidget {
  id: string;
  type: 'text' | 'image' | 'list' | 'contact' | 'social' | 'custom';
  title: string;
  content: any;
  styles: {
    background: string;
    padding: string;
    margin: string;
    borderRadius: string;
    shadow: string;
  };
  order: number;
  visible: boolean;
  collapsible: boolean;
  collapsed: boolean;
}

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  mainSections: PageSection[];
  sidebarWidgets: SidebarWidget[];
  layout: {
    sidebarPosition: 'left' | 'right' | 'none';
    sidebarWidth: string;
    maxWidth: string;
    spacing: string;
    responsive: {
      hideSidebarOnMobile: boolean;
      stackOnMobile: boolean;
      mobileBreakpoint: string;
    };
  };
  styles: {
    backgroundColor: string;
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  type: PageSection['type'];
  defaultContent: any;
  defaultStyles: PageSection['styles'];
  category: 'content' | 'media' | 'interactive' | 'layout';
  preview: string;
}

export interface HistoryState {
  id: string;
  action: 'add' | 'remove' | 'move' | 'edit' | 'style';
  timestamp: number;
  data: any;
}