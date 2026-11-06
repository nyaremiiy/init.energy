import { HeaderMainBar } from "./header-main-bar";
import { HeaderTopBar } from "./header-top-bar";

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <HeaderTopBar />
      <HeaderMainBar />
    </header>
  );
}
