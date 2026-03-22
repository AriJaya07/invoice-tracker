"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { UserPlus } from "lucide-react";
import { AddClientModal } from "./AddClientModal";

export const ClientsHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Clients
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Manage customer relationships and billing details.
          </p>
        </div>
        <Button
          type="button"
          className="w-full gap-2 shadow-md shadow-blue-600/15 md:w-auto"
          onClick={() => setIsModalOpen(true)}
        >
          <UserPlus className="h-4 w-4" aria-hidden />
          Add client
        </Button>
      </div>
      <AddClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
