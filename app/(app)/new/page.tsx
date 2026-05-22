import { AppHeader } from "@/components/AppHeader";
import { TypeWizard } from "@/components/TypeWizard";

export default function NewDiagramPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <TypeWizard />
      </main>
    </>
  );
}
