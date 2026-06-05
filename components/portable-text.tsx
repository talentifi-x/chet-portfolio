import { PortableText, type PortableTextComponents, type PortableTextBlock } from "next-sanity";
import type { Image as SanityImage } from "sanity";

import { urlForImage } from "@/sanity/lib/image";

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImage & { alt?: string; caption?: string } }) => {
      if (!value?.asset) return null;
      const url = urlForImage(value).width(1400).url();
      return (
        <figure className="prose__figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={value.alt || ""} loading="lazy" />
          {value.caption ? (
            <figcaption className="prose__caption">{value.caption}</figcaption>
          ) : null}
        </figure>
      );
    },
  },
  marks: {
    link: ({ value, children }) => {
      const href = (value as { href?: string })?.href || "#";
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          className="prose__link"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => <code className="prose__code">{children}</code>,
  },
  block: {
    blockquote: ({ children }) => <blockquote className="prose__quote">{children}</blockquote>,
  },
};

export default function PortableTextRenderer({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}
