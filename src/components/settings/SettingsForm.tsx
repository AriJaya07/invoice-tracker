"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { updateUserAction } from "@/app/dashboard/actions";

interface SettingsFormProps {
  user: {
    name: string | null;
    email: string | null;
    companyName: string | null;
    address: string | null;
    phone: string | null;
    website: string | null;
    taxId: string | null;
    invoicePrefix: string | null;
    defaultCurrency: string | null;
  };
}

export const SettingsForm = ({ user }: SettingsFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      companyName: formData.get("companyName") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      website: formData.get("website") as string,
      taxId: formData.get("taxId") as string,
      invoicePrefix: formData.get("invoicePrefix") as string,
      defaultCurrency: formData.get("defaultCurrency") as string,
    };

    try {
      await updateUserAction(data);
      setMessage({ type: "success", text: "Settings updated successfully." });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update settings. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {message && (
        <div className={`p-4 rounded-xl border ${
          message.type === "success" 
            ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
            : "bg-red-50 border-red-100 text-red-800"
        }`}>
          {message.text}
        </div>
      )}

      {/* Business Profile */}
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-zinc-900">Business profile</h2>
          <p className="text-sm text-zinc-500">Information used on your invoices and documents.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Legal business name" 
            name="companyName" 
            defaultValue={user.companyName || ""} 
            placeholder="e.g. Acme Corporation"
          />
          <Input 
            label="Full name" 
            name="name" 
            defaultValue={user.name || ""} 
            placeholder="Your name"
          />
          <Input 
            label="Business email" 
            value={user.email || ""} 
            disabled 
            helperText="Email cannot be changed."
          />
          <Input 
            label="Phone number" 
            name="phone" 
            defaultValue={user.phone || ""} 
            placeholder="+1 234 567 890"
          />
        </div>
        <Input 
          label="Registered address" 
          name="address" 
          defaultValue={user.address || ""} 
          placeholder="Street address, City, Country"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Website" 
            name="website" 
            defaultValue={user.website || ""} 
            placeholder="https://example.com"
          />
          <Input 
            label="Tax ID / NPWP" 
            name="taxId" 
            defaultValue={user.taxId || ""} 
            placeholder="Tax registration number"
          />
        </div>
      </section>

      {/* Invoice Defaults */}
      <section className="space-y-6 pt-8 border-t border-zinc-100">
        <div>
          <h2 className="text-lg font-bold text-zinc-900">Invoice defaults</h2>
          <p className="text-sm text-zinc-500">Global preferences for your billing workflow.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input 
            label="Invoice prefix" 
            name="invoicePrefix" 
            defaultValue={user.invoicePrefix || "INV"} 
            placeholder="e.g. INV"
          />
          <div className="space-y-1.5 flex flex-col">
            <label className="text-sm font-semibold text-zinc-900">Default currency</label>
            <select 
              name="defaultCurrency"
              defaultValue={user.defaultCurrency || "IDR"}
              className="min-h-11 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              <option value="IDR">IDR (Rp)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>
      </section>

      <div className="flex justify-end pt-6">
        <Button type="submit" isLoading={isLoading} className="px-8">
          Save changes
        </Button>
      </div>
    </form>
  );
};
