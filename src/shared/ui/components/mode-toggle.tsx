"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./dropdown-menu";

export function ModeToggle() {
	const { setTheme, theme } = useTheme();

	const isDarkTheme = theme === "dark";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="cursor-pointer" size="icon" variant="outline">
					{isDarkTheme ? (
						<Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 border-none bg-transparent text-white transition-all dark:rotate-0 dark:scale-100" />
					) : (
						<Sun className="dark:-rotate-90 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 border-none bg-transparent transition-all dark:scale-0" />
					)}
					<span className="sr-only">Выбор темы</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					className="cursor-pointer"
					onClick={() => setTheme("light")}
				>
					Светлая
				</DropdownMenuItem>
				<DropdownMenuItem
					className="cursor-pointer"
					onClick={() => setTheme("dark")}
				>
					Темная
				</DropdownMenuItem>
				<DropdownMenuItem
					className="cursor-pointer"
					onClick={() => setTheme("system")}
				>
					Системная
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
