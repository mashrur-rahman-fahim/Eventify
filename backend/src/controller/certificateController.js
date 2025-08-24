import CertificateService from "../services/certificateService.js";

const certificateService = new CertificateService();
import Registration from "../model/registration.model.js";
import Role from "../model/roles.model.js";
import fs from "fs";
import path from "path";

class CertificateController {
  // Generate certificate for a specific registration
  async generateCertificate(req, res) {
    try {
      const { registrationId } = req.params;
      const userId = req.user._id; // From auth middleware

      // Check if user has permission to generate certificate for this registration
      const registration = await Registration.findById(registrationId);
      if (!registration) {
        return res.status(404).json({ error: "Registration not found" });
      }

      // Allow if user is the participant OR if user is an admin
      const role = await Role.findById(req.user.role);
      const isAdmin = role?.permissions?.canManageAttendees;

      if (registration.userId.toString() !== userId.toString() && !isAdmin) {
        return res
          .status(403)
          .json({ error: "Unauthorized to generate certificate" });
      }

      const certificate = await certificateService.generateCertificate(
        registrationId
      );

      res.status(201).json({
        success: true,
        message: "Certificate generated successfully",
        certificate: {
          id: certificate._id,
          certificateNumber: certificate.certificateNumber,
          participantName: certificate.participantName,
          eventTitle: certificate.eventTitle,
          eventDate: certificate.eventDate,
          generatedAt: certificate.generatedAt,
        },
      });
    } catch (error) {
      console.error("Certificate generation error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Download certificate PDF
  async downloadCertificate(req, res) {
    try {
      const { certificateId } = req.params;
      const userId = req.user._id;

      // Debug: Log user info
      console.log("Download request from user:", {
        userId: userId.toString(),
        userEmail: req.user.email,
        userName: req.user.name,
      });

      const certificate = await certificateService.getCertificateById(
        certificateId
      );

      if (!certificate) {
        return res.status(404).json({ error: "Certificate not found" });
      }

      // Debug: Log certificate structure
      console.log("Certificate found:", {
        certificateId: certificate._id,
        userId: certificate.userId,
        userIdType: typeof certificate.userId,
        isPopulated:
          certificate.userId &&
          typeof certificate.userId === "object" &&
          certificate.userId._id,
      });

      // Check if user has permission to download this certificate
      // Handle both populated and non-populated userId field
      const certificateUserId = certificate.userId._id || certificate.userId;
      console.log("Authorization check:", {
        requestUserId: userId.toString(),
        certificateUserId: certificateUserId.toString(),
        certificateId: certificateId,
        authUserType: typeof userId,
        certUserType: typeof certificateUserId,
      });

      // Allow download if user is the certificate owner OR if user is an admin
      const role = await Role.findById(req.user.role);
      const isAdmin = role?.permissions?.canManageAttendees;

      if (certificateUserId.toString() !== userId.toString() && !isAdmin) {
        console.log("Authorization failed for certificate download:", {
          requestUserId: userId.toString(),
          certificateUserId: certificateUserId.toString(),
          certificateId: certificateId,
          isAdmin: isAdmin,
        });
        return res
          .status(403)
          .json({ error: "Unauthorized to download certificate" });
      }

      const filePath = certificateService.getCertificateFilePath(
        certificate.pdfPath
      );

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Certificate file not found" });
      }

      // Set headers for file download
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="certificate_${certificate.certificateNumber}.pdf"`
      );

      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error("Certificate download error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Get certificate details
  async getCertificate(req, res) {
    try {
      const { certificateId } = req.params;
      const userId = req.user._id;

      const certificate = await certificateService.getCertificateById(
        certificateId
      );

      if (!certificate) {
        return res.status(404).json({ error: "Certificate not found" });
      }

      // Check if user has permission to view this certificate
      // Handle both populated and non-populated userId field
      const certificateUserId = certificate.userId._id || certificate.userId;

      // Allow view if user is the certificate owner OR if user is an admin
      const role = await Role.findById(req.user.role);
      const isAdmin = role?.permissions?.canManageAttendees;

      if (certificateUserId.toString() !== userId.toString() && !isAdmin) {
        console.log("Authorization failed for certificate view:", {
          requestUserId: userId.toString(),
          certificateUserId: certificateUserId.toString(),
          certificateId: certificateId,
          isAdmin: isAdmin,
        });
        return res
          .status(403)
          .json({ error: "Unauthorized to view certificate" });
      }

      res.status(200).json({
        success: true,
        certificate: {
          id: certificate._id,
          certificateNumber: certificate.certificateNumber,
          participantName: certificate.participantName,
          eventTitle: certificate.eventTitle,
          eventDate: certificate.eventDate,
          eventLocation: certificate.eventLocation,
          clubName: certificate.clubName,
          generatedAt: certificate.generatedAt,
        },
      });
    } catch (error) {
      console.error("Get certificate error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Get all certificates for a user
  async getUserCertificates(req, res) {
    try {
      const userId = req.user._id;

      const certificates = await certificateService.getCertificatesByUser(
        userId
      );

      res.status(200).json({
        success: true,
        certificates: certificates.map((cert) => ({
          id: cert._id,
          certificateNumber: cert.certificateNumber,
          eventTitle: cert.eventTitle,
          eventDate: cert.eventDate,
          clubName: cert.clubName,
          generatedAt: cert.generatedAt,
        })),
      });
    } catch (error) {
      console.error("Get user certificates error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Get all certificates for an event (admin only)
  async getEventCertificates(req, res) {
    try {
      const { eventId } = req.params;

      // Check if user has admin permissions
      const role = await Role.findById(req.user.role);
      if (!role?.permissions?.canManageAttendees) {
        return res.status(403).json({ error: "Admin access required" });
      }

      const certificates = await certificateService.getCertificatesByEvent(
        eventId
      );

      res.status(200).json({
        success: true,
        certificates: certificates.map((cert) => ({
          id: cert._id,
          certificateNumber: cert.certificateNumber,
          participantName: cert.participantName,
          eventTitle: cert.eventTitle,
          eventDate: cert.eventDate,
          clubName: cert.clubName,
          generatedAt: cert.generatedAt,
        })),
      });
    } catch (error) {
      console.error("Get event certificates error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Generate certificates for all attended participants of an event (admin only)
  async generateEventCertificates(req, res) {
    try {
      const { eventId } = req.params;

      // Check if user has admin permissions
      const role = await Role.findById(req.user.role);
      if (!role?.permissions?.canManageAttendees) {
        return res.status(403).json({ error: "Admin access required" });
      }

      // Get all registrations for the event with 'attended' status
      const registrations = await Registration.find({
        eventId,
        status: "attended",
        certificateGenerated: false,
      });

      if (registrations.length === 0) {
        return res.status(404).json({
          error: "No attended registrations found for certificate generation",
        });
      }

      const generatedCertificates = [];
      const errors = [];

      // Generate certificates for each registration
      for (const registration of registrations) {
        try {
          const certificate = await certificateService.generateCertificate(
            registration._id
          );
          generatedCertificates.push({
            id: certificate._id,
            certificateNumber: certificate.certificateNumber,
            participantName: certificate.participantName,
          });
        } catch (error) {
          errors.push({
            registrationId: registration._id,
            error: error.message,
          });
        }
      }

      res.status(200).json({
        success: true,
        message: `Generated ${generatedCertificates.length} certificates`,
        generatedCertificates,
        errors: errors.length > 0 ? errors : undefined,
      });
    } catch (error) {
      console.error("Generate event certificates error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Verify certificate authenticity
  async verifyCertificate(req, res) {
    try {
      const { certificateId } = req.params;

      const certificate = await certificateService.getCertificateById(
        certificateId
      );

      if (!certificate) {
        return res.status(404).json({
          success: false,
          message: "Certificate not found",
          verified: false,
        });
      }

      res.status(200).json({
        success: true,
        verified: true,
        certificate: {
          certificateNumber: certificate.certificateNumber,
          participantName: certificate.participantName,
          eventTitle: certificate.eventTitle,
          eventDate: certificate.eventDate,
          clubName: certificate.clubName,
          generatedAt: certificate.generatedAt,
        },
      });
    } catch (error) {
      console.error("Verify certificate error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Delete certificate (user can only delete their own certificates)
  async deleteCertificate(req, res) {
    try {
      const { certificateId } = req.params;
      const userId = req.user._id;

      const certificate = await certificateService.getCertificateById(
        certificateId
      );

      if (!certificate) {
        return res.status(404).json({ error: "Certificate not found" });
      }

      // Check if user has permission to delete this certificate
      // Handle both populated and non-populated userId field
      const certificateUserId = certificate.userId._id || certificate.userId;

      // Allow if user is the certificate owner OR if user is an admin
      const role = await Role.findById(req.user.role);
      const isAdmin = role?.permissions?.canManageAttendees;

      if (certificateUserId.toString() !== userId.toString() && !isAdmin) {
        return res
          .status(403)
          .json({ error: "Unauthorized to delete certificate" });
      }

      await certificateService.deleteCertificate(certificateId);

      res.status(200).json({
        success: true,
        message: "Certificate deleted successfully",
      });
    } catch (error) {
      console.error("Delete certificate error:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new CertificateController();
