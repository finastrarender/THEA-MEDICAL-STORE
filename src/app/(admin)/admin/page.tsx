import Link from "next/link";
import { auth } from "@/auth";
import { connectMongo } from "@/lib/mongoose";
import ContactLead from "@/models/ContactLead";
import Page from "@/models/Page";
import { redirect } from "next/navigation";
import InquiriesList from "@/components/admin/InquiriesList";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  await connectMongo();
  const pages = await Page.find({}).sort({ slug: 1 }).lean();
  const inquiryDocs = await ContactLead.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();
  const inquiries = inquiryDocs.map((inquiry) => ({
    id: String(inquiry._id),
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone ?? "",
    company: inquiry.company ?? "",
    inquiryType: inquiry.inquiryType ?? "",
    message: inquiry.message,
    createdAt: inquiry.createdAt ? new Date(inquiry.createdAt).toISOString() : "",
  }));
  const hasHome = pages.some((page) => page.slug === "home");

  return (
    <div className="admin-shell admin-dashboard">
      <nav className="admin-nav admin-dashboard__nav">
        <strong className="admin-dashboard__brand">ADAM CONTROL</strong>
        <div className="admin-dashboard__nav-links">
          <Link href="/">View site</Link>
          <Link href="/admin/site-global">Site global</Link>
          <LogoutButton />
        </div>
      </nav>
      <div className="admin-card admin-dashboard__card">
        <header className="admin-dashboard__header">
          <p className="admin-dashboard__eyebrow">PROTOCOL CONTROL</p>
          <h1 className="admin-dashboard__title">
            <span>ADMIN</span>
            <span>SECURELY</span>
          </h1>
          <p className="admin-muted admin-dashboard__subtitle">
            Signed in as <strong>{session.user.email}</strong>. Configure content, then publish.
          </p>
        </header>

        <section className="admin-dashboard__stats" aria-label="Dashboard summary">
          <article className="admin-dashboard__stat">
            <p className="admin-dashboard__stat-label">Total pages</p>
            <p className="admin-dashboard__stat-value">{pages.length}</p>
          </article>
          <article className="admin-dashboard__stat">
            <p className="admin-dashboard__stat-label">Site config</p>
            <p className="admin-dashboard__stat-value">Global control</p>
          </article>
          <article className="admin-dashboard__stat">
            <p className="admin-dashboard__stat-label">Reminder</p>
            <p className="admin-dashboard__stat-value">Sync after edits</p>
          </article>
        </section>

        <section className="admin-dashboard__section">
          <div className="admin-dashboard__section-head">
            <h2>Pages</h2>
            <p className="admin-muted">Choose a page to edit sections and content.</p>
          </div>

          <div className="admin-dashboard__grid">
            {!hasHome ? (
              <Link href="/admin/pages/home" className="admin-dashboard__page-card">
                <span className="admin-dashboard__page-title">Home</span>
                <span className="admin-dashboard__page-meta">/home</span>
                <span className="admin-dashboard__page-link">Edit page</span>
              </Link>
            ) : null}
            {pages.map((page) => (
              <Link
                key={`${page.slug}-card`}
                href={`/admin/pages/${page.slug}`}
                className="admin-dashboard__page-card"
              >
                <span className="admin-dashboard__page-title">{page.title}</span>
                <span className="admin-dashboard__page-meta">/{page.slug}</span>
                <span className="admin-dashboard__page-link">Edit page</span>
              </Link>
            ))}
            {pages.length === 0 ? (
              <p className="admin-muted">No pages found.</p>
            ) : null}
          </div>
        </section>

        <section className="admin-dashboard__section">
          <div className="admin-dashboard__section-head">
            <h2>Thea Inquiries</h2>
            <p className="admin-muted">Latest messages sent from the home page quick inquiry form.</p>
          </div>

          <InquiriesList inquiries={inquiries} />
        </section>

        <section className="admin-dashboard__section">
          <div className="admin-dashboard__section-head">
            <h2>Quick links</h2>
          </div>
          <div className="admin-dashboard__quick-links">
            <Link href="/admin/site-global" className="admin-button-secondary">
              Edit site global settings
            </Link>
            <Link href="/" className="admin-button-secondary">
              Open public website
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
