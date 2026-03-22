"use client";

import { useState } from "react";
import { createClientAction } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { X } from "lucide-react";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddClientModal = ({ isOpen, onClose }: AddClientModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    try {
      await createClientAction(formData);
      onClose();
    } catch (error) {
      console.error("Failed to create client", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Add New Client</h2>
            <p className="text-sm text-gray-500 mt-1">Create a new customer profile for billing.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-gray-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form action={handleSubmit} className="p-8 space-y-6">
          <Input label="Client/Individual Name" name="name" required placeholder="John Doe or Acme Inc." />
          <Input label="Email Address" name="email" type="email" required placeholder="billing@client.com" />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Company Name (Optional)" name="companyName" placeholder="Acme Corporation" />
            <Input label="Phone Number" name="phone" placeholder="+62 812..." />
          </div>

          <Input label="Address" name="address" placeholder="123 Business St, Jakarta" />
          
          <div className="flex justify-end gap-3 mt-8">
            <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Save Client</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
