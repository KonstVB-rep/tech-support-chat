"use client";

// beui.dev/components/motion/shared-layout-bg

import {
	AnimatePresence,
	motion,
	useReducedMotion,
	type Variants,
} from "motion/react";
import {
	Children,
	cloneElement,
	isValidElement,
	type ReactElement,
	type ReactNode,
	useId,
	useState,
} from "react";
import { SPRING_LAYOUT } from "@/shared/lib/ease";
import { cn } from "@/shared/lib/utils";

export interface SharedLayoutBgProps {
	children: ReactNode;
	className?: string;
	pillClassName?: string;
	inset?: number;
	classNameChild?: string;
}

const variants: Variants = {
	initial: { opacity: 0, filter: "blur(6px)" },
	animate: { opacity: 1, filter: "blur(0px)" },
	exit: (isActive: boolean) =>
		!isActive ? { opacity: 0, filter: "blur(6px)" } : {},
};

const reducedVariants: Variants = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: (isActive: boolean) => (!isActive ? { opacity: 0 } : {}),
};

export function SharedLayoutBg({
	children,
	className,
	pillClassName,
	inset = 20,
	classNameChild,
}: SharedLayoutBgProps) {
	const [activeId, setActiveId] = useState<string | null>(null);
	const uid = useId();
	const reduce = useReducedMotion();

	return (
		<motion.div
			className={cn("flex w-full flex-col", className)}
			layoutRoot
			onMouseLeave={() => setActiveId(null)}
		>
			{Children.toArray(children)
				.filter(isValidElement)
				.map((child, index) => {
					const el = child as ReactElement<{
						className?: string;
						onMouseEnter?: () => void;
						children?: ReactNode;
					}>;
					const childKey = el.key ? String(el.key) : `item-${index}`;
					return cloneElement(
						el,
						{
							key: childKey,
							className: cn("relative", el.props.className),
							onMouseEnter: () => setActiveId(childKey),
						},
						<>
							<AnimatePresence custom={activeId !== null}>
								{activeId !== null ? (
									<motion.div
										animate="animate"
										className="pointer-events-none absolute inset-y-0"
										custom={activeId !== null}
										exit="exit"
										initial="initial"
										style={{ left: -inset, right: -inset }}
										variants={reduce ? reducedVariants : variants}
									>
										{activeId === childKey ? (
											<motion.div
												className={cn(
													"pointer-events-none h-full w-full rounded-2xl bg-primary/[0.06]",
													pillClassName,
												)}
												layoutId={`shared-bg-${uid}`}
												transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
											/>
										) : null}
									</motion.div>
								) : null}
							</AnimatePresence>
							<div className={cn("relative z-10", classNameChild)}>
								{el.props.children}
							</div>
						</>,
					);
				})}
		</motion.div>
	);
}
