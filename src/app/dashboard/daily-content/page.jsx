import DailyContentList from "@/components/lists/DailyContentList";
import Button from "@/components/ui/Button";

export const metadata = { title: "Daily Content | CMS" };

export default function DailyContentPage() {
  return (
    <div className="flex flex-col gap-s24">
      <div className="flex justify-between items-center">
        <h1 className="page-title-h2">Daily Legal Content</h1>
        <Button as="link" href="/dashboard/daily-content/upload" variant="primary">
          + Add New Content
        </Button>
      </div>
      <DailyContentList />
    </div>
  );
}