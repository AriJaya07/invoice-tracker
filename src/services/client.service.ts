import { db } from "@/lib/db";

export async function getClients(userId: string) {
  return db.client.findMany({
    where: { userId },
    include: {
      invoices: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getClientById(id: string, userId: string) {
  return db.client.findFirst({
    where: { id, userId },
  });
}

export async function createClient(userId: string, data: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  companyName?: string;
  taxId?: string;
  country?: string;
}) {
  return db.client.create({
    data: {
      ...data,
      userId,
    },
  });
}

export async function updateClient(id: string, userId: string, data: Partial<{
  name: string;
  email: string;
  phone: string;
  address: string;
  companyName: string;
  taxId: string;
  country: string;
}>) {
  return db.client.update({
    where: { id },
    data,
  });
}

export async function deleteClient(id: string, userId: string) {
  return db.client.delete({
    where: { id },
  });
}
