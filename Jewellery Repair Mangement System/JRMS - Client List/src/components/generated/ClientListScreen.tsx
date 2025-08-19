import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, User, Phone, Mail, Calendar, Wrench, Eye, Edit, Filter, ChevronDown, ChevronUp, MoreHorizontal, Image as ImageIcon } from 'lucide-react';
import { SidebarNavigation } from './SidebarNavigation';
import { ClientLookupModal } from './ClientLookupModal';
import { ClientDetailView } from './ClientDetailView';
interface Client {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  lastRepair?: string;
  totalRepairs: number;
  address?: string;
  joinDate?: string;
  notes?: string;
}
type SortOption = 'name' | 'lastRepair' | 'totalRepairs';
type SortDirection = 'asc' | 'desc';

// Extended mock client data with repair counts
const mockClients: Client[] = [{
  id: '1',
  name: 'Sarah Johnson',
  mobile: '+1 (555) 123-4567',
  email: 'sarah.johnson@email.com',
  lastRepair: '2024-01-15',
  totalRepairs: 8,
  address: "123 Main St, Anytown, ST 12345",
  joinDate: "2022-03-15",
  notes: "Prefers gold jewelry repairs. Very particular about finish quality."
}, {
  id: '2',
  name: 'Michael Chen',
  mobile: '+1 (555) 987-6543',
  email: 'michael.chen@email.com',
  lastRepair: '2024-01-10',
  totalRepairs: 12,
  address: "456 Oak Ave, Somewhere, ST 67890",
  joinDate: "2021-11-08",
  notes: "Regular customer. Often brings vintage watches for repair."
}, {
  id: '3',
  name: 'Emily Rodriguez',
  mobile: '+1 (555) 456-7890',
  email: 'emily.rodriguez@email.com',
  lastRepair: '2024-01-08',
  totalRepairs: 5,
  address: "789 Pine Rd, Elsewhere, ST 13579",
  joinDate: "2023-06-20"
}, {
  id: '4',
  name: 'David Thompson',
  mobile: '+1 (555) 321-0987',
  email: 'david.thompson@email.com',
  lastRepair: '2023-12-20',
  totalRepairs: 15,
  joinDate: "2020-09-12",
  notes: "Collector of antique jewelry. Requires specialized restoration techniques."
}, {
  id: '5',
  name: 'Lisa Wang',
  mobile: '+1 (555) 654-3210',
  email: 'lisa.wang@email.com',
  lastRepair: '2024-01-12',
  totalRepairs: 3,
  joinDate: "2023-10-05"
}, {
  id: '6',
  name: 'Robert Martinez',
  mobile: '+1 (555) 789-0123',
  email: 'robert.martinez@email.com',
  lastRepair: '2023-11-28',
  totalRepairs: 7,
  address: "321 Elm St, Nowhere, ST 24680",
  joinDate: "2022-07-30",
  notes: "Prefers silver jewelry. Quick turnaround preferred."
}];
export function ClientListScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showClientLookup, setShowClientLookup] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Filter and sort clients
  const filteredAndSortedClients = useMemo(() => {
    let filtered = mockClients.filter(client => client.name.toLowerCase().includes(searchTerm.toLowerCase()) || client.mobile.includes(searchTerm) || client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()));
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'lastRepair':
          aValue = a.lastRepair ? new Date(a.lastRepair).getTime() : 0;
          bValue = b.lastRepair ? new Date(b.lastRepair).getTime() : 0;
          break;
        case 'totalRepairs':
          aValue = a.totalRepairs;
          bValue = b.totalRepairs;
          break;
        default:
          return 0;
      }
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return filtered;
  }, [searchTerm, sortBy, sortDirection]);
  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('asc');
    }
  };
  const handleNewRepair = (clientId: string) => {
    console.log('Creating new repair for client:', clientId);
    setActiveDropdown(null);
  };
  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
  };
  const handleCloseClientDetail = () => {
    setSelectedClient(null);
  };
  const handleEditClient = (client: Client) => {
    console.log('Editing client:', client);
    setSelectedClient(null);
  };
  const handleRowClick = (client: Client, e: React.MouseEvent) => {
    // Don't trigger row click if clicking on the action button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    handleViewClient(client);
  };
  const getSortIcon = (column: SortOption) => {
    if (sortBy !== column) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 inline ml-1" /> : <ChevronDown className="h-4 w-4 inline ml-1" />;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  return <div className="flex h-screen bg-background">
      <SidebarNavigation />
      
      <main className="flex-1 p-4 sm:p-8 overflow-auto" style={{
      width: "1250px",
      maxWidth: "1250px"
    }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Client List</h1>
          </header>

          {/* Search and Actions Bar */}
          <div className="bg-card rounded-lg border border-border p-4 sm:p-6 shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" placeholder="Search by name, mobile, or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent" style={{
                width: "500px",
                maxWidth: "500px"
              }} />
              </div>

              {/* Add New Client Button */}
              <button onClick={() => setShowClientLookup(true)} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
                <Plus className="h-4 w-4 text-white" />
                <span className="text-white">Add New Client</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          {filteredAndSortedClients.length > 0 ? <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left p-4 font-semibold text-foreground cursor-pointer hover:bg-muted/70 transition-colors" onClick={() => handleSort('name')}>
                        Name {getSortIcon('name')}
                      </th>
                      <th className="text-left p-4 font-semibold text-foreground">
                        Contact
                      </th>
                      <th className="text-left p-4 font-semibold text-foreground cursor-pointer hover:bg-muted/70 transition-colors" onClick={() => handleSort('totalRepairs')}>
                        Total Repairs {getSortIcon('totalRepairs')}
                      </th>
                      <th className="text-left p-4 font-semibold text-foreground">
                        Last Repair
                      </th>
                      <th className="text-left p-4 font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedClients.map((client, index) => <tr key={client.id} className={`border-b border-border hover:bg-muted/50 transition-colors cursor-pointer ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`} onClick={e => handleRowClick(client, e)}>
                        {/* Name */}
                        <td className="p-4">
                          <div className="font-semibold text-card-foreground">
                            {client.name}
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-base">
                            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-foreground font-medium">
                              {client.mobile}
                            </span>
                          </div>
                        </td>

                        {/* Total Repairs */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="text-lg font-bold text-foreground">
                              {client.totalRepairs}
                            </div>
                            <Wrench className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </td>

                        {/* Last Repair */}
                        <td className="p-4" style={{
                    paddingTop: "3px",
                    paddingBottom: "3px"
                  }}>
                          <div className="w-16 h-12 bg-muted/30 border border-border rounded-md flex items-center justify-center" style={{
                      width: "90px",
                      maxWidth: "90px",
                      height: "60px",
                      minHeight: "min-content"
                    }}>
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-4">
                          <button onClick={() => handleNewRepair(client.id)} className="px-4 py-2 bg-transparent border border-border text-foreground rounded-md hover:bg-muted/50 transition-colors flex items-center gap-2">
                            <Wrench className="h-4 w-4" />
                            New Repair
                          </button>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </div> : (/* Empty State */
        <div className="text-center py-16">
              <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No clients found
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchTerm ? "Try adjusting your search terms or add a new client to get started." : "You haven't added any clients yet. Add your first client to begin managing repairs."}
              </p>
              <button onClick={() => setShowClientLookup(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                <Plus className="h-4 w-4" />
                Add Your First Client
              </button>
            </div>)}
        </div>
      </main>

      {/* Client Lookup Modal */}
      {showClientLookup && <ClientLookupModal onClose={() => setShowClientLookup(false)} onSelect={client => {
      console.log('Added new client:', client);
      setShowClientLookup(false);
    }} />}

      {/* Client Detail View */}
      {selectedClient && <ClientDetailView client={selectedClient} onClose={handleCloseClientDetail} onEdit={handleEditClient} onNewRepair={handleNewRepair} />}
    </div>;
}