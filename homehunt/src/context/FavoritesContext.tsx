"use client";

import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const FavoritesContext = createContext<any>(null);

export function FavoritesProvider({ children }: any) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/favorites/list")
      .then((res) => res.json())
      .then((data) => {
        const ids = data.data?.map((p: any) => p._id) || [];
        setFavorites(ids);
      });
  }, []);

  const toggleFavorite = async (propertyId: string) => {
    const isFav = favorites.includes(propertyId);

    setFavorites((prev) =>
      isFav ? prev.filter((id) => id !== propertyId) : [...prev, propertyId],
    );

    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ propertyId }),
      });
    } catch (error) {
      console.error("Favorite error: ", error);

      setFavorites((prev) =>
        isFav ? [...prev, propertyId] : prev.filter((id) => id !== propertyId),
      );

      toast.error("Failed to update favorites");
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
