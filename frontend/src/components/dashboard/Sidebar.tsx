"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Logo } from "@/components/shared/Logo";
import {
  LayoutDashboard, FileText, PenTool, GraduationCap,
  Layers, Target, Briefcase,
  Settings, HelpCircle, PanelLeftClose, Sparkles,
  ClipboardCheck, Mic, Mail, Link2, GitBranch, Map,
  X, Zap, CheckCircle2, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// ─── Navigation data ──────────────────────────────────────────────────────────

const MAIN_NAV = [
  { name: "Dashboard",       href: "/dashboard", icon: LayoutDashboard },
  { name: "Resume Builder",  href: "/builder",   icon: FileText },
  { name: "Resume Studio",   href: "/studio",    icon: PenTool },
  { name: "Resume Academy",  href: "/academy",   icon: GraduationCap },
  { name: "Templates",       href: "/templates", icon: Layers },
  { name: "ATS Analyzer",    href: "/analyzer",  icon: Target },
  { name: "Job Tracker",     href: "/tracker",   icon: Briefcase },
];

const BOTTOM_NAV = [
  { name: "Settings",      href: "/settings", icon: Settings },
  { name: "Help & Support", href: "/help",    icon: HelpCircle },
];

// ─── Roadmap data (no hrefs — these open a modal) ────────────────────────────

interface RoadmapItem {
  name: string;
  icon: React.ElementType;
  description: string;
  capabilities: string[];
  gradient: string;
  accentColor: string;
  version: string;
}

const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    name: "AI Resume Review",
    icon: ClipboardCheck,
    description: "A full 360° AI-powered review that scores your resume across ATS compatibility, grammar, impact, keyword density, and overall recruiter perception.",
    capabilities: [
      "AI scoring across 6 dimensions",
      "ATS simulation against 40+ platforms",
      "Recruiter eye-tracking heatmap",
      "Industry benchmark comparison",
      "One-click improvement suggestions",
    ],
    gradient: "from-blue-500/15 via-accent/5 to-transparent",
    accentColor: "#3b82f6",
    version: "Version 2",
  },
  {
    name: "Interview Preparation",
    icon: Mic,
    description: "Practice real interviews with an AI coach that adapts to your target company and role, providing instant feedback on your answers, tone, and structure.",
    capabilities: [
      "Company-specific question banks (120+ companies)",
      "Technical, behavioral, HR, and coding modes",
      "Real-time AI feedback on answers",
      "Voice analysis — filler words & pacing",
      "STAR method coach",
    ],
    gradient: "from-purple-500/15 via-accent/5 to-transparent",
    accentColor: "#a855f7",
    version: "Version 2",
  },
  {
    name: "Cover Letter Generator",
    icon: Mail,
    description: "Generate perfectly tailored cover letters in under 30 seconds. Paste any job description and get a personalized letter that mirrors the company's voice.",
    capabilities: [
      "Job description parsing & keyword injection",
      "4 tone presets — Professional, Confident, Friendly, Creative",
      "Multi-language support",
      "Export to PDF, DOCX, and plain text",
      "ATS-optimized structure",
    ],
    gradient: "from-green-500/15 via-accent/5 to-transparent",
    accentColor: "#22c55e",
    version: "Version 2",
  },
  {
    name: "LinkedIn Optimizer",
    icon: Link2,
    description: "Analyze and rewrite every section of your LinkedIn profile to maximize recruiter visibility, search appearances, and connection request rates.",
    capabilities: [
      "Section-by-section profile scoring",
      "AI headline & summary rewrites",
      "Recruiter search keyword optimizer",
      "Missing skill gap detection",
      "Network growth insights",
    ],
    gradient: "from-sky-500/15 via-accent/5 to-transparent",
    accentColor: "#0ea5e9",
    version: "Version 2",
  },
  {
    name: "GitHub Optimizer",
    icon: GitBranch,
    description: "Transform your GitHub into a portfolio that impresses recruiters. Rank your repos, generate professional READMEs, and tell a compelling engineering story.",
    capabilities: [
      "Repository scoring & priority ranking",
      "AI-generated README with architecture diagrams",
      "Contribution graph analysis",
      "Project narrative builder",
      "Portfolio suggestions based on target role",
    ],
    gradient: "from-orange-500/15 via-accent/5 to-transparent",
    accentColor: "#f97316",
    version: "Version 2",
  },
  {
    name: "Career Roadmap",
    icon: Map,
    description: "Get a precise, month-by-month roadmap to your next promotion. The AI maps skill gaps, recommends projects, and tracks your readiness in real time.",
    capabilities: [
      "Current level → target role gap analysis",
      "Month-by-month milestone planning",
      "Recommended projects & learning resources",
      "Promotion readiness score",
      "Estimated timeline with confidence interval",
    ],
    gradient: "from-rose-500/15 via-accent/5 to-transparent",
    accentColor: "#f43f5e",
    version: "Version 2",
  },
];

// ─── Roadmap Modal ─────────────────────────────────────────────────────────────

function RoadmapModal({
  item,
  onClose,
}: {
  item: RoadmapItem;
  onClose: () => void;
}) {
  const Icon = item.icon;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-background/60 backdrop-blur-md"
        aria-hidden="true"
      />

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="roadmap-modal-title"
        className="fixed z-[101] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md"
      >
        <div className="relative bg-card border border-border/60 rounded-3xl shadow-2xl overflow-hidden">

          {/* Gradient glow top */}
          <div className={cn("absolute top-0 left-0 right-0 h-48 bg-gradient-to-b pointer-events-none", item.gradient)} />

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-muted/70 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative p-8">

            {/* Icon + title */}
            <div className="flex items-start gap-4 mb-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
                style={{ backgroundColor: `${item.accentColor}18`, boxShadow: `0 0 24px ${item.accentColor}22` }}
              >
                <Icon className="w-7 h-7" style={{ color: item.accentColor }} />
              </div>
              <div className="pt-1">
                <h2 id="roadmap-modal-title" className="font-bold text-xl tracking-tight leading-tight">
                  {item.name}
                </h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                    style={{ backgroundColor: `${item.accentColor}18`, color: item.accentColor }}
                  >
                    <Zap className="w-3 h-3" />
                    Planned · {item.version}
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-muted text-[11px] font-medium text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    In Development
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {item.description}
            </p>

            {/* Capabilities */}
            <div className="mb-6">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">
                Planned Capabilities
              </p>
              <div className="space-y-2.5">
                {item.capabilities.map((cap, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.2 }}
                    className="flex items-start gap-2.5"
                  >
                    <CheckCircle2
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: item.accentColor }}
                    />
                    <span className="text-sm text-foreground/80 leading-snug">{cap}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer status bar */}
            <div className="flex items-center justify-between pt-5 border-t border-border/50">
              <div className="text-xs text-muted-foreground">
                Currently planned for{" "}
                <span className="font-semibold text-foreground">{item.version}</span>
              </div>
              <div
                className="h-1.5 w-24 rounded-full overflow-hidden"
                style={{ backgroundColor: `${item.accentColor}20` }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "30%" }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.accentColor }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Roadmap sidebar item ──────────────────────────────────────────────────────

function RoadmapNavItem({
  item,
  isCollapsed,
  onClick,
}: {
  item: RoadmapItem;
  isCollapsed: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  const content = (
    <button
      onClick={onClick}
      aria-label={`View ${item.name} roadmap details`}
      className="w-full relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 group cursor-pointer
        text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/50"
    >
      <motion.div whileHover={{ y: -1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
        <Icon className="w-[18px] h-[18px] shrink-0 transition-colors group-hover:text-foreground/70" />
      </motion.div>

      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex items-center justify-between overflow-hidden"
          >
            <span className="truncate text-sm whitespace-nowrap">{item.name}</span>
            {/* Planned dot — subtle, no badge */}
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 shrink-0 ml-2 group-hover:bg-accent/50 transition-colors" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger render={<span />}>{content}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs font-medium">
          {item.name}
          <span className="ml-1.5 text-muted-foreground/70">· Planned</span>
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

// ─── Main nav item ─────────────────────────────────────────────────────────────

interface NavItemProps {
  item: { name: string; href: string; icon: React.ElementType };
  isActive: boolean;
  isCollapsed: boolean;
}

function NavItem({ item, isActive, isCollapsed }: NavItemProps) {
  const Icon = item.icon;

  const content = (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 group",
        isActive
          ? "bg-accent/10 text-accent font-medium"
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="sidebarActiveNav"
          className="absolute left-0 w-[3px] h-5 bg-accent rounded-r-full"
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      )}
      <Icon
        className={cn(
          "w-[18px] h-[18px] shrink-0 transition-colors",
          isActive ? "text-accent" : "text-muted-foreground group-hover:text-foreground"
        )}
      />
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="truncate text-sm overflow-hidden whitespace-nowrap"
          >
            {item.name}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger render={<span />}>{content}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs font-medium">
          {item.name}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeModal, setActiveModal] = useState<RoadmapItem | null>(null);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <motion.aside
        animate={{ width: isCollapsed ? 72 : 264 }}
        transition={{ type: "spring", stiffness: 350, damping: 35 }}
        className="h-full border-r border-border/50 bg-card/50 backdrop-blur-sm flex flex-col shrink-0 relative overflow-hidden"
      >
        {/* Header */}
        <div className="h-16 flex items-center px-4 shrink-0 border-b border-border/50">
          <Link href="/" className="flex items-center gap-2 overflow-hidden group">
            <Logo size="md" className="group-hover:opacity-90 transition-opacity" />
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="font-bold text-[15px] whitespace-nowrap tracking-tight"
                >
                  Resume<span className="text-accent">OS</span>
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-5 no-scrollbar">

          {/* Main Nav */}
          <div>
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2"
                >
                  Main
                </motion.p>
              )}
            </AnimatePresence>
            <nav className="space-y-0.5" aria-label="Main navigation">
              {MAIN_NAV.map((item) => (
                <NavItem
                  key={item.name}
                  item={item}
                  isActive={isActive(item.href)}
                  isCollapsed={isCollapsed}
                />
              ))}
            </nav>
          </div>

          {/* Divider */}
          <div className="px-3">
            <div className="h-px bg-border/50" />
          </div>

          {/* Product Roadmap */}
          <div>
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="px-3 mb-2 flex items-center justify-between"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                    Product Roadmap
                  </span>
                  <span className="text-[9px] font-semibold text-muted-foreground/40 uppercase tracking-wider">
                    v2
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <nav className="space-y-0.5" aria-label="Product roadmap">
              {ROADMAP_ITEMS.map((item) => (
                <RoadmapNavItem
                  key={item.name}
                  item={item}
                  isCollapsed={isCollapsed}
                  onClick={() => setActiveModal(item)}
                />
              ))}
            </nav>
          </div>

        </div>

        {/* Bottom Nav & Controls */}
        <div className="p-2 border-t border-border/50 shrink-0 space-y-0.5">
          {BOTTOM_NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const content = (
              <Link
                key={item.name}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl transition-all group",
                  active
                    ? "bg-accent/10 text-accent font-medium"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm truncate overflow-hidden whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
            if (isCollapsed) {
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger render={<span />}>{content}</TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">{item.name}</TooltipContent>
                </Tooltip>
              );
            }
            return content;
          })}

          <div className={cn("flex items-center px-3 py-2 mt-1 gap-3", isCollapsed && "justify-center")}>
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-medium text-muted-foreground"
                >
                  Theme
                </motion.span>
              )}
            </AnimatePresence>
            <ThemeToggle />
          </div>
        </div>

        {/* Collapse Toggle */}
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="absolute top-[18px] -right-3 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent hover:text-accent transition-all z-50 shadow-sm"
              />
            }
          >
            <PanelLeftClose className={cn("w-3 h-3 transition-transform duration-200", isCollapsed && "rotate-180")} />
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            {isCollapsed ? "Expand" : "Collapse"}
          </TooltipContent>
        </Tooltip>
      </motion.aside>

      {/* Roadmap Modal — rendered outside aside so it covers full viewport */}
      {activeModal && (
        <RoadmapModal
          item={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}
    </>
  );
}
