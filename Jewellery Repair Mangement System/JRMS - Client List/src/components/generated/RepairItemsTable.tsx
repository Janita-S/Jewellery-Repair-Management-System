import React, { useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Plus, Trash2, Upload } from 'lucide-react';
interface RepairItem {
  id: string;
  image: File | null;
  description: string;
  price: number;
}
interface RepairItemsTableProps {
  items: RepairItem[];
  onChange: (items: RepairItem[]) => void;
}
export function RepairItemsTable({
  items,
  onChange
}: RepairItemsTableProps) {
  const fileInputRefs = useRef<{
    [key: string]: HTMLInputElement | null;
  }>({});
  const handleAddRow = useCallback(() => {
    const newItem: RepairItem = {
      id: Date.now().toString(),
      image: null,
      description: '',
      price: 0
    };
    onChange([...items, newItem]);
  }, [items, onChange]);
  const handleRemoveRow = useCallback((id: string) => {
    if (items.length > 1) {
      onChange(items.filter(item => item.id !== id));
    }
  }, [items, onChange]);
  const handleItemChange = useCallback((id: string, field: keyof RepairItem, value: any) => {
    onChange(items.map(item => item.id === id ? {
      ...item,
      [field]: value
    } : item));
  }, [items, onChange]);
  const handleImageUpload = useCallback((id: string, file: File | null) => {
    handleItemChange(id, 'image', file);
  }, [handleItemChange]);
  const triggerFileInput = useCallback((id: string) => {
    fileInputRefs.current[id]?.click();
  }, []);
  return <div className="space-y-4">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 rounded-lg border border-border">
        <div className="col-span-3 text-sm font-medium text-muted-foreground">Image</div>
        <div className="col-span-6 text-sm font-medium text-muted-foreground">Description</div>
        <div className="col-span-2 text-sm font-medium text-muted-foreground">Price</div>
        <div className="col-span-1 text-sm font-medium text-muted-foreground">Action</div>
      </div>

      {/* Table Rows */}
      <div className="space-y-3">
        {items.map((item, index) => <motion.div key={item.id} initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -10
      }} transition={{
        duration: 0.2
      }} className="grid grid-cols-12 gap-4 p-4 border border-border rounded-lg bg-card hover:shadow-sm transition-shadow">
            {/* Image Upload */}
            <div className="col-span-3">
              <div className="relative">
                <input ref={el => {
              fileInputRefs.current[item.id] = el;
            }} type="file" accept="image/*" onChange={e => {
              const file = e.target.files?.[0] || null;
              handleImageUpload(item.id, file);
            }} className="hidden" />
                
                <motion.button type="button" whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} onClick={() => triggerFileInput(item.id)} className="w-full h-20 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-1 bg-background">
                  {item.image ? <div className="relative w-full h-full">
                      <img src={URL.createObjectURL(item.image)} alt="Repair item" className="w-full h-full object-cover rounded-lg" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Upload className="h-4 w-4 text-white" />
                      </div>
                    </div> : <>
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Upload</span>
                    </>}
                </motion.button>
              </div>
            </div>

            {/* Description */}
            <div className="col-span-6">
              <textarea value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} placeholder="Describe the repair work needed..." rows={3} className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none" />
            </div>

            {/* Price */}
            <div className="col-span-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <input type="number" min="0" step="0.01" value={item.price || ''} onChange={e => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)} placeholder="0.00" className="w-full pl-8 pr-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent" />
              </div>
            </div>

            {/* Remove Button */}
            <div className="col-span-1 flex items-start justify-center pt-2">
              {items.length > 1 && <motion.button type="button" whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.9
          }} onClick={() => handleRemoveRow(item.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors" title="Remove item">
                  <Trash2 className="h-4 w-4" />
                </motion.button>}
            </div>
          </motion.div>)}
      </div>

      {/* Add Row Button */}
      <div className="flex justify-center pt-4">
        <motion.button type="button" whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.98
      }} onClick={handleAddRow} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent hover:border-accent-foreground/20 transition-colors text-muted-foreground hover:text-accent-foreground">
          <Plus className="h-4 w-4" />
          Add Row
        </motion.button>
      </div>

      {/* Summary */}
      {items.length > 0 && <div className="flex justify-end pt-4 border-t border-border">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              Total Items: {items.length}
            </p>
            <p className="text-lg font-semibold text-foreground">
              Total: ${items.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2)}
            </p>
          </div>
        </div>}
    </div>;
}