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
    // Create certificates directory if it doesn't exist
    this.certificatesDir = path.join(__dirname, "../../certificates");
    if (!fs.existsSync(this.certificatesDir)) {
      fs.mkdirSync(this.certificatesDir, { recursive: true });
    }
  }

  async generateCertificate(registrationId) {
    try {
      // Get registration details with populated data
      const registration = await Registration.findById(registrationId)
        .populate("userId", "firstName lastName email")
        .populate("eventId", "title date location")
        .populate("clubId", "name");

      if (!registration) {
        throw new Error("Registration not found");
      }

      if (registration.status !== "attended") {
        throw new Error(
          "Certificate can only be generated for attended events"
        );
      }

      // Check if certificate already exists
      const existingCertificate = await Certificate.findOne({ registrationId });
      if (existingCertificate) {
        return existingCertificate;
      }

      const user = registration.userId;
      const event = registration.eventId;
      const club = registration.clubId;

      // Generate certificate data
      const certificateData = {
        registrationId: registration._id,
        userId: user._id,
        eventId: event._id,
        clubId: club._id,
        participantName: `${user.firstName} ${user.lastName}`,
        eventTitle: event.title,
        eventDate: event.date,
        eventLocation: event.location,
        clubName: club.name,
      };

      // Generate PDF
      const pdfPath = await this.createPDF(certificateData);

      // Save certificate to database
      const certificate = new Certificate({
        ...certificateData,
        pdfPath,
      });

      await certificate.save();

      // Update registration with certificate info
      registration.certificateGenerated = true;
      registration.certificateId = certificate._id;
      await registration.save();

      return certificate;
    } catch (error) {
      throw new Error(`Certificate generation failed: ${error.message}`);
    }
  }

  async createPDF(certificateData) {
    return new Promise((resolve, reject) => {
      try {
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

        const fileName = `certificate_${
          certificateData.registrationId
        }_${Date.now()}.pdf`;
        const filePath = path.join(this.certificatesDir, fileName);
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        // Add background color
        doc.rect(0, 0, doc.page.width, doc.page.height).fill("#f8f9fa");

        // Add border
        doc
          .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
          .lineWidth(3)
          .stroke("#2c3e50");

        // Add inner border
        doc
          .rect(40, 40, doc.page.width - 80, doc.page.height - 80)
          .lineWidth(1)
          .stroke("#34495e");

        // Add decorative corner elements
        this.addCornerElements(doc);

        // Add university branding
        this.addUniversityBranding(doc);

        // Add main title
        doc
          .fontSize(48)
          .font("Helvetica-Bold")
          .fill("#2c3e50")
          .text("Certificate of Participation", doc.page.width / 2, 120, {
            align: "center",
          });

        // Add subtitle
        doc
          .fontSize(18)
          .font("Helvetica")
          .fill("#7f8c8d")
          .text("This is to certify that", doc.page.width / 2, 180, {
            align: "center",
          });

        // Add participant name
        doc
          .fontSize(36)
          .font("Helvetica-Bold")
          .fill("#2c3e50")
          .text(certificateData.participantName, doc.page.width / 2, 220, {
            align: "center",
          });

        // Add participation text
        doc
          .fontSize(16)
          .font("Helvetica")
          .fill("#7f8c8d")
          .text("has successfully participated in", doc.page.width / 2, 270, {
            align: "center",
          });

        // Add event title
        doc
          .fontSize(24)
          .font("Helvetica-Bold")
          .fill("#2c3e50")
          .text(certificateData.eventTitle, doc.page.width / 2, 310, {
            align: "center",
          });

        // Add event details
        const eventDate = new Date(
          certificateData.eventDate
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        doc
          .fontSize(14)
          .font("Helvetica")
          .fill("#7f8c8d")
          .text(
            `held on ${eventDate} at ${certificateData.eventLocation}`,
            doc.page.width / 2,
            350,
            {
              align: "center",
            }
          );

        // Add club name
        doc
          .fontSize(16)
          .font("Helvetica-Bold")
          .fill("#2c3e50")
          .text(
            `Organized by ${certificateData.clubName}`,
            doc.page.width / 2,
            390,
            {
              align: "center",
            }
          );

        // Add certificate number
        doc
          .fontSize(10)
          .font("Helvetica")
          .fill("#95a5a6")
          .text(
            `Certificate ID: ${certificateData.registrationId}`,
            doc.page.width / 2,
            450,
            {
              align: "center",
            }
          );

        // Add date of generation
        const generatedDate = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        doc
          .fontSize(10)
          .font("Helvetica")
          .fill("#95a5a6")
          .text(`Generated on: ${generatedDate}`, doc.page.width / 2, 470, {
            align: "center",
          });

        // Add signature line
        doc
          .moveTo(doc.page.width / 2 - 100, 520)
          .lineTo(doc.page.width / 2 + 100, 520)
          .stroke();

        doc
          .fontSize(12)
          .font("Helvetica-Bold")
          .fill("#2c3e50")
          .text("Event Organizer", doc.page.width / 2, 530, {
            align: "center",
          });

        doc.end();

        stream.on("finish", () => {
          resolve(fileName);
        });

        stream.on("error", (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  addCornerElements(doc) {
    const cornerSize = 30;
    const lineWidth = 2;

    // Top-left corner
    doc
      .lineWidth(lineWidth)
      .moveTo(40, 40)
      .lineTo(40 + cornerSize, 40)
      .moveTo(40, 40)
      .lineTo(40, 40 + cornerSize)
      .stroke();

    // Top-right corner
    doc
      .lineWidth(lineWidth)
      .moveTo(doc.page.width - 40, 40)
      .lineTo(doc.page.width - 40 - cornerSize, 40)
      .moveTo(doc.page.width - 40, 40)
      .lineTo(doc.page.width - 40, 40 + cornerSize)
      .stroke();

    // Bottom-left corner
    doc
      .lineWidth(lineWidth)
      .moveTo(40, doc.page.height - 40)
      .lineTo(40 + cornerSize, doc.page.height - 40)
      .moveTo(40, doc.page.height - 40)
      .lineTo(40, doc.page.height - 40 - cornerSize)
      .stroke();

    // Bottom-right corner
    doc
      .lineWidth(lineWidth)
      .moveTo(doc.page.width - 40, doc.page.height - 40)
      .lineTo(doc.page.width - 40 - cornerSize, doc.page.height - 40)
      .moveTo(doc.page.width - 40, doc.page.height - 40)
      .lineTo(doc.page.width - 40, doc.page.height - 40 - cornerSize)
      .stroke();
  }

  addUniversityBranding(doc) {
    // Add university name at the top
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .fill("#2c3e50")
      .text("UNIVERSITY OF TECHNOLOGY", doc.page.width / 2, 60, {
        align: "center",
      });

    // Add university motto
    doc
      .fontSize(12)
      .font("Helvetica")
      .fill("#7f8c8d")
      .text("Excellence in Education and Innovation", doc.page.width / 2, 85, {
        align: "center",
      });
  }

  async getCertificateById(certificateId) {
    try {
      const certificate = await Certificate.findById(certificateId)
        .populate("userId", "firstName lastName email")
        .populate("eventId", "title date location")
        .populate("clubId", "name");

      if (!certificate) {
        throw new Error("Certificate not found");
      }

      return certificate;
    } catch (error) {
      throw new Error(`Failed to get certificate: ${error.message}`);
    }
  }

  async getCertificatesByUser(userId) {
    try {
      const certificates = await Certificate.find({ userId })
        .populate("eventId", "title date location")
        .populate("clubId", "name")
        .sort({ generatedAt: -1 });

      return certificates;
    } catch (error) {
      throw new Error(`Failed to get user certificates: ${error.message}`);
    }
  }

  async getCertificatesByEvent(eventId) {
    try {
      const certificates = await Certificate.find({ eventId })
        .populate("userId", "firstName lastName email")
        .populate("clubId", "name")
        .sort({ generatedAt: -1 });

      return certificates;
    } catch (error) {
      throw new Error(`Failed to get event certificates: ${error.message}`);
    }
  }

  getCertificateFilePath(fileName) {
    return path.join(this.certificatesDir, fileName);
  }
}

export default new CertificateService();
