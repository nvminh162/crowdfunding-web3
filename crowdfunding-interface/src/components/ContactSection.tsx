import { ALL_CONTACT_GROUPS, type ContactLink } from "@/lib/contact";
import { contact } from "@/lib/contact";
import { config } from "@/lib/config";

function ContactItem({ link }: { link: ContactLink }) {
  const isExternal =
    link.external !== false &&
    !link.href.startsWith("mailto:") &&
    !link.href.startsWith("tel:");

  return (
    <a
      href={link.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className="group flex items-center gap-3 border border-ink-200 bg-white px-4 py-3 text-ink-800 transition duration-300 hover:-translate-y-0.5 hover:border-ink-900 hover:bg-ink-900 hover:text-white"
    >
      <span className="flex h-9 w-9 items-center justify-center border border-ink-200 transition group-hover:border-white/30">
        <img
          src={link.icon}
          alt=""
          aria-hidden
          className="h-4 w-4 transition group-hover:invert"
        />
      </span>
      <span className="truncate text-sm font-medium">{link.label}</span>
    </a>
  );
}

const ContactSection = () => {
  return (
    <section
      id="contact"
      className="scroll-mt-24 border-t border-ink-200 py-16 md:py-24"
    >
      <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-ink-400">
            Contact
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-950 md:text-5xl">
            Say hello
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-500">
            {contact.handle} — reach out anywhere. Prefer GitHub issues or a
            quick message.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <img
              src={config.avatarUrl}
              alt={config.brand}
              className="h-14 w-14 object-cover"
            />
            <div>
              <p className="font-display text-lg font-semibold text-ink-950">
                {config.brand}
              </p>
              <a
                href={contact.social.github}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-ink-500 transition hover:text-ink-900"
              >
                github.com/{config.githubUsername}
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {ALL_CONTACT_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-ink-400">
                {group.title}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {group.links.map((link) => (
                  <ContactItem key={link.id} link={link} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
