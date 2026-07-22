import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Sparkles, MessageCircle, Share2, Globe } from "lucide-react";

const FOOTER_LINKS = {
  Product: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Resume Builder", href: "/builder" },
    { label: "Resume Studio", href: "/studio" },
    { label: "Templates", href: "/templates" },
    { label: "Resume Academy", href: "/academy" },
  ],
  Tools: [
    { label: "ATS Analyzer", href: "/analyzer" },
    { label: "AI Coach", href: "/coach" },
    { label: "Job Tracker", href: "/tracker" },
    { label: "Resume Review", href: "#" },
    { label: "Interview Prep", href: "#" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30 py-12 md:py-16">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
              <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shadow-sm shadow-accent/20 group-hover:shadow-accent/40 transition-shadow">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base tracking-tight">
                Resume<span className="text-accent">OS</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-[200px] leading-relaxed">
              The professional platform for building modern, ATS-optimised resumes.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-5">
              {[
                { icon: MessageCircle, href: "https://twitter.com", label: "Twitter" },
                { icon: Share2, href: "https://github.com", label: "GitHub" },
                { icon: Globe, href: "https://linkedin.com", label: "LinkedIn" },
              ].map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold text-sm mb-4 text-foreground">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      {link.href === "#" && (
                        <span className="text-[9px] font-semibold uppercase tracking-wider bg-muted px-1 py-0.5 rounded text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity">
                          soon
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} ResumeOS. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with
            <span className="text-red-500 mx-0.5">♥</span>
            for job seekers worldwide
          </p>
        </div>
      </Container>
    </footer>
  );
}
