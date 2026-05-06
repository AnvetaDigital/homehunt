import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        await connectDB();

        const session = await getServerSession(authOptions);

        if(!session?.user?.id){
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            );
        }

        const user = await User.findById(session.user.id).populate("favorites");

        return NextResponse.json({data: user.favorites});

    }catch(error){
        return NextResponse.json(
            {error: "Failed to fetch favorites"},
            {status: 500}
        );
    }
}