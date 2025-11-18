import { useParams } from "react-router-dom";
import ReviewList from "./ReviewList";

const ReviewListPage = () => {
  const { sellerId } = useParams();

  return (
    <ReviewList sellerId={Number(sellerId)} />
  );
};

export default ReviewListPage;
