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

      // Format date
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

      // Create PDF document
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50,
        },
      });

      // Pipe PDF to file
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Set up fonts and colors
      const primaryColor = "#2c3e50";
      const secondaryColor = "#3498db";
      const accentColor = "#7f8c8d";

      // Draw border
      doc
        .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
        .lineWidth(3)
        .stroke(primaryColor);

      // Inner border
      doc
        .rect(35, 35, doc.page.width - 70, doc.page.height - 70)
        .lineWidth(1)
        .stroke(secondaryColor);

      // Header - University name
      doc
        .fontSize(24)
        .font("Helvetica-Bold")
        .fill(primaryColor)
        .text(
          "Ahsanullah University of Science and Technology",
          doc.page.width / 2,
          80,
          {
            align: "center",
          }
        );

      // Motto
      doc
        .fontSize(12)
        .font("Helvetica-Oblique")
        .fill(accentColor)
        .text(
          "Excellence in Education and Innovation",
          doc.page.width / 2,
          110,
          {
            align: "center",
          }
        );

      // Main title
      doc
        .fontSize(36)
        .font("Helvetica-Bold")
        .fill(primaryColor)
        .text("CERTIFICATE OF PARTICIPATION", doc.page.width / 2, 160, {
          align: "center",
        });

      // Subtitle
      doc
        .fontSize(16)
        .font("Helvetica")
        .fill(accentColor)
        .text("This is to certify that", doc.page.width / 2, 220, {
          align: "center",
        });

      // Participant name
      doc
        .fontSize(28)
        .font("Helvetica-Bold")
        .fill(primaryColor)
        .text(certificateData.participantName, doc.page.width / 2, 250, {
          align: "center",
        });

      // Another subtitle
      doc
        .fontSize(16)
        .font("Helvetica")
        .fill(accentColor)
        .text("has successfully participated in", doc.page.width / 2, 300, {
          align: "center",
        });

      // Event title
      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .fill(primaryColor)
        .text(certificateData.eventTitle, doc.page.width / 2, 330, {
          align: "center",
        });

      // Event details
      doc
        .fontSize(14)
        .font("Helvetica")
        .fill(accentColor)
        .text(
          `held on ${eventDate} at ${certificateData.eventLocation}`,
          doc.page.width / 2,
          360,
          {
            align: "center",
          }
        );

      doc
        .fontSize(14)
        .font("Helvetica")
        .fill(accentColor)
        .text(
          `Organized by ${certificateData.clubName}`,
          doc.page.width / 2,
          380,
          {
            align: "center",
          }
        );

      // Signatures
      const signatureY = 450;
      const leftSignatureX = 150;
      const rightSignatureX = doc.page.width - 150;

      // Left signature
      doc
        .moveTo(leftSignatureX - 60, signatureY)
        .lineTo(leftSignatureX + 60, signatureY)
        .lineWidth(2)
        .stroke(primaryColor);

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .fill(primaryColor)
        .text("Event Organizer", leftSignatureX, signatureY + 10, {
          align: "center",
        });

      // Right signature
      doc
        .moveTo(rightSignatureX - 60, signatureY)
        .lineTo(rightSignatureX + 60, signatureY)
        .lineWidth(2)
        .stroke(primaryColor);

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .fill(primaryColor)
        .text("Director", rightSignatureX, signatureY + 10, {
          align: "center",
        });

      // Footer
      doc
        .fontSize(10)
        .font("Helvetica")
        .fill(accentColor)
        .text(
          `Certificate ID: ${certificateData.registrationId}`,
          70,
          doc.page.height - 80
        );

      doc
        .fontSize(10)
        .font("Helvetica")
        .fill(accentColor)
        .text(
          `Generated on: ${generatedDate}`,
          doc.page.width - 200,
          doc.page.height - 80,
          {
            align: "right",
          }
        );

      // Finalize PDF
      doc.end();

      // Return a promise that resolves when the file is written
      return new Promise((resolve, reject) => {
        writeStream.on("finish", () => {
          resolve(fileName);
        });
        writeStream.on("error", (error) => {
          reject(new Error(`PDF generation failed: ${error.message}`));
        });
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
