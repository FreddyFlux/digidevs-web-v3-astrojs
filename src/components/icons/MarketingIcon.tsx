import type { LucideProps } from "lucide-react";
import {
	ArrowRight,
	BadgeCheck,
	BrainCircuit,
	Building2,
	Cloud,
	Database,
	Gauge,
	User,
	Shield,
	Terminal,
} from "lucide-react";

const icons = {
	terminal: Terminal,
	speed: Gauge,
	cloud: Cloud,
	database: Database,
	security: Shield,
	neurology: BrainCircuit,
	person: User,
	east: ArrowRight,
	arrow_forward: ArrowRight,
	architecture: Building2,
	verified_user: BadgeCheck,
} as const;

export type MarketingIconName = keyof typeof icons;

type Props = {
	name: MarketingIconName;
	className?: string;
	size?: LucideProps["size"];
	strokeWidth?: LucideProps["strokeWidth"];
	"aria-hidden"?: boolean;
};

export default function MarketingIcon({
	name,
	className,
	size = 24,
	strokeWidth = 1.5,
	"aria-hidden": ariaHidden = true,
}: Props) {
	const Cmp = icons[name];
	return <Cmp className={className} size={size} strokeWidth={strokeWidth} aria-hidden={ariaHidden} />;
}
