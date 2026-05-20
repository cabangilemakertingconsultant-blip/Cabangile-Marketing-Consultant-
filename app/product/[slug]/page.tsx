import { getProduct } from "@/lib/products";

export default async function ProductPage({ params }: any) {
  const product = await getProduct(params.slug);

  if (!product) return <div>Not found</div>;

  return (
    <div style={{ padding: 40 }}>
      <h1>{product.title}</h1>
      <p>${product.price}</p>

      <form action="/api/stripe/checkout" method="POST">
        <input type="hidden" name="slug" value={product.slug} />
        <button>Buy Now</button>
      </form>
    </div>
  );
}