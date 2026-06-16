"use client";

import { useEffect, useState } from "react";
import { formatAdminDateTime } from "@/lib/format-admin-date";

export type AdminInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  inquiryType: string;
  message: string;
  createdAt: string;
};

export function toAdminInquiry(inquiry: {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  inquiryType?: string;
  message: string;
  createdAt?: string;
}): AdminInquiry {
  return {
    id: inquiry.id,
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone ?? "",
    company: inquiry.company ?? "",
    inquiryType: inquiry.inquiryType ?? "",
    message: inquiry.message,
    createdAt: inquiry.createdAt ?? "",
  };
}

type InquiriesListProps = {
  inquiries: AdminInquiry[];
  onDeleted?: (id: string) => void;
};

export default function InquiriesList({ inquiries: initialInquiries, onDeleted }: InquiriesListProps) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInquiries(initialInquiries);
  }, [initialInquiries]);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this inquiry? This cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    setError(null);

    try {
      const response = await fetch(`/api/v1/admin/inquiries/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
        throw new Error(body?.error?.message ?? "Failed to delete inquiry");
      }

      setInquiries((current) => current.filter((inquiry) => inquiry.id !== id));
      onDeleted?.(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete inquiry");
    } finally {
      setDeletingId(null);
    }
  }

  if (inquiries.length === 0) {
    return <p className="admin-muted">No inquiries found.</p>;
  }

  return (
    <>
      {error ? <p className="admin-muted admin-dashboard__inquiry-error">{error}</p> : null}
      <div className="admin-dashboard__grid">
        {inquiries.map((inquiry) => (
          <article key={inquiry.id} className="admin-dashboard__page-card admin-dashboard__inquiry-card">
            <div className="admin-dashboard__inquiry-head">
              <span className="admin-dashboard__page-title">{inquiry.name}</span>
              <button
                type="button"
                className="admin-dashboard__inquiry-delete"
                onClick={() => handleDelete(inquiry.id)}
                disabled={deletingId === inquiry.id}
                aria-label={`Delete inquiry from ${inquiry.name}`}
              >
                {deletingId === inquiry.id ? "Deleting…" : "Delete"}
              </button>
            </div>
            <span className="admin-dashboard__page-meta">{inquiry.email}</span>
            {inquiry.phone ? (
              <span className="admin-dashboard__page-meta">Phone: {inquiry.phone}</span>
            ) : null}
            {inquiry.company ? (
              <span className="admin-dashboard__page-meta">Facility: {inquiry.company}</span>
            ) : null}
            {inquiry.inquiryType ? (
              <span className="admin-dashboard__page-meta">Service: {inquiry.inquiryType}</span>
            ) : null}
            <span className="admin-dashboard__page-meta">{inquiry.message}</span>
            <span className="admin-dashboard__page-link">
              {inquiry.createdAt
                ? formatAdminDateTime(inquiry.createdAt)
                : "New inquiry"}
            </span>
          </article>
        ))}
      </div>
    </>
  );
}
