import { getProducts } from "@/lib/products";

export default async function Marketplace() {
  const products = await getProducts();

  return (
    <div style={{ padding: 40 }}>
      <h1>Marketplace</h1>

      {products.map((p: any) => (
        <div key={p.id} style={{ marginBottom: 10 }}>
          <h3>{p.title}</h3>
          <p>${p.price}</p>
        </div>
      ))}
    </div>
  );
}