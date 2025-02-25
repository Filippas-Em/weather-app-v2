import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function SkeletonCard() {
    return (
        <div className="card">
            <Skeleton height={200} />
            <Skeleton count={3} />
        </div>
    );
}

export default SkeletonCard;
