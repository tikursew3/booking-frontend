// pages/api/cloudinary/list.ts
import { v2 as cloudinary } from 'cloudinary';
import type { NextApiRequest, NextApiResponse } from 'next';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const resources = await cloudinary.api.resources({
      type: 'upload',
      prefix: '', // optional folder prefix if you're using folders
      max_results: 50, // adjust as needed
    });

    res.status(200).json(resources.resources);
  } catch (err: unknown) {
    console.error('Cloudinary fetch error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
}
