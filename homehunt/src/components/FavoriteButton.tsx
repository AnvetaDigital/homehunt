"use client";

import { useFavorites } from "@/context/FavoritesContext";
import { useSession, signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function FavoriteButton({ propertyId }: any) {
  const { favorites, toggleFavorite } = useFavorites();
  const { data: session } = useSession();

  const isFav = favorites.includes(propertyId);

  const handleClick = async () => {
    if (!session) {
      toast.error("Please login first");
      signIn("google");
      return;
    }

    await toggleFavorite(propertyId);

    if(isFav){
      toast("Removed from favorites 💔");
    }else{
      toast.success("Added to favorites ❤️");
    }
  };

  return (
    <button onClick={handleClick} className="text-xl cursor-pointer">
      {isFav ? "❤️" : "🤍"}
    </button>
  );
}