"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Contact = {
  fullName: string;
  raw: string;
};

export const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      // const res = await fetch("/api/contacts");
      // const data = await res.json();

      // if (!data.success) {
      //   throw new Error("Failed to fetch contacts");
      // }

      setContacts([]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="p-4 space-y-4">
      {loading && (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && contacts.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No contacts found.</p>
      )}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {contacts.map((contact, idx) => (
          <Card key={idx} className="border dark:border-zinc-700">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-1">{contact.fullName}</h2>
              <p className="text-sm text-zinc-500">
                {extractEmail(contact.raw) || "No email"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Simple vCard email extractor
function extractEmail(vcard: string): string | null {
  const match = vcard.match(/EMAIL[^:]*:([^\n\r]+)/);
  return match?.[1] || null;
}
