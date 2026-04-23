import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";
import cloudinary from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { title, description, price, location, category, images } = body;

    const uploadedImages = [];

    console.log(process.env.CLOUDINARY_CLOUD_NAME);

    for (let img of images) {
      const res = await cloudinary.uploader.upload(img);
      uploadedImages.push({
        url: res.secure_url,
        public_id: res.public_id,
      });
    }

    const property = await Property.create({
      title,
      description,
      price,
      location,
      category,
      images: uploadedImages,
      listedBy: session?.user?.id,
      // listedBy: new mongoose.Types.ObjectId(),
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request){
  try{
    await connectDB();
    const {searchParams} = new URL(req.url);

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