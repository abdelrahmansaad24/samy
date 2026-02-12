import { getPortfolio } from "@/lib/queries";
import HomePageClient from "@/components/HomePageClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const portfolio = await getPortfolio();

  return <HomePageClient initial={portfolio} />;
}
