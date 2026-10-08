import PDFDocument from "pdfkit";
import type { Response } from "express";

export const generatePdfInvoice = (appointment: any, res: Response) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=invoice-${appointment.id}.pdf`);

  doc.pipe(res);

  // Title
  doc.fontSize(20).text("IELTS Preparation Platform", { align: "center" });
  doc.fontSize(12).text("Official Mock Test Invoice", { align: "center" });
  doc.moveDown(2);

  // Invoice Details
  doc.fontSize(10).text(`Invoice ID: INV-${appointment.id.substring(0, 8).toUpperCase()}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);
  doc.moveDown();

  // Student & Instructor Info
  doc.text(`Student Name: ${appointment.student.name}`);
  doc.text(`Student Email: ${appointment.student.email}`);
  doc.text(`Test Date: ${appointment.schedule.date} (${appointment.schedule.startTime} - ${appointment.schedule.endTime})`);
  doc.moveDown(2);

  // Table header
  doc.fontSize(12).text("Description", { continued: true });
  doc.text("Amount", { align: "right" });
  doc.text("------------------------------------------------------------------------------------------------");
  
  doc.fontSize(10).text("1-on-1 IELTS Mock Test Session", { continued: true });
  doc.text("$49.99 USD", { align: "right" });
  doc.moveDown(2);

  doc.fontSize(12).text("Total Paid: $49.99 USD", { align: "right" });
  doc.moveDown(4);
  doc.fontSize(10).text("Thank you for choosing IELTS Preparation Platform!", { align: "center" });

  doc.end();
};