import { Provider } from "jotai";
import { cn } from "@/lib/utils";
import Polaroid from "@/components/log/polaroid";
import WriteNoteCTA from "@/components/log/cta";
import Link from "next/link";
import { VercelLogo, Sticker, NextWordmark } from "@/components/log/stickers";
import GuestbookEntries from "@/components/log/guestbook-entries";
import StickyTodoNote from "@/components/log/sticky-todo-note";
export const dynamic = "force-dynamic";

const Page = () => {
  return (
    <Provider>
      <div className={cn("h-dvh sm:h-screen bg-white p-1 sm:p-6")}>
        <div
          id="mat-container"
          className="relative h-full w-full overflow-hidden rounded-[10px] bg-[#c5d0d9] shadow-[0_22px_50px_rgba(0,0,0,0.3),0_9px_18px_rgba(0,0,0,0.22)]"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(212,221,229,0.95) 0%, rgba(197,209,219,0.96) 52%, rgba(183,196,207,0.98) 100%), radial-gradient(circle at 84% 10%, rgba(35,45,58,0.16) 0%, rgba(35,45,58,0.08) 30%, rgba(35,45,58,0.03) 48%, rgba(35,45,58,0) 68%), radial-gradient(circle at 14% 82%, rgba(240,248,255,0.3) 0%, rgba(240,248,255,0) 44%)",
            backgroundSize: "100% 100%, 100% 100%, 100% 100%",
            backgroundPosition: "center, center, center",
            backgroundRepeat: "no-repeat, no-repeat, no-repeat",
          }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-[10px] shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.14)]" />
          <div className="z-10">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[10px] opacity-9 mix-blend-soft-light"
              style={{
                backgroundImage: "url(/images/wood-desk.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "grayscale(0.95) saturate(0.45)",
              }}
            />
            <div
              id="mat-texture"
              className="pointer-events-none absolute inset-0 opacity-45 mix-blend-overlay"
              style={{
                background: "url(/noise.svg)",
              }}
            />
            <div
              id="mat-grid"
              className="absolute inset-0 m-2 rounded-6 border border-transparent sm:m-[30px]"
            />
          </div>
          <main className="relative z-20 h-full w-full">
            {/* <div
              aria-hidden
              className="pointer-events-none absolute bottom-[4.2vmin] left-[4.2vmin] z-0 h-[10.5vmin] w-[10.5vmin] -rotate-12 mix-blend-multiply"
              style={{
                backgroundImage: "url(/images/Star_002.png)",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                filter: "grayscale(1) sepia(0.45) brightness(0.5) contrast(1.2)",
                opacity: 0.38,
              }}
            /> */}
            <div
              className="absolute right-[4vmin] bottom-[4vmin] text-right text-[1.2vmin] font-semibold tracking-[0.04em] text-[#2a1a10]/45 uppercase [word-spacing:0.45vmin]"
              style={{
                textShadow:
                  "0 0.07vmin 0 rgba(0,0,0,0.25), 0 -0.03vmin 0 rgba(255,255,255,0.08)",
              }}
            >
              <span>made with love in los angeles {"<3"}</span>
            </div>
            <StickyTodoNote />

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
              <img
                className="w-36"
                src="/images/ctcsticker1.png"
                alt="ctc sticker"
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
                src="/images/ctcsticker2.png"
                alt="frog sticker"
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
                src="/images/ctctree.png"
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
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-60 rounded-[10px] opacity-24 mix-blend-multiply"
            style={{
              backgroundImage: "url(/images/Layer-88.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
      </div>
    </Provider>
  );
};

export default Page;
