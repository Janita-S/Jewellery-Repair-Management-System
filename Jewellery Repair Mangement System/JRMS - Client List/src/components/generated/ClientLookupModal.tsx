import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, User, Phone, Plus } from 'lucide-react';
interface Client {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  lastRepair?: string;
}
interface ClientLookupModalProps {
  onClose: () => void;
  onSelect: (client: Client) => void;
}

// Mock client data - in a real app this would come from an API
const mockClients: Client[] = [{
  id: '1',
  name: 'Sarah Johnson',
  mobile: '+1 (555) 123-4567',
  email: 'sarah.johnson@email.com',
  lastRepair: '2024-01-15'
}, {
  id: '2',
  name: 'Michael Chen',
  mobile: '+1 (555) 987-6543',
  email: 'michael.chen@email.com',
  lastRepair: '2024-01-10'
}, {
  id: '3',
  name: 'Emily Rodriguez',
  mobile: '+1 (555) 456-7890',
  email: 'emily.rodriguez@email.com',
  lastRepair: '2024-01-08'
}, {
  id: '4',
  name: 'David Thompson',
  mobile: '+1 (555) 321-0987',
  email: 'david.thompson@email.com',
  lastRepair: '2023-12-20'
}];
export function ClientLookupModal({
  onClose,
  onSelect
}: ClientLookupModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState<Client[]>(mockClients);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    mobile: '',
    email: ''
  });
  useEffect(() => {
    const filtered = mockClients.filter(client => client.name.toLowerCase().includes(searchTerm.toLowerCase()) || client.mobile.includes(searchTerm) || client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredClients(filtered);
  }, [searchTerm]);
  const handleAddNewClient = () => {
    if (!newClient.name || !newClient.mobile) {
      alert('Please fill in name and mobile number');
      return;
    }
    const client: Client = {
      id: Date.now().toString(),
      name: newClient.name,
      mobile: newClient.mobile,
      email: newClient.email
    };
    onSelect(client);
  };
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return <AnimatePresence>
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
        <motion.div initial={{
        scale: 0.95,
        opacity: 0
      }} animate={{
        scale: 1,
        opacity: 1
      }} exit={{
        scale: 0.95,
        opacity: 0
      }} className="bg-card rounded-lg border border-border shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-card-foreground">
              {isAddingNew ? 'Add New Client' : 'Select Client'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {!isAddingNew ? <>
              {/* Search */}
              <div className="p-6 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="text" placeholder="Search by name, mobile, or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent" autoFocus />
                </div>
              </div>

              {/* Client List */}
              <div className="flex-1 overflow-auto max-h-96">
                {filteredClients.length > 0 ? <div className="p-2">
                    {filteredClients.map(client => <motion.button key={client.id} whileHover={{
                scale: 1.01
              }} whileTap={{
                scale: 0.99
              }} onClick={() => onSelect(client)} className="w-full p-4 text-left hover:bg-accent rounded-lg transition-colors border border-transparent hover:border-border">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-card-foreground truncate">
                              {client.name}
                            </h3>
                            <div className="flex items-center gap-1 mt-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {client.mobile}
                              </span>
                            </div>
                            {client.email && <p className="text-sm text-muted-foreground truncate mt-1">
                                {client.email}
                              </p>}
                            {client.lastRepair && <p className="text-xs text-muted-foreground mt-1">
                                Last repair: {new Date(client.lastRepair).toLocaleDateString()}
                              </p>}
                          </div>
                        </div>
                      </motion.button>)}
                  </div> : <div className="p-8 text-center">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No clients found</p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or add a new client
                    </p>
                  </div>}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border">
                <motion.button whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} onClick={() => setIsAddingNew(true)} className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors">
                  <Plus className="h-4 w-4" />
                  Add New Client
                </motion.button>
              </div>
            </> : (/* Add New Client Form */
        <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="newClientName" className="block text-sm font-medium text-muted-foreground mb-2">
                    Name *
                  </label>
                  <input id="newClientName" type="text" value={newClient.name} onChange={e => setNewClient(prev => ({
                ...prev,
                name: e.target.value
              }))} className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent" placeholder="Enter client name" autoFocus />
                </div>

                <div>
                  <label htmlFor="newClientMobile" className="block text-sm font-medium text-muted-foreground mb-2">
                    Mobile *
                  </label>
                  <input id="newClientMobile" type="tel" value={newClient.mobile} onChange={e => setNewClient(prev => ({
                ...prev,
                mobile: e.target.value
              }))} className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent" placeholder="Enter mobile number" />
                </div>

                <div>
                  <label htmlFor="newClientEmail" className="block text-sm font-medium text-muted-foreground mb-2">
                    Email
                  </label>
                  <input id="newClientEmail" type="email" value={newClient.email} onChange={e => setNewClient(prev => ({
                ...prev,
                email: e.target.value
              }))} className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent" placeholder="Enter email address (optional)" />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} onClick={() => setIsAddingNew(false)} className="flex-1 px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors">
                  Back
                </motion.button>
                <motion.button whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} onClick={handleAddNewClient} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                  Add Client
                </motion.button>
              </div>
            </div>)}
        </motion.div>
      </motion.div>
    </AnimatePresence>;
}