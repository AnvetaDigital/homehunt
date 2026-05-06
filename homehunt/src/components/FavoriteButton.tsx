import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

export default function FavoriteButton({
    propertyId,
}: {
    propertyId: string;
}){
    const { data: session } = useSession();
    const [isFav, setIsFav] = useState(false);

    const toggleFavorites = async() => {
        if(!session){
            signIn("google");
            return;
        }


        const res = await fetch("/api/favorites", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({propertyId}),
        });

        const data = await res.json();

        setIsFav(data.isFavorite);
    }

    return(
        <button onClick={toggleFavorites}>
            {isFav ? "❤️": "🤍"}
        </button>
    )
}