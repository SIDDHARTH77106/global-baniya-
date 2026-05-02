import { redirect } from 'next/navigation';

type CategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  redirect(`/search?category=${encodeURIComponent(id)}`);
}
