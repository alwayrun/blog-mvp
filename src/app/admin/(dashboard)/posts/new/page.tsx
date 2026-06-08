import PostForm from "@/components/admin/PostForm";
import { createPostAction } from "@/lib/actions/admin";

export const metadata = { title: "新建文章" };

export default function NewPostPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">新建文章</h1>
      <PostForm action={createPostAction} />
    </div>
  );
}
