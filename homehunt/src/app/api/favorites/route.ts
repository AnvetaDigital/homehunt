import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try{
        await connectDB();

        const session = await getServerSession(authOptions);

        if(!session?.user?.id){
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            );
        }

        const { propertyId } = await req.json();

        const user = await User.findById(session.user.id);

        const isFav = user.favorites.includes(propertyId);

        if(isFav){
            user.favorites = user.favorites.filter(
                (id: any) => id.toString() !== propertyId
            );
        }else{
            user.favorites.push(propertyId);
        }

        await user.save();

        return NextResponse.json(
            {
                success: true,
                isFavorite: !isFav
            },
        )

    }catch(error){
        return NextResponse.json(
            { error: "Failed to update favorites" },
            { status: 500}
        );
    }
}