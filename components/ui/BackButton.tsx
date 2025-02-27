import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";
import { Icon } from "@iconify/react";

const BackButton: React.FC = () => {
  const locale = useLocale();

  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === `/${locale}`;

  if (isHome) return null;

  return (
    <Button
      variant={"outline"}
      onClick={() => router.back()}
      className="fixed bottom-2 left-2 rounded-full w-[38px] h-[38px] shadow-lg"
    >
      <Icon icon="mingcute:arrow-left-fill" width={24} height={24} />
    </Button>
  );
};
export default BackButton;
