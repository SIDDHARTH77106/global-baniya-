import Link from 'next/link';
import ProfileShell from '@/components/profile/ProfileShell';

export default function WishlistPage() {
  return (
    <ProfileShell title="Wishlist">
      <section className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
        <h2 className="text-xl font-black text-gray-950">Your wishlist is empty</h2>
        <p className="mt-2 text-sm font-semibold text-gray-500">Save products from the storefront and revisit them here.</p>
        <Link href="/search" className="mt-5 inline-flex rounded-lg bg-emerald-600 px-5 py-3 text-sm font-black text-white hover:bg-emerald-700">
          Browse Products
        </Link>
      </section>
    </ProfileShell>
  );
}
