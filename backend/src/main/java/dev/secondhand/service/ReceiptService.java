package dev.secondhand.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.File;
import java.time.format.DateTimeFormatter;

@Service
public class ReceiptService {
    public String generateReceiptPdf(Long orderId, String buyerName, double amount) throws Exception {
        String filename = "receipt_" + orderId + ".pdf";
        File out = new File("uploads/" + filename);
        out.getParentFile().mkdirs();
        Document document = new Document();
        PdfWriter.getInstance(document, new FileOutputStream(out));
        document.open();
        document.add(new Paragraph("Second Hand Book Trading Platform"));
        document.add(new Paragraph("Receipt for Order #" + orderId));
        document.add(new Paragraph("Buyer: " + buyerName));
        document.add(new Paragraph("Amount: ₹" + String.format("%.2f", amount)));
        document.add(new Paragraph("Date: " + java.time.LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME)));
        document.close();
        return "/uploads/" + filename;
    }
}