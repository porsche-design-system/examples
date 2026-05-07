import {
  PButton,
  PDivider,
  PFlag,
  PHeading,
  PLinkPure,
  PText,
  PWordmark,
} from "@porsche-design-system/components-react/ssr";
import type { Locale } from "@/app/i18n/config";
import type { Dictionary } from "@/app/i18n/get-dictionary";
import { localeHomeHref } from "@/app/i18n/href";

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
    { href: "#company/glance", label: footer.companyLinks.glance },
    { href: "#company/pcna", label: footer.companyLinks.na },
    {
      href: "#company/sustainability",
      label: footer.companyLinks.sustainability,
    },
    { href: "#company/career", label: footer.companyLinks.career },
    { href: "#company/press", label: footer.companyLinks.press },
  ];

  return (
    <footer
      className="grid-template gap-y-0 border-contrast-low border-t bg-canvas px-fluid-sm py-fluid-lg sm:px-fluid-md md:px-fluid-lg"
      data-testid="global-footer"
    >
      <div className="col-wide flex flex-col gap-fluid-xl">
        <section
          aria-labelledby="footer-region-heading"
          className="flex flex-col gap-fluid-sm"
        >
          <PHeading id="footer-region-heading" size="large" tag="h2">
            {footer.regionTitle}
          </PHeading>
          <div className="flex flex-wrap items-center gap-fluid-sm">
            <PFlag className="shrink-0" name={footerFlagName} />
            <span className="text-primary">{footer.regionMarket}</span>
            <PLinkPure
              href="#change-region"
              icon="none"
              size="medium"
              underline={true}
            >
              {footer.regionChange}
            </PLinkPure>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-fluid-xl md:grid-cols-3 md:gap-fluid-lg">
          <section
            aria-labelledby="footer-newsletter-heading"
            className="flex max-w-prose flex-col gap-fluid-sm"
          >
            <PHeading id="footer-newsletter-heading" size="large" tag="h2">
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
            <PLinkPure href="#newsletter" icon="none" size="medium">
              {footer.newsletterLink}
            </PLinkPure>
          </section>

          <section
            aria-labelledby="footer-contact-heading"
            className="flex max-w-prose flex-col gap-fluid-sm"
          >
            <PHeading id="footer-contact-heading" size="large" tag="h2">
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
            <PLinkPure href="#contact" icon="none" size="medium">
              {footer.contactLink}
            </PLinkPure>
          </section>

          <section
            aria-labelledby="footer-social-heading"
            className="flex max-w-prose flex-col gap-fluid-sm"
          >
            <PHeading id="footer-social-heading" size="large" tag="h2">
              {footer.socialTitle}
            </PHeading>
            <PText>{footer.socialCopy}</PText>
            <ul
              aria-label={footer.socialTitle}
              className="m-0 flex list-none flex-wrap gap-static-xs p-0"
            >
              {SOCIAL_ICONS.map(({ icon, key }) => (
                <li key={key}>
                  <PLinkPure
                    aria={{ "aria-label": footer.socialLabels[key] }}
                    className="rounded-full border-2 border-contrast-high p-static-sm"
                    hideLabel
                    href={footer.socialUrls[key]}
                    icon={icon}
                    size="medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {footer.socialLabels[key]}
                  </PLinkPure>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section
          aria-labelledby="footer-company-heading"
          className="flex flex-col gap-fluid-md"
        >
          <PHeading id="footer-company-heading" size="large" tag="h2">
            {footer.companyTitle}
          </PHeading>
          <nav aria-label={footer.companyTitle}>
            <ul className="grid grid-cols-1 gap-y-static-xs sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-fluid-xl">
              {companyEntries.map(({ href, label }) => (
                <li key={href}>
                  <PLinkPure href={href} icon="none" size="medium">
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
              <PLinkPure href="#legal-notice" size="small" icon="none" underline={true}>
                {footer.legalNotice}
              </PLinkPure>
              <PLinkPure href="#legal-icp" size="small" icon="none" underline={true}>
                {footer.legalIcp}
              </PLinkPure>
              <PLinkPure
                href="#legal-environment"
                size="small"
                icon="none"
                underline={true}
              >
                {footer.legalEnv}
              </PLinkPure>
            </div>
            <PLinkPure href="#legal-security" size="small" underline={true}>
              {footer.legalSecurity}
            </PLinkPure>
            <div className="relative text-sm leading-normal text-contrast-medium">
              {footer.legalDisclaimer}{" "}
              <PLinkPure
                className="inline align-baseline"
                href="#legal-more"
                size="small"
                underline={true}
              >
                {footer.legalMoreInfo}
              </PLinkPure>
            </div>
          </div>

          <div className="flex flex-col items-center gap-fluid-md pt-fluid-sm">
            <PWordmark href={homeHref} size="small" />
          </div>
        </div>
      </div>
    </footer>
  );
}
