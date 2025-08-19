import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Ticket, Settings, User } from 'lucide-react';
interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  isActive?: boolean;
}
const navigationItems: NavigationItem[] = [{
  id: 'new-repair',
  label: 'New Repair',
  icon: Wrench,
  isActive: false
}, {
  id: 'tickets-list',
  label: 'Tickets List',
  icon: Ticket,
  isActive: false
}, {
  id: 'job-status',
  label: 'Job Status',
  icon: Settings,
  isActive: false
}, {
  id: 'client-list',
  label: 'Client List',
  icon: User,
  isActive: true
}];
export function SidebarNavigation() {
  return <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* App Header */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">Jewellery Repair</h1>
        <p className="text-sm text-sidebar-foreground/70 mt-1">Management System</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map(item => {
          const Icon = item.icon;
          return <li key={item.id}>
                <motion.button whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors border border-black
                    ${item.isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm' : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'}
                  `} style={{
              borderStyle: "none",
              borderColor: "rgb(0, 0, 0)",
              borderRadius: "8px",
              borderWidth: "1px"
            }}>
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              </li>;
        })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border bg-sidebar">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Admin User</p>
            <p className="text-xs text-sidebar-foreground/70 truncate">admin@jewelry.com</p>
          </div>
        </div>
      </div>
    </aside>;
}