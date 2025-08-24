import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Certificate from "../model/certificate.model.js";
import Registration from "../model/registration.model.js";
import User from "../model/user.model.js";
import Event from "../model/event.model.js";
import Club from "../model/club.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CertificateService {
  constructor() {
    this.certificatesDir = path.join(__dirname, "../../certificates");
    if (!fs.existsSync(this.certificatesDir)) {
      fs.mkdirSync(this.certificatesDir, { recursive: true });
    }
  }

  async generateCertificate(registrationId) {
    try {
      const registration = await Registration.findById(registrationId)
        .populate("userId", "name email")
        .populate("eventId")
        .populate("clubId");

      if (!registration) {
        throw new Error("Registration not found");
      }

      const certificateData = {
        registrationId: registration._id.toString(),
        participantName: registration.userId.name,
        eventTitle: registration.eventId.title,
        eventDate: registration.eventId.date,
        eventLocation: registration.eventId.location,
        clubName: registration.clubId.name,
      };

      const fileName = await this.createPDF(certificateData);

      // Generate certificate number
      const count = await Certificate.countDocuments();
      const certificateNumber = `CERT-${String(count + 1).padStart(
        6,
        "0"
      )}-${new Date().getFullYear()}`;

      const certificate = new Certificate({
        registrationId: registration._id,
        userId: registration.userId._id,
        eventId: registration.eventId._id,
        clubId: registration.clubId._id,
        certificateNumber: certificateNumber,
        participantName: certificateData.participantName,
        eventTitle: certificateData.eventTitle,
        eventDate: certificateData.eventDate,
        eventLocation: certificateData.eventLocation,
        clubName: certificateData.clubName,
        generatedAt: new Date(),
        pdfPath: fileName,
      });

      await certificate.save();
      return certificate;
    } catch (error) {
      throw new Error(`Certificate generation failed: ${error.message}`);
    }
  }

  async createPDF(certificateData) {
    try {
      const fileName = `certificate_${
        certificateData.registrationId
      }_${Date.now()}.pdf`;
      const filePath = path.join(this.certificatesDir, fileName);

      const eventDate = new Date(certificateData.eventDate).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );

      const generatedDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Create PDF
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margins: { top: 40, bottom: 40, left: 50, right: 50 },
      });

      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // 🎨 Colors
      const primary = "#1B4F72";
      const secondary = "#D4AC0D";
      const accent = "#566573";

      // 🖼️ Background watermark (optional logo in center)
      // doc.image(path.join(__dirname, "logo.png"), doc.page.width/2 - 100, doc.page.height/2 - 100, {width: 200, opacity: 0.1});

      // 🖼️ Border
      doc
        .rect(25, 25, doc.page.width - 50, doc.page.height - 50)
        .lineWidth(6)
        .stroke(secondary);
      doc
        .rect(40, 40, doc.page.width - 80, doc.page.height - 80)
        .lineWidth(2)
        .stroke(primary);

      // 🏛️ Header
      doc
        .fontSize(26)
        .fill(primary)
        .font("Helvetica-Bold")
        .text("Ahsanullah University of Science and Technology", 0, 70, {
          align: "center",
        });
      doc
        .fontSize(12)
        .fill(accent)
        .font("Helvetica-Oblique")
        .text("Excellence in Education and Innovation", { align: "center" });

      // 🏆 Title
      doc.moveDown(2);
      doc
        .fontSize(40)
        .fill(primary)
        .font("Helvetica-Bold")
        .text("Certificate of Participation", { align: "center" });

      // 📜 Subtitle
      doc.moveDown(1.5);
      doc
        .fontSize(16)
        .fill(accent)
        .font("Helvetica")
        .text("This is proudly presented to", { align: "center" });

      // 👤 Participant Name
      doc.moveDown(0.5);
      doc
        .fontSize(34)
        .fill(primary)
        .font("Helvetica-Bold")
        .text(certificateData.participantName, { align: "center" });

      // 📖 Event details
      doc.moveDown(1.2);
      doc
        .fontSize(16)
        .fill(accent)
        .text("for successfully participating in", { align: "center" });
      doc.moveDown(0.5);
      doc
        .fontSize(22)
        .fill(primary)
        .font("Helvetica-Bold")
        .text(certificateData.eventTitle, { align: "center" });

      doc.moveDown(0.3);
      doc
        .fontSize(14)
        .fill(accent)
        .font("Helvetica")
        .text(`Held on ${eventDate} at ${certificateData.eventLocation}`, {
          align: "center",
        });
      doc.text(`Organized by ${certificateData.clubName}`, { align: "center" });

      // ✍️ Signatures
      const sigY = 480; // ⬅️ was 430, now moved down ~50px
      doc.moveTo(150, sigY).lineTo(300, sigY).lineWidth(2).stroke(primary);
      doc
        .fontSize(12)
        .fill(primary)
        .text("Event Organizer", 150, sigY + 10, {
          width: 150,
          align: "center",
        });

      doc
        .moveTo(doc.page.width - 300, sigY)
        .lineTo(doc.page.width - 150, sigY)
        .lineWidth(2)
        .stroke(primary);
      doc.text("Director", doc.page.width - 300, sigY + 10, {
        width: 150,
        align: "center",
      });

      // 📌 Footer
      doc
        .fontSize(10)
        .fill(accent)
        .text(
          `Certificate ID: ${certificateData.registrationId}`,
          50,
          doc.page.height - 60
        );
      doc.text(
        `Generated on: ${generatedDate}`,
        doc.page.width - 200,
        doc.page.height - 60,
        { align: "right" }
      );

      doc.end();

      return new Promise((resolve, reject) => {
        writeStream.on("finish", () => resolve(fileName));
        writeStream.on("error", (error) =>
          reject(new Error(`PDF generation failed: ${error.message}`))
        );
      });
    } catch (error) {
      throw new Error(`PDF generation failed: ${error.message}`);
    }
  }

  async getCertificateById(certificateId) {
    try {
      const certificate = await Certificate.findById(certificateId)
        .populate("userId", "name email")
        .populate("eventId")
        .populate("clubId")
        .populate("registrationId");

      if (!certificate) {
        throw new Error("Certificate not found");
      }

      return certificate;
    } catch (error) {
      throw new Error(`Failed to get certificate: ${error.message}`);
    }
  }

  async getCertificatesByEvent(eventId) {
    try {
      const certificates = await Certificate.find({ eventId })
        .populate("userId", "name email")
        .populate("eventId")
        .populate("clubId")
        .populate("registrationId");

      return certificates;
    } catch (error) {
      throw new Error(`Failed to get certificates: ${error.message}`);
    }
  }

  async getCertificatesByUser(userId) {
    try {
      const certificates = await Certificate.find({ userId })
        .populate("userId", "name email")
        .populate("eventId")
        .populate("clubId")
        .populate("registrationId");

      return certificates;
    } catch (error) {
      throw new Error(`Failed to get certificates: ${error.message}`);
    }
  }

  getCertificateFilePath(fileName) {
    return path.join(this.certificatesDir, fileName);
  }

  async deleteCertificate(certificateId) {
    try {
      const certificate = await Certificate.findById(certificateId);
      if (!certificate) {
        throw new Error("Certificate not found");
      }

      // Delete the PDF file
      const filePath = path.join(this.certificatesDir, certificate.pdfPath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Delete from database
      await Certificate.findByIdAndDelete(certificateId);

      return { message: "Certificate deleted successfully" };
    } catch (error) {
      throw new Error(`Failed to delete certificate: ${error.message}`);
    }
  }
}

export default CertificateService;
