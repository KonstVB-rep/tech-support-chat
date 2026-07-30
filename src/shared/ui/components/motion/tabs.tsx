"use client";

// beui.dev/components/motion/tabs

import {
	MotionConfig,
	motion,
	type Transition,
	useReducedMotion,
} from "motion/react";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useId,
	useMemo,
	useState,
} from "react";
import { cn } from "@/shared/lib/utils";

type Variant = "pill" | "underline" | "segment";

type Ctx = {
	value: string;
	setValue: (v: string) => void;
	layoutId: string;
	variant: Variant;
};

const TabsCtx = createContext<Ctx | null>(null);

function useTabs() {
	const ctx = useContext(TabsCtx);
	if (!ctx) throw new Error("Tabs.* must be used inside <Tabs>");
	return ctx;
}

// Weighty spring for the active-tab indicator: a touch of overshoot so it
// settles with life instead of snapping.
const transition: Transition = {
	type: "spring",
	stiffness: 170,
	damping: 24,
	mass: 1.2,
};

export function Tabs({
	defaultValue,
	value,
	onValueChange,
	variant = "pill",
	children,
	className,
}: {
	defaultValue?: string;
	value?: string;
	onValueChange?: (v: string) => void;
	variant?: Variant;
	children: ReactNode;
	className?: string;
}) {
	const [internal, setInternal] = useState(defaultValue ?? "");
	const layoutId = useId();
	const reduce = useReducedMotion();
	const controlled = value !== undefined;
	const current = controlled ? value : internal;
	const setValue = useCallback(
		(v: string) => {
			if (!controlled) setInternal(v);
			onValueChange?.(v);
		},
		[controlled, onValueChange],
	);
	const contextValue = useMemo(
		() => ({ value: current, setValue, layoutId, variant }),
		[current, layoutId, setValue, variant],
	);
	return (
		<MotionConfig transition={reduce ? { duration: 0 } : transition}>
			<TabsCtx.Provider value={contextValue}>
				{/* layoutRoot: the indicator's layoutId measures in page coordinates, so
            inside fixed/scrolled containers it would replay scroll offsets as
            movement. The pill only ever travels within the list, so scoping
            projection to the Tabs wrapper is always correct. */}
				<motion.div className={className} layoutRoot>
					{children}
				</motion.div>
			</TabsCtx.Provider>
		</MotionConfig>
	);
}

const listClasses: Record<Variant, string> = {
	pill: "inline-flex items-center gap-1 rounded-full bg-card p-1",
	underline: "inline-flex items-center gap-1 border-b border-border",
	segment: "inline-flex items-center gap-0 rounded-lg bg-card p-0.5",
};

export function TabsList({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	const { variant } = useTabs();
	return (
		<div className={cn(listClasses[variant], className)} role="tablist">
			{children}
		</div>
	);
}

export function TabsTrigger({
	value,
	children,
	className,
	indicatorClassName,
	classNameWrapper,
}: {
	value: string;
	children: ReactNode;
	className?: string;
	indicatorClassName?: string;
	classNameWrapper?: string;
}) {
	const { value: current, setValue, layoutId, variant } = useTabs();
	const active = current === value;
	const usesDefaultIndicator = indicatorClassName === undefined;

	if (variant === "underline") {
		return (
			<button
				aria-selected={active}
				className={cn(
					"-mb-px relative isolate inline-flex min-h-[44px] items-center px-3 pt-1 pb-2.5 font-medium text-sm transition-colors",
					active
						? "text-foreground"
						: "text-muted-foreground hover:text-foreground",
					className,
				)}
				onClick={() => setValue(value)}
				role="tab"
				type="button"
			>
				{children}
				{active ? (
					<motion.span
						className={cn(
							"-bottom-px absolute right-0 left-0 h-px bg-primary",
							indicatorClassName,
						)}
						layoutId={layoutId}
					/>
				) : null}
			</button>
		);
	}

	const radius = variant === "pill" ? "rounded-full" : "rounded-md";

	return (
		<div className={cn("relative", classNameWrapper)}>
			{active ? (
				<motion.span
					className={cn(
						"absolute inset-0 bg-primary",
						radius,
						indicatorClassName,
					)}
					layoutId={layoutId}
					style={{ borderRadius: variant === "pill" ? 9999 : 8 }}
				/>
			) : null}
			<button
				aria-selected={active}
				className={cn(
					"relative z-10 inline-flex items-center justify-center whitespace-nowrap bg-transparent px-3.5 py-1.5 font-medium text-sm outline-none",
					usesDefaultIndicator
						? "text-white mix-blend-exclusion transition-opacity"
						: "transition-colors",
					usesDefaultIndicator
						? active
							? "opacity-100"
							: "opacity-70 hover:opacity-100"
						: active
							? "text-primary-foreground"
							: "text-muted-foreground hover:text-foreground",
					radius,
					className,
				)}
				onClick={() => setValue(value)}
				role="tab"
				type="button"
			>
				{children}
			</button>
		</div>
	);
}
