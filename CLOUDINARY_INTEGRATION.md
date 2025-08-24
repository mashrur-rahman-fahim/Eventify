# 🖼️ Cloudinary Integration for Eventify

This document outlines the Cloudinary image upload integration implemented in the Eventify project.

## 📋 Overview

Cloudinary has been integrated to handle image uploads for:

- **Event Posters** - Images for events created by club admins
- **Profile Pictures** - User profile images

## 🛠️ Backend Implementation

### Dependencies Added

```bash
npm install cloudinary multer
```

### Configuration Files

#### 1. Cloudinary Config (`backend/src/config/cloudinary.js`)

```javascript
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dsb7ttev4",
  api_key: "447622964742226",
  api_secret: "qPHKa5sa89aPjcKFWiIpVac02wE",
});
```

#### 2. Upload Middleware (`backend/src/middleware/upload.js`)

- Uses multer for file handling
- Supports image files only (JPG, PNG, GIF)
- 5MB file size limit
- Memory storage for processing

#### 3. Cloudinary Service (`backend/src/services/cloudinaryService.js`)

- `uploadImage()` - Upload new images
- `deleteImage()` - Delete images by public_id
- `updateImage()` - Replace existing images

### Database Schema Updates

#### Event Model

```javascript
image: {
  url: {
    type: String, // Cloudinary URL
    default: null,
  },
  public_id: {
    type: String, // Cloudinary public_id for deletion
    default: null,
  }
}
```

#### User Model

```javascript
image: {
  url: {
    type: String, // Cloudinary URL
    default: null,
  },
  public_id: {
    type: String, // Cloudinary public_id for deletion
    default: null,
  }
}
```

### API Endpoints Updated

#### Event Routes

- `POST /api/event/create/:clubId` - Create event with image
- `PUT /api/event/update/:eventId` - Update event with image

#### User Routes

- `PUT /api/updateUserProfile` - Update profile with image

## 🎨 Frontend Implementation

### Components Updated

#### 1. CreateEventPage

- File input for event poster
- Image preview functionality
- FormData submission for multipart/form-data

#### 2. EditEventPage

- File input for updating event poster
- Shows existing image if available
- Preview for new image selection

#### 3. Profile Page

- Profile picture upload
- Circular avatar display
- Image preview functionality

#### 4. Event Display Components

- EventCard - Shows event images
- SingleEvent - Hero image display
- RecommendationCard - Event thumbnails

### Image Display Logic

```javascript
// New structure
src={event.image?.url || fallbackImage}

// Old structure (deprecated)
src={event.image || fallbackImage}
```

## 🔧 Features

### ✅ Implemented Features

1. **Image Upload** - Drag & drop or click to upload
2. **Image Preview** - Real-time preview before upload
3. **Automatic Optimization** - Cloudinary transforms images
4. **Secure URLs** - HTTPS image delivery
5. **Automatic Cleanup** - Old images deleted when replaced
6. **File Validation** - Only image files accepted
7. **Size Limits** - 5MB maximum file size

### 🎯 Cloudinary Transformations

- **Width**: 800px maximum
- **Height**: 600px maximum
- **Quality**: Auto-optimized
- **Format**: Auto-detected

### 📁 Folder Structure

- `eventify/events/` - Event posters
- `eventify/profiles/` - User profile pictures
- `eventify/test/` - Test images (auto-deleted)

## 🚀 Usage Examples

### Creating an Event with Image

```javascript
const formData = new FormData();
formData.append("title", "Tech Summit 2024");
formData.append("image", imageFile);

await api.post("/api/event/create/clubId", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
```

### Updating Profile Picture

```javascript
const formData = new FormData();
formData.append("name", "John Doe");
formData.append("image", profileImageFile);

await api.put("/api/updateUserProfile", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
```

## 🔒 Security Features

### Content Security Policy

```javascript
imgSrc: [
  "'self'",
  "data:",
  "blob:",
  "https://res.cloudinary.com",
  // ... other domains
];
```

### File Validation

- MIME type checking
- File size limits
- Image format validation

## 🐛 Troubleshooting

### Common Issues

1. **Image not uploading**

   - Check file size (max 5MB)
   - Verify file format (JPG, PNG, GIF)
   - Ensure proper FormData usage

2. **Image not displaying**

   - Check CSP headers
   - Verify Cloudinary URL format
   - Check network connectivity

3. **Old images not deleted**
   - Verify public_id is stored correctly
   - Check Cloudinary API credentials
   - Review error logs

### Error Handling

```javascript
try {
  const imageData = await uploadImage(file, "eventify/events");
} catch (error) {
  console.error("Upload failed:", error);
  // Handle error appropriately
}
```

## 📊 Performance Benefits

1. **CDN Delivery** - Global image distribution
2. **Automatic Optimization** - Reduced file sizes
3. **Lazy Loading** - Faster page loads
4. **Responsive Images** - Cloudinary transformations
5. **Caching** - Browser and CDN caching

## 🔄 Migration Notes

### For Existing Data

- Existing events with string image URLs will continue to work
- New uploads will use the new structure
- Gradual migration recommended

### Backward Compatibility

- Components check for both old and new image structures
- Fallback to placeholder images if needed

## 📝 Future Enhancements

1. **Advanced Transformations** - Custom image effects
2. **Multiple Image Support** - Gallery uploads
3. **Image Cropping** - Client-side cropping
4. **Watermarking** - Branded images
5. **Analytics** - Image usage tracking

---

**Note**: This integration ensures secure, optimized, and scalable image handling for the Eventify platform.
