import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, StarOff } from "lucide-react";

export interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  subtitle?: string;
  initialRating?: number;
  initialComment?: string;
  submitLabel?: string;
  loading?: boolean;
  onSubmit: (input: { rating: number; comment: string }) => void;
}

const ReviewModal = ({ open, onOpenChange, title, subtitle, initialRating = 5, initialComment = "", submitLabel = "Submit Review", loading = false, onSubmit }: ReviewModalProps) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);

  useEffect(() => {
    if (open) {
      setRating(initialRating);
      setComment(initialComment);
    }
  }, [open, initialRating, initialComment]);

  const handleSubmit = () => {
    if (!comment.trim()) return;
    onSubmit({ rating, comment: comment.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {subtitle && <DialogDescription>{subtitle}</DialogDescription>}
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <p className="text-sm font-medium mb-2">Rating</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" className="focus:outline-none" onClick={() => setRating(star)}>
                  {star <= rating ? <Star className="h-8 w-8 fill-amber-400 text-amber-400" /> : <StarOff className="h-8 w-8 text-gray-300" />}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Comment</p>
            <Textarea rows={4} placeholder="Write a short review..." value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button className="w-full" onClick={handleSubmit} disabled={loading || comment.trim().length < 3}>
            {loading ? "Submitting..." : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
