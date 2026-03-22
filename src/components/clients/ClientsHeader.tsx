"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { UserPlus } from "lucide-react";
import { AddClientModal } from "./AddClientModal";

export const ClientsHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-geist-sans">Clients</h1>
          <p className="text-gray-500 mt-1">Manage your customer relationships and billing details.</p>
        </div>
        <Button className="gap-2 shadow-lg shadow-blue-100" onClick={() => setIsModalOpen(true)}>
          <UserPlus className="w-4 h-4" />
          Add New Client
        </Button>
      </div>
      <AddClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
