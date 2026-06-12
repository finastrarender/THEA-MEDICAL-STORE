import {
  defaultApplyNowModal,
  defaultFooterColumns,
  defaultFooterMeta,
  defaultHeaderActions,
  defaultNavItems,
} from "@/data/site-defaults";
import { getSiteGlobalCached } from "@/lib/content/site-global";
import ConditionalSiteFooter from "@/components/layout/ConditionalSiteFooter";
import { type FooterColumn } from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import ApplyNowModal from "@/components/apply/ApplyNowModal";
import HashScrollHandler from "@/components/navigation/HashScrollHandler";

export const dynamic = "force-dynamic";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const global = await getSiteGlobalCached();

  const navItems =
    (global?.navItems as typeof defaultNavItems) ?? defaultNavItems;
  const headerBrand =
    (global?.headerBrand as string | undefined) ??
    (global?.footerMeta as { brand?: string } | undefined)?.brand ??
    defaultFooterMeta.brand;
  const footerColumns: FooterColumn[] =
    (global?.footerColumns as FooterColumn[] | undefined) ?? defaultFooterColumns;
  const footerMeta =
    (global?.footerMeta as typeof defaultFooterMeta) ?? defaultFooterMeta;
  const applyNowModal = {
    ...defaultApplyNowModal,
    ...((global?.applyNowModal as Partial<typeof defaultApplyNowModal> | undefined) ?? {}),
  };
  const headerActions = {
    ...defaultHeaderActions,
    ...((global?.headerActions as Partial<typeof defaultHeaderActions> | undefined) ?? {}),
  };
  return (
    <div className="owtc-app cx-site">
      <SiteHeader
        navItems={navItems}
        brandTitle={headerBrand}
        headerActions={headerActions}
      />
      <main className="cx-site__main">{children}</main>
      <HashScrollHandler />
      <ApplyNowModal content={applyNowModal} />
      <ConditionalSiteFooter columns={footerColumns} meta={footerMeta} />
    </div>
  );
}
