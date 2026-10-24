import { AppHeader } from "@/components/AppHeader";
import { TypeWizard } from "@/components/TypeWizard";

export default function NewDiagramPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-10 md:py-12">
        <TypeWizard />
      </main>
    </>
  );
}
