import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { getAdminPost, updatePostAction } from "@/lib/actions/admin";

export const metadata = { title: "编辑文章" };

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPageProps) {
  const { id } = await params;
  const result = await getAdminPost(Number(id));

  if (!result.success || !result.data) notFound();

  const post = result.data;

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">编辑文章</h1>
      <PostForm action={updatePostAction} initialData={post} />
    </div>
  );
}
