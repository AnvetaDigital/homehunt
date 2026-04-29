import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import User from "@/models/User";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getCoordinates } from "@/lib/geocode";

// Validation Schema
const PropertySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  category: z.enum(["apartment", "villa", "plot", "commercial"]),
  location: z.object({
    city: z.string().min(2),
  }),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        public_id: z.string(),
      }),
    )
    .min(1),
});

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.error("Unauthorized request");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();

    const parsed = PropertySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

     const { title, description, price, category, location, images } =
      parsed.data;

      const coords = await getCoordinates(location.city);

     if (!coords) {
      return NextResponse.json(
        { error: "Could not find location" },
        { status: 400 }
      );
    }

     const property = await Property.create({
      title,
      description,
      price,
      category,
      location: {
        city: location.city,
        coordinates: coords,
      },
      images,
      listedBy: new mongoose.Types.ObjectId(session.user.id),
    });

    return NextResponse.json(
      {
        success: true,
        data: property,
      },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    //Filtering parameters
    const city =searchParams.get("city");
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

      // Pagination
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    //Query object
    let query: any = {};

    if(city) query["location.city"] = city;

    if(category) query.category = category;

    if(minPrice || maxPrice){
      query.price = {};
      if(minPrice) query.price.$gte = Number(minPrice);
      if(maxPrice) query.price.$lte = Number(maxPrice);
    }

    //Fetch data from DB
    const properties = await Property.find(query)
    .sort({ createdAt: -1})       //latest properties first
    .skip(skip)
    .limit(limit)
    .populate("listedBy", "name email");

    const total = await Property.countDocuments(query);

    return NextResponse.json({
      data: properties,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  }catch(error){
    console.error("ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 },
    );
  }
}