export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-semibold">{product.name}</h2>
      <p className="text-gray-600">${product.price}</p>
    </div>
  );
}
