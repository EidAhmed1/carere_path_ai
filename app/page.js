import { getPaths } from "@/lib/db";
import PublicSite from "@/components/PublicSite";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const paths = await getPaths();
  return <PublicSite initialPaths={paths} />;
}
