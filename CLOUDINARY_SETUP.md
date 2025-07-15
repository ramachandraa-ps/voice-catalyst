# Cloudinary Setup Instructions

This application uses Cloudinary for image uploads. Follow these steps to set up your Cloudinary account for this application:

## Cloudinary Account Setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com/) if you don't have one already.

2. Note your Cloudinary credentials:
   - Cloud name: `ddq4tjfg0`
   - API key: `153156457169368`
   - API secret: `XYVZFwgKwchRLVkC7WlcWK3KjEM`

## Create an Upload Preset

1. Log in to your Cloudinary account.

2. Navigate to Settings > Upload > Upload presets.

3. Click "Add upload preset".

4. Configure the preset with the following settings:
   - Preset name: `say2sell_unsigned`
   - Signing Mode: `Unsigned`
   - Folder: `profile_images` (optional)
   - Allowed formats: Select only image formats (jpg, png, etc.)
   - Enable "Auto-tagging" if you want (optional)
   - Set any other restrictions as needed (max file size, etc.)

5. Click "Save" to create the preset.

## Implementation Notes

- The application is already configured to use Cloudinary with your cloud name and upload preset.
- The Cloudinary Upload Widget is loaded from the CDN in the `public/index.html` file.
- The `ProfileImageUpload` component handles the image upload process.
- Uploaded image URLs are stored in Firebase Firestore in the user's document.

## Security Considerations

- We're using an unsigned upload preset, which means anyone with your cloud name and preset name can upload to your Cloudinary account.
- Consider setting restrictions on the upload preset, such as:
  - Max file size
  - Allowed formats
  - Folder path
  - Resource type (images only)
- For production, consider implementing signed uploads for better security. 