import { db } from "@/lib/kysely";
import { timeAgo } from "@/lib/utils";
import RefreshButton from "./refresh-button";
import { seed } from "@/lib/seed";

export default async function Products() {
  let products;
  let startTime = Date.now();

  try {
    products = await db.selectFrom("products").selectAll().execute();
  } catch (e: any) {
    if (e.message === `relation "users" does not exist`) {
      console.log(
        "Table does not exist, creating and seeding it with dummy data now..."
      );
      // Table is not created yet
      await seed();
      startTime = Date.now();
      products = await db.selectFrom("products").selectAll().execute();
    } else {
      throw e;
    }
  }

  const duration = Date.now() - startTime;

  return (
    <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Recent Products</h2>
          <p className="text-sm text-gray-500">
            Fetched {products.length} products in {duration}ms
          </p>
        </div>
        <RefreshButton />
      </div>
      <div className="divide-y divide-gray-900/5">
        {products.map((product) => (
          <div
            key={product.product_name}
            className="flex items-center justify-between py-3"
          >
            <div className="flex items-center space-x-4">
              <div className="space-y-1">
                <p className="font-medium leading-none">
                  {product.product_name}
                </p>
                <p className="text-sm text-gray-500">{product.description}</p>
                <p className="text-sm text-gray-500">Price: {product.price}</p>
                <p className="text-sm text-gray-500">
                  Stock Quantity: {product.stock_quantity}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {timeAgo(product.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
