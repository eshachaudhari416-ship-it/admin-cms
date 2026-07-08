import { notFound } from "next/navigation";
import { ENTITY_REGISTRY, ENTITY_SLUGS } from "@/lib/entities";
import { DataTable } from "@/components/admin/DataTable";
import { Topbar } from "@/components/admin/Topbar";

// Statically known routes: /admin/tools, /admin/companies, ... /admin/reports
export function generateStaticParams() {
  return ENTITY_SLUGS.map((entity) => ({ entity }));
}

export default function EntityPage({ params }: { params: { entity: string } }) {
  const config = ENTITY_REGISTRY[params.entity];
  if (!config) notFound();

  return (
    <>
      <Topbar title={config.label} />
      <div className="flex-1 overflow-y-auto p-4 sm:p-5.5">
        <DataTable config={config} />
      </div>
    </>
  );
}