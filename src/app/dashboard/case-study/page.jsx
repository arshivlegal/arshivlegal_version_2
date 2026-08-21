import CaseStudyList from "@/components/lists/CaseStudyList";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "Case Studies | CMS",
};

export default function CaseStudyPage() {
  return (
    <div className="flex flex-col gap-s24">
      <div className="flex justify-between items-center">
        <h1 className="page-title-h2">All Case Studies</h1>
        <Button as="link" href="/dashboard/case-study/uploads" variant="primary">
          + Add New Case Study
        </Button>
      </div>
      <CaseStudyList />
    </div>
  );
}