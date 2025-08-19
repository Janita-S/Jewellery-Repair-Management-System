import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Ticket, Settings, User, Calendar, Image as ImageIcon, Plus, Search } from 'lucide-react';
import { SidebarNavigation } from './SidebarNavigation';
import { ClientLookupModal } from './ClientLookupModal';
import { RepairItemsTable } from './RepairItemsTable';
import { DatePickerDropdown } from './DatePickerDropdown';
interface RepairItem {
  id: string;
  image: File | null;
  description: string;
  price: number;
}
interface FormData {
  customerName: string;
  mobile: string;
  repairItems: RepairItem[];
  paid: number;
  dueDate: Date | null;
  status: string;
}
export function NewRepairFormScreen() {
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    mobile: '',
    repairItems: [{
      id: '1',
      image: null,
      description: '',
      price: 0
    }],
    paid: 0,
    dueDate: null,
    status: 'Pending'
  });
  const [showClientLookup, setShowClientLookup] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const totalPrice = formData.repairItems.reduce((sum, item) => sum + item.price, 0);
  const balance = totalPrice - formData.paid;
  const handleInputChange = useCallback((field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);
  const handleRepairItemsChange = useCallback((items: RepairItem[]) => {
    setFormData(prev => ({
      ...prev,
      repairItems: items
    }));
  }, []);
  const handleSaveAndPrint = useCallback(() => {
    // Validate form
    if (!formData.customerName || !formData.mobile) {
      alert('Please fill in customer details');
      return;
    }
    if (formData.repairItems.some(item => !item.description || item.price <= 0)) {
      alert('Please complete all repair items');
      return;
    }

    // Save and print logic would go here
    console.log('Saving repair data:', formData);
    alert('Repair saved! Printing tickets...');
  }, [formData]);
  return <div className="flex h-screen bg-background">
      <SidebarNavigation />
      
      <main className="flex-1 p-8 overflow-auto">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3
      }} className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">New Repair Form</h1>
            <p className="text-muted-foreground mt-2">Create a new jewelry repair order</p>
          </header>

          <form className="space-y-8">
            {/* Customer Information */}
            <section className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">Customer Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label htmlFor="customerName" className="block text-sm font-medium text-muted-foreground mb-2">
                    Name
                  </label>
                  <div className="relative">
                    <input id="customerName" type="text" value={formData.customerName} onChange={e => handleInputChange('customerName', e.target.value)} className="w-full px-3 py-2 pr-10 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent" placeholder="Enter customer name" />
                    <button type="button" onClick={() => setShowClientLookup(true)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded">
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-muted-foreground mb-2">
                    Mobile
                  </label>
                  <input id="mobile" type="tel" value={formData.mobile} onChange={e => handleInputChange('mobile', e.target.value)} className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent" placeholder="Enter mobile number" />
                </div>
              </div>
            </section>

            {/* Repair Items */}
            <section className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">Repair Items</h2>
              <RepairItemsTable items={formData.repairItems} onChange={handleRepairItemsChange} />
            </section>

            {/* Financial Details */}
            <section className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">Financial Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="paid" className="block text-sm font-medium text-muted-foreground mb-2">
                    Paid
                  </label>
                  <input id="paid" type="number" min="0" step="0.01" value={formData.paid} onChange={e => handleInputChange('paid', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent" placeholder="0.00" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Total
                  </label>
                  <div className="px-3 py-2 border border-input rounded-md bg-muted text-foreground">
                    ${totalPrice.toFixed(2)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Balance
                  </label>
                  <div className={`px-3 py-2 border border-input rounded-md ${balance > 0 ? 'bg-destructive/10 text-destructive' : 'bg-muted text-foreground'}`}>
                    ${balance.toFixed(2)}
                  </div>
                </div>
              </div>
            </section>

            {/* Status and Due Date */}
            <section className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">Status & Due Date</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label htmlFor="dueDate" className="block text-sm font-medium text-muted-foreground mb-2">
                    Due Date
                  </label>
                  <DatePickerDropdown value={formData.dueDate} onChange={date => handleInputChange('dueDate', date)} />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-muted-foreground mb-2">
                    Status
                  </label>
                  <select id="status" value={formData.status} onChange={e => handleInputChange('status', e.target.value)} className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent">
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Ready for Pickup">Ready for Pickup</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Action Button */}
            <div className="flex justify-end">
              <motion.button type="button" onClick={handleSaveAndPrint} whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} className="px-8 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors">
                Save and Print 2 Tickets
              </motion.button>
            </div>
          </form>
        </motion.div>
      </main>

      {/* Modals */}
      {showClientLookup && <ClientLookupModal onClose={() => setShowClientLookup(false)} onSelect={client => {
      handleInputChange('customerName', client.name);
      handleInputChange('mobile', client.mobile);
      setShowClientLookup(false);
    }} />}
    </div>;
}