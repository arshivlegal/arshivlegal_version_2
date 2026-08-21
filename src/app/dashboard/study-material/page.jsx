import StudyMaterialList from "@/components/lists/StudyMaterialList";
import Button from "@/components/ui/Button";

export const metadata = { title: "Knowledge Hub | CMS" };

export default function StudyMaterialDashboardPage() {
  return (
    <div className="flex flex-col gap-s24">
      <div className="flex justify-between items-center">
        <h1 className="page-title-h2">Knowledge Hub Manager</h1>
        <Button as="link" href="/dashboard/study-material/upload" variant="primary">
          + Add New PDF
        </Button>
      </div>
      <StudyMaterialList />
    </div>
  );
}