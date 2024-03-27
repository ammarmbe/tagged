import Header from "@/components/header/Header";
import { RiShieldUserLine } from "react-icons/ri";

export default function Page() {
  return (
    <div className="flex flex-grow flex-col">
      <Header
        icon={<RiShieldUserLine size={24} className="text-text-500" />}
        title="Privacy & Security"
        description="Manage your privacy and security settings"
      />
    </div>
  );
}
