import ProfileShell from '@/components/profile/ProfileShell';

export default function SavedAddressesPage() {
  return (
    <ProfileShell title="Saved Addresses">
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-black text-gray-950">Home</h2>
        <p className="mt-2 text-sm font-semibold text-gray-500">Kothrud, Pune, Maharashtra</p>
        <button className="mt-5 rounded-lg border border-emerald-200 px-4 py-2 text-sm font-black text-emerald-700 hover:bg-emerald-50">
          Add New Address
        </button>
      </section>
    </ProfileShell>
  );
}
