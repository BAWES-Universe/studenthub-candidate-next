import { Suspense } from "react";
import Loading from "../loading";

export default function DiscountsPage() {
    return (
        <Suspense fallback={<Loading />}>
        <div>
            Discounts Page
        </div>
        </Suspense>
    );
}