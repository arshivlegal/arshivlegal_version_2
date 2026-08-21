import ArticleList from "@/components/lists/ArticleList";
import Button from "@/components/ui/Button";

export const metadata = { title: "Articles | CMS" };

export default function ArticlePage() {
  return (
    <div className="flex flex-col gap-s24">
      <div className="flex justify-between items-center">
        <h1 className="page-title-h2">Published Articles</h1>
        <Button as="link" href="/dashboard/article/upload" variant="primary">
          + Add New Article
        </Button>
      </div>
      <ArticleList />
    </div>
  );
}