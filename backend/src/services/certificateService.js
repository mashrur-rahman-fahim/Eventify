import puppeteer from "puppeteer";
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

      // Simple, clean HTML template
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Certificate</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 0;
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              width: 297mm;
              height: 210mm;
              font-family: 'Times New Roman', serif;
              background: #f8f9fa;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
            }
            
            .certificate {
              width: 280mm;
              height: 190mm;
              background: white;
              border: 8px solid #2c3e50;
              border-radius: 10px;
              padding: 30px;
              text-align: center;
              box-shadow: 0 5px 15px rgba(0,0,0,0.1);
              position: relative;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            
            .border-pattern {
              position: absolute;
              top: 15px;
              left: 15px;
              right: 15px;
              bottom: 15px;
              border: 2px solid #3498db;
              border-radius: 8px;
            }
            
            .header {
              margin-bottom: 20px;
            }
            
            .university {
              font-size: 24px;
              font-weight: bold;
              color: #2c3e50;
              margin-bottom: 5px;
            }
            
            .motto {
              font-size: 12px;
              color: #7f8c8d;
              font-style: italic;
            }
            
            .title {
              font-size: 42px;
              font-weight: bold;
              color: #2c3e50;
              margin: 20px 0;
              text-transform: uppercase;
            }
            
            .subtitle {
              font-size: 16px;
              color: #7f8c8d;
              margin-bottom: 15px;
            }
            
            .name {
              font-size: 32px;
              font-weight: bold;
              color: #2c3e50;
              margin: 15px 0;
              padding: 12px;
              background: #ecf0f1;
              border-radius: 6px;
            }
            
            .event-info {
              font-size: 18px;
              color: #2c3e50;
              margin: 12px 0;
            }
            
            .details {
              font-size: 14px;
              color: #7f8c8d;
              margin: 8px 0;
            }
            
            .signatures {
              display: flex;
              justify-content: space-around;
              margin-top: 25px;
              padding: 0 80px;
            }
            
            .signature {
              text-align: center;
            }
            
            .signature-line {
              width: 120px;
              height: 2px;
              background: #2c3e50;
              margin: 0 auto 8px;
            }
            
            .signature-label {
              font-size: 10px;
              color: #2c3e50;
              font-weight: bold;
            }
            
            .footer {
              position: absolute;
              bottom: 15px;
              left: 30px;
              right: 30px;
              display: flex;
              justify-content: space-between;
              font-size: 9px;
              color: #95a5a6;
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="border-pattern"></div>
            
            <div class="header">
              <div class="university">Ahsanullah University of Science and Technology</div>
              <div class="motto">Excellence in Education and Innovation</div>
            </div>
            
            <div class="title">Certificate of Participation</div>
            
            <div class="subtitle">This is to certify that</div>
            
            <div class="name">${certificateData.participantName}</div>
            
            <div class="subtitle">has successfully participated in</div>
            
            <div class="event-info">${certificateData.eventTitle}</div>
            
            <div class="details">held on ${eventDate} at ${certificateData.eventLocation}</div>
            
            <div class="details">Organized by ${certificateData.clubName}</div>
            
            <div class="signatures">
              <div class="signature">
                <div class="signature-line"></div>
                <div class="signature-label">Event Organizer</div>
              </div>
              <div class="signature">
                <div class="signature-line"></div>
                <div class="signature-label">Director</div>
              </div>
            </div>
            
            <div class="footer">
              <div>Certificate ID: ${certificateData.registrationId}</div>
              <div>Generated on: ${generatedDate}</div>
            </div>
          </div>
        </body>
        </html>
      `;

      // Launch browser and generate PDF
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      // Generate PDF with strict page control
      const pdfBuffer = await page.pdf({
        format: "A4",
        landscape: true,
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        preferCSSPageSize: true,
        displayHeaderFooter: false,
      });

      await browser.close();

      // Save PDF to file
      fs.writeFileSync(filePath, pdfBuffer);

      return fileName;
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
