import { LoaderIcon } from "lucide-react";
import { useThemeStore } from "../../store/useThemeStore";

export default function Loader() {
  const { theme } = useThemeStore();
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      data-theme={theme}
    >
      <LoaderIcon className="animate-spin size-16 text-primary" />
    </div>
  );
}
