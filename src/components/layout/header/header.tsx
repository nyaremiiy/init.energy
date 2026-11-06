import { HeaderMainBar } from "./header-main-bar";
import { HeaderShell } from "./header-shell";
import { HeaderTopBar } from "./header-top-bar";

export function Header() {
  return <HeaderShell topBar={<HeaderTopBar />} mainBar={<HeaderMainBar />} />;
}
