import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST() {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "homehunt/properties";

    if (
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET ||
      !process.env.CLOUDINARY_CLOUD_NAME
    ) {
      console.error("Missing env variables");
      return NextResponse.json(
        { error: "Cloudinary config missing" },
        { status: 500 }
      );
    }

    // Configure cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder,
    });
  } catch (err) {
    console.error("Signature error:", err);
    return NextResponse.json(
      { error: "Signature generation failed" },
      { status: 500 }
    );
  }
}