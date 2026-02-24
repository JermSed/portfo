import { Provider } from "jotai";
import { cn } from "@/lib/utils";
import Polaroid from "@/components/log/polaroid";
import WriteNoteCTA from "@/components/log/cta";
import Link from "next/link";
import { VercelLogo, Sticker, NextWordmark } from "@/components/log/stickers";
import Image from "next/image";
import GuestbookEntries from "@/components/log/guestbook-entries";
export const dynamic = "force-dynamic";

const Page = () => {
  return (
    <Provider>
      <div className={cn("h-dvh sm:h-screen bg-white p-1 sm:p-6")}>
        <div
          id="mat-container"
          className="relative h-full w-full overflow-hidden rounded-[10px] bg-[#5b677a] shadow-[0_4px_8px_rgba(0,0,0,0.2),0_8px_16px_rgba(0,0,0,0.2),0_16px_32px_rgba(0,0,0,0.2)]"
        >
          <div className="pointer-events-none absolute inset-0 rounded-[10px] shadow-[inset_0_0_0_1.5px_#fff6]" />
          <div className="z-10">
            <div
              id="mat-texture"
              className="pointer-events-none absolute inset-0 opacity-75 mix-blend-overlay"
              style={{
                background:
                  "linear-gradient(45deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%), url(/noise.svg)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[10000] rounded-[10px] opacity-30"
              style={{
                backgroundImage: "url(/images/Layer-88.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              aria-hidden
              className="absolute bottom-[3.5vmin] left-[5vmin] h-[11vmin] w-[11vmin] -rotate-[15deg] mix-blend-hard-light [filter:invert(60%)_blur(0.6px)]"
            >
              <Image
                alt="star drawing"
                width={80}
                height={80}
                src="/images/Star_002.png"
              />
            </div>
            <div
              id="mat-grid"
              className="absolute inset-0 m-2 rounded-6 border border-black/20 sm:m-[30px]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)",
                backgroundSize: "2vmin 2vmin",
                backgroundPosition: "center",
              }}
            >
              <div
                id="diagonal-lines"
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, transparent 49.5%, rgba(255,255,255,0.28) 49.5%, rgba(255,255,255,0.28) 50.5%, transparent 50.5%), linear-gradient(-45deg, transparent 49.5%, rgba(255,255,255,0.28) 49.5%, rgba(255,255,255,0.28) 50.5%, transparent 50.5%)",
                  backgroundSize: "10vmin 10vmin",
                  backgroundPosition: "center",
                }}
              />
            </div>
          </div>
          <main className="relative z-20 h-full w-full">
            <div className="absolute top-[5vmin] right-[5vmin] flex h-[11vmin] w-[11vmin] rotate-[15deg] items-center justify-center rounded-full border-2 border-white/50 text-center text-[1.25vmin] font-semibold tracking-[-0.05px] text-white/50 uppercase [word-spacing:1vmin]">
              <span>made with ❤️ in los angeles</span>
            </div>

            <GuestbookEntries />
            <Polaroid src="/images/yos1.jpg" alt="banff" caption="lost stranger" />
            <Polaroid src="/images/yos2.jpg" alt="toronto" caption="inside a waterfall" />
            <Polaroid src="/images/yos3.jpg" alt="nyc" caption="sitting on a cliff" />
            <Polaroid src="/images/catalina1.jpg" alt="nyc" caption="pretty houses" />
            <Polaroid src="/images/catalina2.jpg" alt="nyc" caption="so much flare" />
            <Polaroid src="/images/ctc.jpg" alt="nyc" caption="ctc eboard <3" />
            <Polaroid src="/images/catalina4.jpg" alt="nyc" caption="Andrew aura farming" />
            <Polaroid src="/images/catalina5.jpg" alt="nyc" caption="boys skipping rocks" />

            <Sticker>
              <img
                className="w-36"
                src="/images/supabase.webp"
                alt="Spiderman sticker"
                draggable={false}
                style={{
                  filter:
                    "drop-shadow(0 0 0 white) drop-shadow(1px 0 0 white) drop-shadow(-1px 0 0 white) drop-shadow(0 1px 0 white) drop-shadow(0 -1px 0 white) drop-shadow(0 2px 3px rgba(0,0,0,0.22))",
                }}
              />
            </Sticker>
            <Sticker>
              <img
                className="w-36"
                src="/images/smile.png"
                alt="smile sticker"
                draggable={false}
                style={{
                  filter:
                    "drop-shadow(0 0 0 white) drop-shadow(1px 0 0 white) drop-shadow(-1px 0 0 white) drop-shadow(0 1px 0 white) drop-shadow(0 -1px 0 white) drop-shadow(0 2px 3px rgba(0,0,0,0.22))",
                }}
              />
            </Sticker>
            <Sticker>
              <img
                className="w-36"
                src="/images/frog.png"
                alt="frog sticker"
                draggable={false}
                style={{
                  filter:
                    "drop-shadow(0 0 0 white) drop-shadow(1px 0 0 white) drop-shadow(-1px 0 0 white) drop-shadow(0 1px 0 white) drop-shadow(0 -1px 0 white) drop-shadow(0 2px 3px rgba(0,0,0,0.22))",
                }}
              />
            </Sticker>  
            <Sticker>
              <VercelLogo />
            </Sticker>
            <Sticker>
              <NextWordmark />
            </Sticker>

            <Link
              href="/"
              className={cn(
                "absolute top-4 left-4 z-50 rounded-md border border-white/60 bg-black/20 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-black/30 sm:top-10 sm:left-10"
              )}
            >
              Home
            </Link>
            <WriteNoteCTA />
          </main>
        </div>
      </div>
    </Provider>
  );
};

export default Page;
