import { AnimatedBackground } from "@/components/animated-background";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AnimatedBackground />
      <div className="relative z-10 flex w-full flex-1 flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
