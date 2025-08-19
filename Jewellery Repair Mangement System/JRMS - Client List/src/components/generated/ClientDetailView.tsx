"use client";

import React from 'react';
import { X, Phone, Mail, Calendar, Wrench, User, MapPin, Clock, Edit2 } from 'lucide-react';
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
interface ClientDetailViewProps {
  client: Client;
  onClose: () => void;
  onEdit?: (client: Client) => void;
  onNewRepair?: (clientId: string) => void;
}
export function ClientDetailView({
  client,
  onClose,
  onEdit,
  onNewRepair
}: ClientDetailViewProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
      <div className="bg-card rounded-xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{client.name}</h2>
              <p className="text-muted-foreground">Client Details</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
              
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Mobile</p>
                  <p className="font-medium text-foreground">{client.mobile}</p>
                </div>
              </div>

              {client.email && <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{client.email}</p>
                  </div>
                </div>}

              {client.address && <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium text-foreground">{client.address}</p>
                  </div>
                </div>}
            </div>

            {/* Repair History */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Repair History</h3>
              
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Wrench className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Repairs</p>
                  <p className="text-2xl font-bold text-foreground">{client.totalRepairs}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Repair</p>
                  <p className="font-medium text-foreground">
                    {client.lastRepair ? new Date(client.lastRepair).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'No repairs yet'}
                  </p>
                </div>
              </div>

              {client.joinDate && <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Client Since</p>
                    <p className="font-medium text-foreground">
                      {new Date(client.joinDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                    </p>
                  </div>
                </div>}
            </div>
          </div>

          {/* Notes Section */}
          {client.notes && <div className="mt-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">Notes</h3>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-foreground whitespace-pre-wrap">{client.notes}</p>
              </div>
            </div>}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/30">
          <button onClick={() => onEdit?.(client)} className="flex items-center gap-2 px-4 py-2 bg-transparent border border-border text-foreground rounded-md hover:bg-muted/50 transition-colors">
            <Edit2 className="h-4 w-4" />
            Edit Client
          </button>
          <button onClick={() => onNewRepair?.(client.id)} className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            <Wrench className="h-4 w-4" />
            New Repair
          </button>
        </div>
      </div>
    </div>;
}