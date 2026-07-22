import { PageTransition } from "@/components/shared/PageTransition";
import { Settings, User, Bell, Shield, Palette, CreditCard } from "lucide-react";

const SETTINGS_SECTIONS = [
  { icon: User, title: "Profile", desc: "Name, email, avatar, and personal info" },
  { icon: Bell, title: "Notifications", desc: "Email alerts and in-app notifications" },
  { icon: Palette, title: "Appearance", desc: "Theme, font size, and layout preferences" },
  { icon: Shield, title: "Privacy & Security", desc: "Password, 2FA, and data controls" },
  { icon: CreditCard, title: "Billing", desc: "Plan, usage, and payment methods" },
];

export default function SettingsPage() {
  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Settings className="w-6 h-6 text-accent" /> Settings
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your account and preferences</p>
        </div>
        <div className="space-y-3">
          {SETTINGS_SECTIONS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border border-border/50 bg-card hover:border-accent/30 transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-semibold group-hover:text-accent transition-colors">{s.title}</p>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-5 rounded-2xl border border-accent/20 bg-accent/5 text-sm text-muted-foreground">
          Full settings panel coming soon. Your preferences are saved automatically.
        </div>
      </div>
    </PageTransition>
  );
}
