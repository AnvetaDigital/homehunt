import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";
import z from "zod";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import cloudinary from "@/lib/cloudinary";
import { getCoordinates } from "@/lib/geocode";

// =====================
// GET
// =====================
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
  await connectDB();
  const { id } = await context.params;   
    const property = await Property.findById(id);

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: property });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch property" },
      { status: 500 }
    );
  }
}

// =====================
// PUT
// =====================
const UpdateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  category: z.enum(["apartment", "villa", "plot", "commercial"]).optional(),
  location: z
    .object({
      city: z.string().min(2),
    })
    .optional(),
  images: z
    .array(
      z.object({
        url: z.string(),
        public_id: z.string(),
      }),
    )
    .optional(),
});

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const { id: propertyId } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return NextResponse.json(
        { error: "Invalid property ID" },
        { status: 400 },
      );
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 },
      );
    }

    //Ownership check
    if (property.listedBy.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    const parsed = UpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    let updateData: any = { ...parsed.data };

     // HANDLE IMAGE DELETION
    if (parsed.data.images) {
      const existingImages = property.images || [];

      const incomingIds = parsed.data.images.map(
        (img: any) => img.public_id
      );

      const imagesToDelete = existingImages.filter(
        (img: any) => !incomingIds.includes(img.public_id)
      );

      for (let img of imagesToDelete) {
        try {
          await cloudinary.uploader.destroy(img.public_id);
          console.log("Deleted:", img.public_id);
        } catch (err) {
          console.error("Delete failed:", img.public_id);
        }
      }
    }

    //Handle city update
    if (parsed.data.location?.city) {
      const coords = await getCoordinates(parsed.data.location.city);

      if (!coords) {
        return NextResponse.json({ error: "Invalid city" }, { status: 400 });
      }

      updateData.location = {
        city: parsed.data.location.city,
        coordinates: coords,
      };
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      updateData,
      { returnDocument: "after", runValidators: true },
    );

    return NextResponse.json(updatedProperty);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 },
    );
  }
}

// =====================
// DELETE
// =====================
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: propertyId } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return NextResponse.json(
        { error: "Invalid property ID" },
        { status: 400 },
      );
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 },
      );
    }

    // Ownership check
    if (property.listedBy.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete images from Cloudinary
    for (let img of property.images) {
      try {
        await cloudinary.uploader.destroy(img.public_id);
      } catch (err) {
        console.error("Failed to delete image:", img.public_id);
      }
    }

    await Property.findByIdAndDelete(propertyId);

    return NextResponse.json({ message: "Property deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete property" },
      { status: 500 },
    );
  }
}
