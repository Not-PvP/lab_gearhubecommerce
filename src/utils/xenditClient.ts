const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

export interface InvoiceLineItem {
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface CreateInvoiceResult {
  id: string;
  invoiceUrl: string;
}

export async function createInvoice(
  lineItems: InvoiceLineItem[],
  referenceNumber: string,
  paymentMethods: ("CREDIT_CARD" | "GCASH")[],
): Promise<CreateInvoiceResult> {
  const response = await fetch(`${API_BASE_URL}/api/invoices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lineItems, referenceNumber, paymentMethods }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Failed to create invoice");
  }

  return response.json();
}

export interface InvoiceStatus {
  status: "PENDING" | "PAID" | "SETTLED" | "EXPIRED";
}

export async function getInvoiceStatus(id: string): Promise<InvoiceStatus> {
  const response = await fetch(`${API_BASE_URL}/api/invoices/${id}`);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Failed to retrieve invoice");
  }

  return response.json();
}