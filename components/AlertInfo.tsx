import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { JSX } from "react";

type AlertType = "info" | "warning" | "error" | "success";

type Props = {
  type: AlertType;
  message: string;
};

const styleMap: Record<
  AlertType,
  {
    icon: JSX.Element;
    title: string;
    color: string;
  }
> = {
  info: {
    icon: <Info className="h-5 w-5 text-blue-500" />,
    title: "Information",
    color: "bg-blue-100 text-blue-900 border-blue-300",
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    title: "Avertissement",
    color: "bg-yellow-100 text-yellow-900 border-yellow-300",
  },
  error: {
    icon: <XCircle className="h-5 w-5 text-red-500" />,
    title: "Erreur",
    color: "bg-red-100 text-red-900 border-red-300",
  },
  success: {
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    title: "Succès",
    color: "bg-green-100 text-green-900 border-green-300",
  },
};

export default function AlertInfo({ type, message }: Props) {
  const { icon, title, color } = styleMap[type];

  return (
    <Alert className={cn("border", color)}>
      {icon}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}