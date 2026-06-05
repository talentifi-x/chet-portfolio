/**
 * The Studio renders its own full-page UI and manages its own <html>-level
 * styling, so we keep this layout minimal and let it take over the viewport.
 */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
