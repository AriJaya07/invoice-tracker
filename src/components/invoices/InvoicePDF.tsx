import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
} from "@react-pdf/renderer";
import { InvoiceWithClient } from "@/services/invoice.service";
import { InvoiceLineItem } from "@prisma/client";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingBottom: 20,
  },
  logoSection: {
    flexDirection: "column",
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  invoiceInfo: {
    textAlign: "right",
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  infoText: {
    color: "#6b7280",
    marginBottom: 2,
  },
  bold: {
    fontWeight: "bold",
    color: "#111827",
  },
  addressSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  addressBlock: {
    width: "45%",
  },
  label: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  colDesc: { flex: 2 },
  colQty: { flex: 0.5, textAlign: "center" },
  colPrice: { flex: 1, textAlign: "right" },
  colTotal: { flex: 1, textAlign: "right" },
  
  summarySection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 30,
  },
  summaryBlock: {
    width: "40%",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#111827",
  },
  totalText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
  },
  notesSection: {
    marginTop: 60,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 20,
  }
});

interface InvoicePDFProps {
  invoice: InvoiceWithClient;
  userCompany?: {
    name: string;
    address?: string;
    email: string;
    logo?: string;
  };
}

export const InvoicePDF = ({ invoice, userCompany }: InvoicePDFProps) => {
  return (
    <Document title={`Invoice ${invoice.invoiceNumber}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <View style={styles.logo} />
            <Text style={styles.companyName}>{userCompany?.name || "InvoiceFlow"}</Text>
            <Text style={styles.infoText}>{userCompany?.email}</Text>
            {userCompany?.address && <Text style={styles.infoText}>{userCompany.address}</Text>}
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.infoText}>#{invoice.invoiceNumber}</Text>
            <Text style={styles.infoText}>Date: {new Date(invoice.issueDate).toLocaleDateString()}</Text>
            <Text style={styles.infoText}>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Addresses */}
        <View style={styles.addressSection}>
          <View style={styles.addressBlock}>
            <Text style={styles.label}>Bill To</Text>
            <Text style={[styles.bold, { fontSize: 12, marginBottom: 4 }]}>{invoice.client.name}</Text>
            {invoice.client.companyName && <Text style={styles.infoText}>{invoice.client.companyName}</Text>}
            <Text style={styles.infoText}>{invoice.client.email}</Text>
            {invoice.client.address && <Text style={styles.infoText}>{invoice.client.address}</Text>}
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.label, styles.colDesc]}>Description</Text>
            <Text style={[styles.label, styles.colQty]}>Qty</Text>
            <Text style={[styles.label, styles.colPrice]}>Unit Price</Text>
            <Text style={[styles.label, styles.colTotal]}>Total</Text>
          </View>

          {invoice.lineItems.map((item: InvoiceLineItem, index: number) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>Rp{item.unitPrice.toLocaleString()}</Text>
              <Text style={[styles.colTotal, styles.bold]}>Rp{item.totalPrice.toLocaleString()}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryBlock}>
            <View style={styles.summaryRow}>
              <Text style={styles.infoText}>Subtotal</Text>
              <Text style={styles.bold}>Rp{(invoice.subtotalCents / 100).toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.infoText}>Tax ({invoice.taxRate}%)</Text>
              <Text style={styles.bold}>Rp{(invoice.taxAmountCents / 100).toLocaleString()}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalText}>Rp{(invoice.totalCents / 100).toLocaleString()} {invoice.currency}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.label}>Notes</Text>
            <Text style={styles.infoText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Thank you for your business! If you have any questions, please contact us at {userCompany?.email}.
        </Text>
      </Page>
    </Document>
  );
};
