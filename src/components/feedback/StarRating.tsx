
import React from "react";
import { Star } from "lucide-react";

export const StarRating = ({
  rating,
  setRating,
  id = "rating-input",
}: {
  rating: number;
  setRating: (n: number) => void;
  id?: string;
}) => (
  <div id={id} className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        type="button"
        key={star}
        onClick={() => setRating(star)}
        className={`p-1 rounded focus-visible:ring-2 ${star <= rating ? "text-yellow-400" : "text-gray-400"}`}
        aria-label={`${star} Star`}
        tabIndex={0}
      >
        <Star fill={star <= rating ? "#FACC15" : "none"} className="w-6 h-6" />
      </button>
    ))}
  </div>
);
