"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createInvoiceAction } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Save, Plus, Trash2, Calendar, User, FileText, TrendingUp } from "lucide-react";
import Link from "next/link";

interface NewInvoiceFormProps {
  clients: any[];
}

export const NewInvoiceForm = ({ clients }: NewInvoiceFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "",
  });

  const [items, setItems] = useState([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }, [items]);

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = field === "description" ? value : Number(value);
    setItems(newItems);
  };

  async function handleSubmit() {
    if (!formData.clientId) return alert("Please select a client");
    setIsSubmitting(true);
    try {
      await createInvoiceAction({
        ...formData,
        items,
      });
      router.push("/dashboard/invoices");
    } catch (error) {
      console.error(error);
      alert("Failed to create invoice");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/invoices" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <div className="flex gap-4">
          <Button variant="outline" className="border-gray-200">Save Draft</Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting} className="gap-2 shadow-xl shadow-blue-100 px-8">
            <Save className="w-4 h-4" />
            Create Invoice
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl overflow-hidden">
        <div className="p-10 md:p-16 space-y-16">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-10">
            <div className="space-y-6">
               <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-200">
                  <FileText className="w-10 h-10" />
               </div>
               <div>
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight">Generate Invoice</h1>
                  <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mt-2 px-1">Professional Billing</p>
               </div>
            </div>
            <div className="w-full md:w-auto self-end">
               <div className="bg-gray-50/80 p-6 rounded-3xl border border-gray-100">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Invoice Number</label>
                  <input 
                    type="text" 
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                    className="bg-transparent border-none p-0 text-2xl font-black text-gray-900 focus:ring-0 w-full md:text-right" 
                  />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-8 border-t border-gray-100">
             {/* Client Section */}
             <div className="space-y-8">
               <div className="flex items-center gap-3 text-blue-600">
                  <User className="w-5 h-5" />
                  <label className="text-xs font-black uppercase tracking-[0.2em]">Bill To Client</label>
               </div>
               <div className="space-y-4">
                  <select 
                    value={formData.clientId}
                    onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent rounded-[24px] px-6 py-5 text-gray-900 font-extrabold focus:border-blue-100 focus:bg-white transition-all appearance-none shadow-sm cursor-pointer"
                  >
                     <option value="" disabled>Select a customer...</option>
                     {clients.map(client => (
                       <option key={client.id} value={client.id}>{client.name} ({client.email})</option>
                     ))}
                  </select>
                  <Link href="/dashboard/clients" className="text-xs text-blue-600 font-black hover:underline px-2 inline-block tracking-widest">+ NEW CLIENT</Link>
               </div>
             </div>

             {/* Dates Section */}
             <div className="space-y-8">
                <div className="flex items-center gap-3 text-blue-600">
                   <Calendar className="w-5 h-5" />
                   <label className="text-xs font-black uppercase tracking-[0.2em]">Invoice Timeline</label>
                </div>
                <div className="grid grid-cols-2 gap-6 font-geist-sans">
                   <div className="space-y-3">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 text-center">ISSUE DATE</p>
                     <input 
                       type="date" 
                       value={formData.issueDate}
                       onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                       className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-extrabold text-gray-900 focus:ring-4 focus:ring-blue-50 transition-all text-center" 
                     />
                   </div>
                   <div className="space-y-3">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 text-center">DUE DATE</p>
                     <input 
                       type="date" 
                       value={formData.dueDate}
                       onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                       className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-extrabold text-gray-900 focus:ring-4 focus:ring-blue-50 transition-all text-center" 
                     />
                   </div>
                </div>
             </div>
          </div>

          {/* Items Table */}
          <div className="space-y-8">
             <div className="flex items-center gap-3 text-blue-600">
                <Plus className="w-5 h-5" />
                <label className="text-xs font-black uppercase tracking-[0.2em]">Service Details</label>
             </div>
             
             <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_100px_180px_60px] gap-4 bg-gray-50/30 p-4 rounded-3xl border border-gray-50 items-center animate-in slide-in-from-left duration-300">
                     <input 
                        placeholder="What service was provided?" 
                        value={item.description}
                        onChange={(e) => updateItem(index, "description", e.target.value)}
                        className="bg-white border-gray-100 rounded-xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-300" 
                     />
                     <input 
                        placeholder="Qty" 
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", e.target.value)}
                        className="bg-white border-gray-100 rounded-xl px-5 py-4 text-sm font-black text-center focus:ring-4 focus:ring-blue-50 transition-all" 
                     />
                     <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-300 italic">Rp</span>
                        <input 
                           placeholder="Price" 
                           type="number" 
                           value={item.unitPrice}
                           onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                           className="w-full bg-white border-gray-100 rounded-xl pl-12 pr-5 py-4 text-sm font-black text-right focus:ring-4 focus:ring-blue-50 transition-all" 
                        />
                     </div>
                     <button 
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                        className="text-gray-200 hover:text-red-500 transition-all flex items-center justify-center p-2 rounded-xl hover:bg-red-50 disabled:opacity-0"
                     >
                        <Trash2 className="w-5 h-5" />
                     </button>
                  </div>
                ))}
             </div>
             
             <Button 
                variant="outline" 
                onClick={addItem}
                className="gap-3 border-dashed border-2 px-8 rounded-2xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all py-6 font-bold uppercase tracking-widest text-[10px]"
             >
                <Plus className="w-4 h-4" />
                Add Line Item
             </Button>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-20 pt-12 border-t border-gray-100">
             <div className="flex-1 space-y-6">
               <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Notes & Payment Terms</label>
               <textarea 
                  placeholder="e.g. Please pay within 30 days. Transfer to Bank BCA 1234567890..." 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-[32px] p-8 text-sm font-medium min-h-[180px] focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-300"
               />
             </div>
             
             <div className="w-full md:w-80 p-10 bg-gray-900 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                   <TrendingUp className="w-40 h-40" />
                </div>
                <div className="relative z-10 space-y-6">
                   <div className="flex justify-between items-center pb-6 border-b border-white/10 opacity-70">
                      <span className="text-xs font-bold uppercase tracking-widest">Subtotal</span>
                      <span className="font-bold">Rp{subtotal.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center opacity-70">
                      <span className="text-xs font-bold uppercase tracking-widest">Tax (0%)</span>
                      <span className="font-bold">Rp0</span>
                   </div>
                   <div className="pt-6 border-t border-white/20 flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">GRAND TOTAL</span>
                      <span className="text-3xl font-black">Rp{subtotal.toLocaleString()}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
