import { PageTransition } from "@/components/shared/PageTransition";
import { HelpCircle, BookOpen, MessageCircle, Mail, ExternalLink } from "lucide-react";

const HELP_ITEMS = [
  { icon: BookOpen, title: "Documentation", desc: "Step-by-step guides for every feature", href: "#" },
  { icon: MessageCircle, title: "Community Forum", desc: "Ask questions and share tips with other users", href: "#" },
  { icon: Mail, title: "Email Support", desc: "Get help from our team within 24 hours", href: "#" },
];

const FAQS = [
  { q: "How do I export my resume to PDF?", a: "Open Resume Studio → toolbar → Export PDF button." },
  { q: "Is my data secure?", a: "Yes. All data is encrypted at rest and in transit. We never sell your data." },
  { q: "Can I use the app for free?", a: "Yes, the core features are free. AI features require a Pro plan." },
  { q: "How accurate is the ATS analyzer?", a: "We test against 40+ real ATS platforms with 97% accuracy." },
];

export default function HelpPage() {
  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-accent" /> Help & Support
          </h1>
          <p className="text-muted-foreground text-sm mt-1">We're here to help you succeed</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {HELP_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="p-5 rounded-2xl border border-border/50 bg-card hover:border-accent/30 transition-all cursor-pointer group text-center">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <p className="font-semibold text-sm group-hover:text-accent transition-colors">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            );
          })}
        </div>
        <div>
          <h2 className="font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="p-4 rounded-xl border border-border/50 bg-card">
                <p className="text-sm font-semibold mb-1">{faq.q}</p>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
