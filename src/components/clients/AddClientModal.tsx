"use client";

import { useEffect, useId, useRef, useState } from "react";
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
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

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
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-zinc-200 bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-zinc-100 bg-zinc-50/90 px-6 py-5 backdrop-blur-sm">
          <div>
            <h2
              id={titleId}
              className="text-lg font-bold tracking-tight text-zinc-900"
            >
              Add new client
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Create a customer profile for billing.
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-zinc-500 transition-colors hover:bg-white hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <form action={handleSubmit} className="space-y-5 p-6">
          <Input
            label="Client name"
            name="name"
            required
            placeholder="John Doe or Acme Inc."
            autoComplete="organization"
          />
          <Input
            label="Email address"
            name="email"
            type="email"
            required
            placeholder="billing@client.com"
            autoComplete="email"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Company (optional)"
              name="companyName"
              placeholder="Acme Corporation"
              autoComplete="organization"
            />
            <Input
              label="Phone"
              name="phone"
              type="tel"
              placeholder="+62 812…"
              autoComplete="tel"
            />
          </div>

          <Input
            label="Address"
            name="address"
            placeholder="123 Business St, Jakarta"
            autoComplete="street-address"
          />

          <div className="flex flex-col-reverse gap-3 border-t border-zinc-100 pt-6 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Save client
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
