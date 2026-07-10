import { archiveProductAction } from "@/app/admin/actions";
import {
  BrandCreateForm,
  CategoryCreateForm,
  ProductCreateForm,
  ProductImageUploadForm,
  ProductVariantForm,
} from "@/components/admin/AdminForms";
import { getAdminProductsData } from "@/lib/admin-data";
import { formatPeso } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const data = await getAdminProductsData();

  if (!data) return null;

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-orange-300">Products</p>
        <h1 className="mt-1 text-3xl font-black text-white">Product management</h1>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <ProductCreateForm categories={data.categories} brands={data.brands} />
        <CategoryCreateForm />
        <BrandCreateForm />
      </div>
      <div className="border border-zinc-800 bg-zinc-900 p-4">
        <h2 className="text-lg font-black text-white">Products</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs uppercase text-zinc-500">
              <tr>
                <th className="py-2">Name</th>
                <th>Status</th>
                <th>Price</th>
                <th>Badge</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {data.products.map((product) => (
                <tr key={product.id}>
                  <td className="py-3 font-semibold text-white">{product.name}</td>
                  <td className="text-zinc-300">{product.status}</td>
                  <td className="text-zinc-300">
                    {formatPeso(product.sale_price_cents ?? product.price_cents)}
                  </td>
                  <td className="text-zinc-300">{product.badge ?? "-"}</td>
                  <td className="text-right">
                    <details className="text-left">
                      <summary className="cursor-pointer text-sm font-bold text-orange-300">Manage</summary>
                      <div className="mt-3 grid gap-3">
                        <ProductVariantForm productId={product.id} />
                        <ProductImageUploadForm productId={product.id} />
                        {product.status !== "archived" ? (
                          <form action={archiveProductAction}>
                            <input type="hidden" name="productId" value={product.id} />
                            <button className="text-sm font-bold text-red-300">Archive product</button>
                          </form>
                        ) : null}
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
