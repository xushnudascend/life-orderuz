import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/page-hero";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Panel } from "@/components/panel";
import { Download, Smartphone, Chrome, Apple } from "lucide-react";

export const Route = createFileRoute("/install")({
  head: () => ({
    meta: [
      { title: "Life Order'ni telefonga o'rnatish — PWA & APK" },
      {
        name: "description",
        content:
          "Life Order'ni iPhone yoki Android telefoningizga bir bosishda o'rnating. Home Screen, offline rejim va APK yo'riqnomasi.",
      },
      { property: "og:title", content: "Life Order — telefonga o'rnatish" },
      {
        property: "og:description",
        content: "PWA sifatida bir bosishda o'rnating yoki APK yig'ing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InstallPage,
});

function InstallPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <PageHero
          eyebrow="O'rnatish"
          title="Telefoningizda haqiqiy ilova sifatida"
          subtitle="Life Order — Progressive Web App. Brauzersiz, ikonka bilan, offline ishlaydi."
        />

        <div className="mt-8 space-y-4">
          <Panel>
            <div className="flex items-start gap-3">
              <Apple className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
              <div>
                <h2 className="text-base font-semibold">iPhone / iPad (Safari)</h2>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                  <li>Safari'da <code>life-orderuz.lovable.app</code> ni oching</li>
                  <li>Pastdagi <span className="text-foreground">Share</span> tugmasini bosing</li>
                  <li><span className="text-foreground">Add to Home Screen</span> ni tanlang</li>
                </ol>
              </div>
            </div>
          </Panel>

          <Panel>
            <div className="flex items-start gap-3">
              <Chrome className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
              <div>
                <h2 className="text-base font-semibold">Android (Chrome / Edge / Samsung Internet)</h2>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                  <li>Saytni oching — pastda "Install" banner chiqadi</li>
                  <li>Yoki: menyu → <span className="text-foreground">Install app</span></li>
                  <li>Ikonka home ekranga qo'shiladi</li>
                </ol>
              </div>
            </div>
          </Panel>

          <Panel>
            <div className="flex items-start gap-3">
              <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
              <div>
                <h2 className="text-base font-semibold">.APK fayl kerakmi? (Android)</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  APK generatsiyasi Google'ning rasmiy TWA (Trusted Web Activity) vositasi orqali
                  amalga oshiriladi. Bu bir necha daqiqa oladi va qo'shimcha ilova o'rnatishni talab qilmaydi.
                </p>
                <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                  <li>
                    <a
                      href="https://www.pwabuilder.com/reportcard?site=https://life-orderuz.lovable.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 underline underline-offset-2"
                    >
                      PWABuilder.com
                    </a>
                    'ni oching
                  </li>
                  <li>Sayt manzili avval kiritilgan — "Package for stores" ni bosing</li>
                  <li><span className="text-foreground">Android → Generate Package</span></li>
                  <li>.APK va .AAB fayllari yuklab olinadi (signed test APK ham bor)</li>
                </ol>
                <a
                  href="https://www.pwabuilder.com/reportcard?site=https://life-orderuz.lovable.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-300 hover:bg-amber-500/15"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  APK yig'ish (PWABuilder)
                </a>
              </div>
            </div>
          </Panel>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
