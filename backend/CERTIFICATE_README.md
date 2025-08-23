# Certificate Generation System

This document describes the automatic certificate generation system implemented in the backend.

## Features

- **Automatic Certificate Generation**: Certificates are automatically generated when a participant's status is changed to "attended"
- **PDF Generation**: Uses PDFKit library to create professional-looking certificates
- **University Branding**: Certificates include university name and motto
- **Certificate Verification**: Public endpoint to verify certificate authenticity
- **Bulk Generation**: Admins can generate certificates for all attended participants of an event
- **Download Functionality**: Users can download their certificates as PDF files

## API Endpoints

### Certificate Generation

- `POST /api/certificates/generate/:registrationId` - Generate certificate for a specific registration
- `POST /api/certificates/event/:eventId/generate-all` - Generate certificates for all attended participants (admin only)

### Certificate Retrieval

- `GET /api/certificates/:certificateId` - Get certificate details
- `GET /api/certificates/user/all` - Get all certificates for the logged-in user
- `GET /api/certificates/event/:eventId` - Get all certificates for an event (admin only)

### Certificate Download

- `GET /api/certificates/download/:certificateId` - Download certificate PDF

### Certificate Verification

- `GET /api/certificates/verify/:certificateId` - Verify certificate authenticity (public endpoint)

## Certificate Features

### Design Elements

- **University Branding**: "UNIVERSITY OF TECHNOLOGY" with motto "Excellence in Education and Innovation"
- **Professional Layout**: Landscape A4 format with decorative borders and corner elements
- **Certificate Information**:
  - Participant name
  - Event title and details
  - Event date and location
  - Organizing club name
  - Certificate number
  - Generation date
  - Signature line

### Security Features

- **Unique Certificate Numbers**: Auto-generated with format `CERT-XXXXXX-YYYY`
- **Permission-based Access**: Users can only access their own certificates
- **Admin Controls**: Admins can manage all certificates
- **Verification System**: Public endpoint to verify certificate authenticity

## Database Schema

### Certificate Model

```javascript
{
  registrationId: ObjectId,      // Reference to registration
  userId: ObjectId,              // Reference to user
  eventId: ObjectId,             // Reference to event
  clubId: ObjectId,              // Reference to club
  certificateNumber: String,     // Unique certificate number
  participantName: String,       // Participant's full name
  eventTitle: String,            // Event title
  eventDate: Date,               // Event date
  eventLocation: String,         // Event location
  clubName: String,              // Club name
  generatedAt: Date,             // Generation timestamp
  pdfPath: String,               // Path to PDF file
  isActive: Boolean              // Certificate status
}
```

## File Storage

Certificates are stored in the `backend/certificates/` directory with the naming convention:
`certificate_{registrationId}_{timestamp}.pdf`

## Usage Examples

### Generate Certificate for a Registration

```javascript
// When updating registration status to "attended"
const registration = await Registration.findById(registrationId);
registration.status = "attended";
registration.attendedAt = new Date();
await registration.save();

// Certificate is automatically generated
```

### Download Certificate

```javascript
// Frontend can trigger download
window.open(`/api/certificates/download/${certificateId}`, "_blank");
```

### Verify Certificate

```javascript
// Public verification
const response = await fetch(`/api/certificates/verify/${certificateId}`);
const result = await response.json();
// Returns certificate details if valid
```

## Error Handling

- Certificate generation fails gracefully if PDF creation fails
- Registration status update continues even if certificate generation fails
- Proper error messages for unauthorized access
- File not found handling for missing PDFs

## Dependencies

- `pdfkit`: PDF generation library
- `fs`: File system operations
- `path`: Path manipulation utilities

## Security Considerations

- Authentication required for most endpoints
- Authorization checks for certificate access
- File path validation to prevent directory traversal
- Admin-only access for bulk operations

## Future Enhancements

- Custom certificate templates
- Digital signatures
- QR code integration for verification
- Email delivery of certificates
- Certificate revocation system
