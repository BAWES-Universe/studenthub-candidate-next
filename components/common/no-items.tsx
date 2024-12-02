export default function NoItems({ image, message }: { image: string, message: string }) {
    return (
        <div className="no-items">
            { image && <img src={image} alt="No items" /> }
            <p>{message}</p>
        </div>
    );
}