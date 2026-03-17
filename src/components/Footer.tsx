import { Link } from "react-router-dom";
import { Instagram, Twitter, Shield, CheckCircle } from "lucide-react";
import wfLogo from "@/assets/Transparent_logo.png";

const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/product" },
    { name: "Transparency", href: "/transparency" },
  ];
  const contactLinks = [
    { name: "Contact Us", href: "#" },
    { name: "FAQ", href: "#" },
    { name: "Privacy Policy", href: "#" },
  ];
  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  return (
    <footer className="border-t border-border bg-secondary/30 pb-[var(--space-xl)] sm:pb-0">
      <div className="mx-auto max-w-7xl px-[var(--space-sm)] py-[var(--space-md)] lg:px-[var(--space-md)] lg:py-[var(--space-lg)]">
        <div className="grid grid-cols-2 gap-6 text-left sm:gap-8 lg:grid-cols-4 lg:gap-12">
          <div className="col-span-2 flex flex-col items-center text-center lg:col-span-1 lg:items-start lg:text-left">
            <img src={wfLogo} alt="WellForged Logo" className="mb-3 h-8 w-8 object-contain sm:h-10 sm:w-10" />
            <p className="font-display text-sm font-medium text-foreground sm:text-base">WellForged</p>
            <p className="mt-1 max-w-[18rem] font-body text-[11px] italic text-muted-foreground sm:text-xs">Wellness, Forged With Integrity</p>
            <div className="mt-4 flex items-center gap-[var(--space-xs)]">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-[var(--space-xl)] w-[var(--space-xl)] items-center justify-center rounded-full bg-muted transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="h-1/2 w-1/2" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h4 className="mb-1.5 font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground sm:mb-2 sm:text-xs">Quick Links</h4>
            <ul className="space-y-[var(--space-2xs)] text-center lg:text-left">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    onClick={() => window.scrollTo(0, 0)}
                    className="inline-block py-1 font-body text-muted-foreground transition-colors hover:text-foreground"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h4 className="mb-1.5 font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground sm:mb-2 sm:text-xs">Contact</h4>
            <ul className="space-y-1.5 text-center lg:text-left sm:space-y-2">
              {contactLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="inline-block py-1.5 font-body text-muted-foreground transition-colors hover:text-foreground"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:block" />
        </div>

        <div className="mt-3 border-t border-border pt-3 sm:mt-6 sm:pt-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
              <p className="font-body text-[9px] text-muted-foreground sm:text-[10px]">© {new Date().getFullYear()} WellForged. All rights reserved.</p>
              <p className="rounded border border-border/50 bg-muted/50 px-2 py-0.5 font-mono text-[9px] text-muted-foreground">FSSAI Lic. No. 1002XXXXXXXXXX</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5">
              <Shield className="h-3 w-3 text-primary" />
              <CheckCircle className="h-2.5 w-2.5 text-primary" />
              <span className="font-body text-[9px] font-medium text-primary">Secure & Verified</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
