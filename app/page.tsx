import { ArtistIntro } from "@/components/about/artist-intro";
import { siteName } from "@/lib/site-config";

/** Home: Aglaya's portrait and who she is. Header and footer do the rest. */
export default function HomePage() {
  return <ArtistIntro heading={<h1 className="sr-only">{siteName}</h1>} />;
}
