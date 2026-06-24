import {
  PButton,
  PDivider,
  PFlag,
  PHeading,
  PLink,
  PLinkPure,
  PText,
  PWordmark,
} from "@porsche-design-system/components-react/ssr";
import type { Locale } from "@/app/i18n/config";
import type { Dictionary } from "@/app/i18n/get-dictionary";
import { appHref, localeHomeHref } from "@/app/i18n/href";
import { FooterLanguageChangeLink } from "./FooterLanguageChangeLink";

type Props = {
  dictionary: Dictionary;
  locale: Locale;
};

const SOCIAL_ICONS = [
  { icon: "logo-facebook", key: "facebook" as const },
  { icon: "logo-instagram", key: "instagram" as const },
  { icon: "logo-pinterest", key: "pinterest" as const },
  { icon: "logo-youtube", key: "youtube" as const },
  { icon: "logo-x", key: "x" as const },
  { icon: "logo-linkedin", key: "linkedin" as const },
] as const;

const footerFlagByLocale: Record<Locale, "us" | "de"> = {
  en: "us",
  de: "de",
};

export function GlobalFooter({ dictionary, locale }: Props) {
  const { footer } = dictionary;
  const homeHref = localeHomeHref(locale);
  const footerFlagName = footerFlagByLocale[locale];

  const companyEntries = [
    {
      href: appHref(`/${locale}/company/glance/`),
      label: footer.companyLinks.glance,
    },
    {
      href: appHref(`/${locale}/company/pcna/`),
      label: footer.companyLinks.na,
    },
    {
      href: appHref(`/${locale}/company/sustainability/`),
      label: footer.companyLinks.sustainability,
    },
    {
      href: appHref(`/${locale}/company/career/`),
      label: footer.companyLinks.career,
    },
    {
      href: appHref(`/${locale}/company/press/`),
      label: footer.companyLinks.press,
    },
  ];

  return (
    <footer
      className="grid-template bg-canvas py-fluid-lg mt-fluid-xl scheme-dark"
      data-testid="global-footer"
    >
      <div className="col-wide flex flex-col gap-fluid-md">
        <section
          aria-labelledby="footer-region-heading"
          className="flex flex-col gap-fluid-sm"
        >
          <PHeading
            id="footer-region-heading"
            size="large"
            tag="h2"
            weight="semibold"
          >
            {footer.regionTitle}
          </PHeading>
          <div className="flex flex-wrap items-center gap-fluid-xs">
            <PFlag className="shrink-0" name={footerFlagName} />
            <PText>{footer.regionMarket}</PText>
            <FooterLanguageChangeLink
              ariaLabelToDe={footer.changeLanguageAriaToDe}
              ariaLabelToEn={footer.changeLanguageAriaToEn}
              locale={locale}
              regionChange={footer.regionChange}
            />
          </div>
        </section>

        <div className="grid grid-cols-1 gap-fluid-xl md:grid-cols-3 md:gap-fluid-lg">
          <section
            aria-labelledby="footer-newsletter-heading"
            className="flex max-w-prose flex-col gap-fluid-sm"
          >
            <PHeading
              id="footer-newsletter-heading"
              size="large"
              tag="h2"
              weight="semibold"
            >
              {footer.newsletterTitle}
            </PHeading>
            <PText>{footer.newsletterCopy}</PText>
            <PButton
              className="w-full max-w-md"
              type="button"
              variant="secondary"
            >
              {footer.subscribe}
            </PButton>
          </section>

          <section
            aria-labelledby="footer-contact-heading"
            className="flex max-w-prose flex-col gap-fluid-sm"
          >
            <PHeading
              id="footer-contact-heading"
              size="large"
              tag="h2"
              weight="semibold"
            >
              {footer.contactTitle}
            </PHeading>
            <PText>{footer.contactCopy}</PText>
            <PButton
              className="w-full max-w-md"
              type="button"
              variant="secondary"
            >
              {footer.contactForm}
            </PButton>
          </section>

          <section
            aria-labelledby="footer-social-heading"
            className="flex max-w-prose flex-col gap-fluid-sm"
          >
            <PHeading
              id="footer-social-heading"
              size="large"
              tag="h2"
              weight="semibold"
            >
              {footer.socialTitle}
            </PHeading>
            <PText>{footer.socialCopy}</PText>
            <ul
              aria-label={footer.socialTitle}
              className="m-0 flex list-none flex-wrap gap-static-xs p-0"
            >
              {SOCIAL_ICONS.map(({ icon, key }) => (
                <li key={key}>
                  <PLink
                    aria={{ "aria-label": footer.socialLabels[key] }}
                    hideLabel
                    href={footer.socialUrls[key]}
                    icon={icon}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {footer.socialLabels[key]}
                  </PLink>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section
          aria-labelledby="footer-company-heading"
          className="flex flex-col gap-fluid-sm"
        >
          <PHeading
            id="footer-company-heading"
            size="large"
            tag="h2"
            weight="semibold"
          >
            {footer.companyTitle}
          </PHeading>
          <nav aria-label={footer.companyTitle}>
            <ul className="grid grid-cols-1 gap-y-static-xs sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-fluid-xl">
              {companyEntries.map(({ href, label }) => (
                <li key={href}>
                  <PLinkPure href={href} icon="none">
                    {label}
                  </PLinkPure>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        <PDivider className="my-fluid-xs" />

        <div className="flex flex-col gap-fluid-md">
          <div className="flex flex-col gap-static-sm">
            <PText size="small">{footer.legalCopyright}</PText>
            <div className="flex flex-wrap gap-x-fluid-sm gap-y-static-xs">
              <PLinkPure
                href={appHref(`/${locale}/legal/notice/`)}
                size="small"
                icon="none"
                underline={true}
              >
                {footer.legalNotice}
              </PLinkPure>
              <PLinkPure
                href={appHref(`/${locale}/legal/icp/`)}
                size="small"
                icon="none"
                underline={true}
              >
                {footer.legalIcp}
              </PLinkPure>
              <PLinkPure
                href={appHref(`/${locale}/legal/environment/`)}
                size="small"
                icon="none"
                underline={true}
              >
                {footer.legalEnv}
              </PLinkPure>
            </div>
            <PLinkPure
              href={appHref(`/${locale}/legal/security/`)}
              icon="none"
              size="small"
              underline={true}
            >
              {footer.legalSecurity}
            </PLinkPure>
            <PText color="contrast-medium">
              {footer.legalDisclaimer}{" "}
              <PLinkPure
                className="align-baseline"
                href={appHref(`/${locale}/legal/more/`)}
                size="small"
                underline={true}
                icon="none"
              >
                {footer.legalMoreInfo}
              </PLinkPure>
            </PText>
          </div>

          <div className="flex flex-col items-center gap-fluid-md pt-fluid-sm">
            <PWordmark href={homeHref} size="small" />
          </div>
        </div>
      </div>
    </footer>
  );
}
