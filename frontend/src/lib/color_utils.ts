// Welcome to pain, please enjoy your stay
// Surely there's a better way to do this

/**
 * A TailwindCSS color.
 */
export type Color = "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky" |
    "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose" | "slate" | "gray" | "zinc" | "neutral" |
    "stone"

/**
 * A magnitude of a TailwindCSS color.
 */
export type Magnitude = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

/**
 * All the colors TailwindCSS supports.
 */
export const COLORS: Array<Color> = [
    "red", "orange", "amber", "yellow", "lime",
    "green", "emerald", "teal", "cyan", "sky",
    "blue", "indigo", "violet", "purple", "fuchsia",
    "pink", "rose",

    "slate", "gray", "zinc", "neutral", "stone"
]

/**
 * Returns the TailwindCSS class for a given color and magnitude.
 * @param color The color to determine the class for.
 * @param magnitude The numerical magnitude of the color.
 */
export function bgColor(color: Color, magnitude: Magnitude) {
	switch (magnitude) {
		case 50: return bgColor50(color);
		case 100: return bgColor100(color);
		case 200: return bgColor200(color);
		case 300: return bgColor300(color);
		case 400: return bgColor400(color);
		case 500: return bgColor500(color);
		case 600: return bgColor600(color);
		case 700: return bgColor700(color);
		case 800: return bgColor800(color);
		case 900: return bgColor900(color);
		case 950: return bgColor950(color);
		default: return "white";
	}
}

function bgColor50(color: Color) {
	switch (color) {
		case "red":
			return "bg-red-50"
		case "orange":
			return "bg-orange-50"
		case "amber":
			return "bg-amber-50"
		case "yellow":
			return "bg-yellow-50"
		case "lime":
			return "bg-lime-50"
		case "green":
			return "bg-green-50"
		case "emerald":
			return "bg-emerald-50"
		case "teal":
			return "bg-teal-50"
		case "cyan":
			return "bg-cyan-50"
		case "sky":
			return "bg-sky-50"
		case "blue":
			return "bg-blue-50"
		case "indigo":
			return "bg-indigo-50"
		case "violet":
			return "bg-violet-50"
		case "purple":
			return "bg-purple-50"
		case "fuchsia":
			return "bg-fuchsia-50"
		case "pink":
			return "bg-pink-50"
		case "rose":
			return "bg-rose-50"
		case "slate":
			return "bg-slate-50"
		case "gray":
			return "bg-gray-50"
		case "zinc":
			return "bg-zinc-50"
		case "neutral":
			return "bg-neutral-50"
		case "stone":
			return "bg-stone-50"
		default:
			return "bg-white"
	}
}

function bgColor100(color: Color) {
	switch (color) {
		case "red":
			return "bg-red-100"
		case "orange":
			return "bg-orange-100"
		case "amber":
			return "bg-amber-100"
		case "yellow":
			return "bg-yellow-100"
		case "lime":
			return "bg-lime-100"
		case "green":
			return "bg-green-100"
		case "emerald":
			return "bg-emerald-100"
		case "teal":
			return "bg-teal-100"
		case "cyan":
			return "bg-cyan-100"
		case "sky":
			return "bg-sky-100"
		case "blue":
			return "bg-blue-100"
		case "indigo":
			return "bg-indigo-100"
		case "violet":
			return "bg-violet-100"
		case "purple":
			return "bg-purple-100"
		case "fuchsia":
			return "bg-fuchsia-100"
		case "pink":
			return "bg-pink-100"
		case "rose":
			return "bg-rose-100"
		case "slate":
			return "bg-slate-100"
		case "gray":
			return "bg-gray-100"
		case "zinc":
			return "bg-zinc-100"
		case "neutral":
			return "bg-neutral-100"
		case "stone":
			return "bg-stone-100"
		default:
			return "bg-white"
	}
}

function bgColor200(color: Color) {
	switch (color) {
		case "red":
			return "bg-red-200"
		case "orange":
			return "bg-orange-200"
		case "amber":
			return "bg-amber-200"
		case "yellow":
			return "bg-yellow-200"
		case "lime":
			return "bg-lime-200"
		case "green":
			return "bg-green-200"
		case "emerald":
			return "bg-emerald-200"
		case "teal":
			return "bg-teal-200"
		case "cyan":
			return "bg-cyan-200"
		case "sky":
			return "bg-sky-200"
		case "blue":
			return "bg-blue-200"
		case "indigo":
			return "bg-indigo-200"
		case "violet":
			return "bg-violet-200"
		case "purple":
			return "bg-purple-200"
		case "fuchsia":
			return "bg-fuchsia-200"
		case "pink":
			return "bg-pink-200"
		case "rose":
			return "bg-rose-200"
		case "slate":
			return "bg-slate-200"
		case "gray":
			return "bg-gray-200"
		case "zinc":
			return "bg-zinc-200"
		case "neutral":
			return "bg-neutral-200"
		case "stone":
			return "bg-stone-200"
		default:
			return "bg-white"
	}
}

function bgColor300(color: Color) {
	switch (color) {
		case "red":
			return "bg-red-300"
		case "orange":
			return "bg-orange-300"
		case "amber":
			return "bg-amber-300"
		case "yellow":
			return "bg-yellow-300"
		case "lime":
			return "bg-lime-300"
		case "green":
			return "bg-green-300"
		case "emerald":
			return "bg-emerald-300"
		case "teal":
			return "bg-teal-300"
		case "cyan":
			return "bg-cyan-300"
		case "sky":
			return "bg-sky-300"
		case "blue":
			return "bg-blue-300"
		case "indigo":
			return "bg-indigo-300"
		case "violet":
			return "bg-violet-300"
		case "purple":
			return "bg-purple-300"
		case "fuchsia":
			return "bg-fuchsia-300"
		case "pink":
			return "bg-pink-300"
		case "rose":
			return "bg-rose-300"
		case "slate":
			return "bg-slate-300"
		case "gray":
			return "bg-gray-300"
		case "zinc":
			return "bg-zinc-300"
		case "neutral":
			return "bg-neutral-300"
		case "stone":
			return "bg-stone-300"
		default:
			return "bg-white"
	}
}

function bgColor400(color: Color) {
	switch (color) {
		case "red":
			return "bg-red-400"
		case "orange":
			return "bg-orange-400"
		case "amber":
			return "bg-amber-400"
		case "yellow":
			return "bg-yellow-400"
		case "lime":
			return "bg-lime-400"
		case "green":
			return "bg-green-400"
		case "emerald":
			return "bg-emerald-400"
		case "teal":
			return "bg-teal-400"
		case "cyan":
			return "bg-cyan-400"
		case "sky":
			return "bg-sky-400"
		case "blue":
			return "bg-blue-400"
		case "indigo":
			return "bg-indigo-400"
		case "violet":
			return "bg-violet-400"
		case "purple":
			return "bg-purple-400"
		case "fuchsia":
			return "bg-fuchsia-400"
		case "pink":
			return "bg-pink-400"
		case "rose":
			return "bg-rose-400"
		case "slate":
			return "bg-slate-400"
		case "gray":
			return "bg-gray-400"
		case "zinc":
			return "bg-zinc-400"
		case "neutral":
			return "bg-neutral-400"
		case "stone":
			return "bg-stone-400"
		default:
			return "bg-white"
	}
}

function bgColor500(color: Color) {
	switch (color) {
		case "red":
			return "bg-red-500"
		case "orange":
			return "bg-orange-500"
		case "amber":
			return "bg-amber-500"
		case "yellow":
			return "bg-yellow-500"
		case "lime":
			return "bg-lime-500"
		case "green":
			return "bg-green-500"
		case "emerald":
			return "bg-emerald-500"
		case "teal":
			return "bg-teal-500"
		case "cyan":
			return "bg-cyan-500"
		case "sky":
			return "bg-sky-500"
		case "blue":
			return "bg-blue-500"
		case "indigo":
			return "bg-indigo-500"
		case "violet":
			return "bg-violet-500"
		case "purple":
			return "bg-purple-500"
		case "fuchsia":
			return "bg-fuchsia-500"
		case "pink":
			return "bg-pink-500"
		case "rose":
			return "bg-rose-500"
		case "slate":
			return "bg-slate-500"
		case "gray":
			return "bg-gray-500"
		case "zinc":
			return "bg-zinc-500"
		case "neutral":
			return "bg-neutral-500"
		case "stone":
			return "bg-stone-500"
		default:
			return "bg-white"
	}
}

function bgColor600(color: Color) {
	switch (color) {
		case "red":
			return "bg-red-600"
		case "orange":
			return "bg-orange-600"
		case "amber":
			return "bg-amber-600"
		case "yellow":
			return "bg-yellow-600"
		case "lime":
			return "bg-lime-600"
		case "green":
			return "bg-green-600"
		case "emerald":
			return "bg-emerald-600"
		case "teal":
			return "bg-teal-600"
		case "cyan":
			return "bg-cyan-600"
		case "sky":
			return "bg-sky-600"
		case "blue":
			return "bg-blue-600"
		case "indigo":
			return "bg-indigo-600"
		case "violet":
			return "bg-violet-600"
		case "purple":
			return "bg-purple-600"
		case "fuchsia":
			return "bg-fuchsia-600"
		case "pink":
			return "bg-pink-600"
		case "rose":
			return "bg-rose-600"
		case "slate":
			return "bg-slate-600"
		case "gray":
			return "bg-gray-600"
		case "zinc":
			return "bg-zinc-600"
		case "neutral":
			return "bg-neutral-600"
		case "stone":
			return "bg-stone-600"
		default:
			return "bg-white"
	}
}

function bgColor700(color: Color) {
	switch (color) {
		case "red":
			return "bg-red-700"
		case "orange":
			return "bg-orange-700"
		case "amber":
			return "bg-amber-700"
		case "yellow":
			return "bg-yellow-700"
		case "lime":
			return "bg-lime-700"
		case "green":
			return "bg-green-700"
		case "emerald":
			return "bg-emerald-700"
		case "teal":
			return "bg-teal-700"
		case "cyan":
			return "bg-cyan-700"
		case "sky":
			return "bg-sky-700"
		case "blue":
			return "bg-blue-700"
		case "indigo":
			return "bg-indigo-700"
		case "violet":
			return "bg-violet-700"
		case "purple":
			return "bg-purple-700"
		case "fuchsia":
			return "bg-fuchsia-700"
		case "pink":
			return "bg-pink-700"
		case "rose":
			return "bg-rose-700"
		case "slate":
			return "bg-slate-700"
		case "gray":
			return "bg-gray-700"
		case "zinc":
			return "bg-zinc-700"
		case "neutral":
			return "bg-neutral-700"
		case "stone":
			return "bg-stone-700"
		default:
			return "bg-white"
	}
}

function bgColor800(color: Color) {
	switch (color) {
		case "red":
			return "bg-red-800"
		case "orange":
			return "bg-orange-800"
		case "amber":
			return "bg-amber-800"
		case "yellow":
			return "bg-yellow-800"
		case "lime":
			return "bg-lime-800"
		case "green":
			return "bg-green-800"
		case "emerald":
			return "bg-emerald-800"
		case "teal":
			return "bg-teal-800"
		case "cyan":
			return "bg-cyan-800"
		case "sky":
			return "bg-sky-800"
		case "blue":
			return "bg-blue-800"
		case "indigo":
			return "bg-indigo-800"
		case "violet":
			return "bg-violet-800"
		case "purple":
			return "bg-purple-800"
		case "fuchsia":
			return "bg-fuchsia-800"
		case "pink":
			return "bg-pink-800"
		case "rose":
			return "bg-rose-800"
		case "slate":
			return "bg-slate-800"
		case "gray":
			return "bg-gray-800"
		case "zinc":
			return "bg-zinc-800"
		case "neutral":
			return "bg-neutral-800"
		case "stone":
			return "bg-stone-800"
		default:
			return "bg-white"
	}
}

function bgColor900(color: Color) {
	switch (color) {
		case "red":
			return "bg-red-900"
		case "orange":
			return "bg-orange-900"
		case "amber":
			return "bg-amber-900"
		case "yellow":
			return "bg-yellow-900"
		case "lime":
			return "bg-lime-900"
		case "green":
			return "bg-green-900"
		case "emerald":
			return "bg-emerald-900"
		case "teal":
			return "bg-teal-900"
		case "cyan":
			return "bg-cyan-900"
		case "sky":
			return "bg-sky-900"
		case "blue":
			return "bg-blue-900"
		case "indigo":
			return "bg-indigo-900"
		case "violet":
			return "bg-violet-900"
		case "purple":
			return "bg-purple-900"
		case "fuchsia":
			return "bg-fuchsia-900"
		case "pink":
			return "bg-pink-900"
		case "rose":
			return "bg-rose-900"
		case "slate":
			return "bg-slate-900"
		case "gray":
			return "bg-gray-900"
		case "zinc":
			return "bg-zinc-900"
		case "neutral":
			return "bg-neutral-900"
		case "stone":
			return "bg-stone-900"
		default:
			return "bg-white"
	}
}

function bgColor950(color: Color) {
	switch (color) {
		case "red":
			return "bg-red-950"
		case "orange":
			return "bg-orange-950"
		case "amber":
			return "bg-amber-950"
		case "yellow":
			return "bg-yellow-950"
		case "lime":
			return "bg-lime-950"
		case "green":
			return "bg-green-950"
		case "emerald":
			return "bg-emerald-950"
		case "teal":
			return "bg-teal-950"
		case "cyan":
			return "bg-cyan-950"
		case "sky":
			return "bg-sky-950"
		case "blue":
			return "bg-blue-950"
		case "indigo":
			return "bg-indigo-950"
		case "violet":
			return "bg-violet-950"
		case "purple":
			return "bg-purple-950"
		case "fuchsia":
			return "bg-fuchsia-950"
		case "pink":
			return "bg-pink-950"
		case "rose":
			return "bg-rose-950"
		case "slate":
			return "bg-slate-950"
		case "gray":
			return "bg-gray-950"
		case "zinc":
			return "bg-zinc-950"
		case "neutral":
			return "bg-neutral-950"
		case "stone":
			return "bg-stone-950"
		default:
			return "bg-white"
	}
}

/**
 * Returns the TailwindCSS class.
 * @param color 
 * @param magnitude 
 */
export function textColor(color: Color, magnitude: Magnitude) {
	switch (magnitude) {
		case 50: return textColor50(color);
		case 100: return textColor100(color);
		case 200: return textColor200(color);
		case 300: return textColor300(color);
		case 400: return textColor400(color);
		case 500: return textColor500(color);
		case 600: return textColor600(color);
		case 700: return textColor700(color);
		case 800: return textColor800(color);
		case 900: return textColor900(color);
		case 950: return textColor950(color);
		default: return "white";
	}
}

function textColor50(color: Color) {
	switch (color) {
		case "red":
			return "text-red-50"
		case "orange":
			return "text-orange-50"
		case "amber":
			return "text-amber-50"
		case "yellow":
			return "text-yellow-50"
		case "lime":
			return "text-lime-50"
		case "green":
			return "text-green-50"
		case "emerald":
			return "text-emerald-50"
		case "teal":
			return "text-teal-50"
		case "cyan":
			return "text-cyan-50"
		case "sky":
			return "text-sky-50"
		case "blue":
			return "text-blue-50"
		case "indigo":
			return "text-indigo-50"
		case "violet":
			return "text-violet-50"
		case "purple":
			return "text-purple-50"
		case "fuchsia":
			return "text-fuchsia-50"
		case "pink":
			return "text-pink-50"
		case "rose":
			return "text-rose-50"
		case "slate":
			return "text-slate-50"
		case "gray":
			return "text-gray-50"
		case "zinc":
			return "text-zinc-50"
		case "neutral":
			return "text-neutral-50"
		case "stone":
			return "text-stone-50"
		default:
			return "text-white"
	}
}

function textColor100(color: Color) {
	switch (color) {
		case "red":
			return "text-red-100"
		case "orange":
			return "text-orange-100"
		case "amber":
			return "text-amber-100"
		case "yellow":
			return "text-yellow-100"
		case "lime":
			return "text-lime-100"
		case "green":
			return "text-green-100"
		case "emerald":
			return "text-emerald-100"
		case "teal":
			return "text-teal-100"
		case "cyan":
			return "text-cyan-100"
		case "sky":
			return "text-sky-100"
		case "blue":
			return "text-blue-100"
		case "indigo":
			return "text-indigo-100"
		case "violet":
			return "text-violet-100"
		case "purple":
			return "text-purple-100"
		case "fuchsia":
			return "text-fuchsia-100"
		case "pink":
			return "text-pink-100"
		case "rose":
			return "text-rose-100"
		case "slate":
			return "text-slate-100"
		case "gray":
			return "text-gray-100"
		case "zinc":
			return "text-zinc-100"
		case "neutral":
			return "text-neutral-100"
		case "stone":
			return "text-stone-100"
		default:
			return "text-white"
	}
}

function textColor200(color: Color) {
	switch (color) {
		case "red":
			return "text-red-200"
		case "orange":
			return "text-orange-200"
		case "amber":
			return "text-amber-200"
		case "yellow":
			return "text-yellow-200"
		case "lime":
			return "text-lime-200"
		case "green":
			return "text-green-200"
		case "emerald":
			return "text-emerald-200"
		case "teal":
			return "text-teal-200"
		case "cyan":
			return "text-cyan-200"
		case "sky":
			return "text-sky-200"
		case "blue":
			return "text-blue-200"
		case "indigo":
			return "text-indigo-200"
		case "violet":
			return "text-violet-200"
		case "purple":
			return "text-purple-200"
		case "fuchsia":
			return "text-fuchsia-200"
		case "pink":
			return "text-pink-200"
		case "rose":
			return "text-rose-200"
		case "slate":
			return "text-slate-200"
		case "gray":
			return "text-gray-200"
		case "zinc":
			return "text-zinc-200"
		case "neutral":
			return "text-neutral-200"
		case "stone":
			return "text-stone-200"
		default:
			return "text-white"
	}
}

function textColor300(color: Color) {
	switch (color) {
		case "red":
			return "text-red-300"
		case "orange":
			return "text-orange-300"
		case "amber":
			return "text-amber-300"
		case "yellow":
			return "text-yellow-300"
		case "lime":
			return "text-lime-300"
		case "green":
			return "text-green-300"
		case "emerald":
			return "text-emerald-300"
		case "teal":
			return "text-teal-300"
		case "cyan":
			return "text-cyan-300"
		case "sky":
			return "text-sky-300"
		case "blue":
			return "text-blue-300"
		case "indigo":
			return "text-indigo-300"
		case "violet":
			return "text-violet-300"
		case "purple":
			return "text-purple-300"
		case "fuchsia":
			return "text-fuchsia-300"
		case "pink":
			return "text-pink-300"
		case "rose":
			return "text-rose-300"
		case "slate":
			return "text-slate-300"
		case "gray":
			return "text-gray-300"
		case "zinc":
			return "text-zinc-300"
		case "neutral":
			return "text-neutral-300"
		case "stone":
			return "text-stone-300"
		default:
			return "text-white"
	}
}

function textColor400(color: Color) {
	switch (color) {
		case "red":
			return "text-red-400"
		case "orange":
			return "text-orange-400"
		case "amber":
			return "text-amber-400"
		case "yellow":
			return "text-yellow-400"
		case "lime":
			return "text-lime-400"
		case "green":
			return "text-green-400"
		case "emerald":
			return "text-emerald-400"
		case "teal":
			return "text-teal-400"
		case "cyan":
			return "text-cyan-400"
		case "sky":
			return "text-sky-400"
		case "blue":
			return "text-blue-400"
		case "indigo":
			return "text-indigo-400"
		case "violet":
			return "text-violet-400"
		case "purple":
			return "text-purple-400"
		case "fuchsia":
			return "text-fuchsia-400"
		case "pink":
			return "text-pink-400"
		case "rose":
			return "text-rose-400"
		case "slate":
			return "text-slate-400"
		case "gray":
			return "text-gray-400"
		case "zinc":
			return "text-zinc-400"
		case "neutral":
			return "text-neutral-400"
		case "stone":
			return "text-stone-400"
		default:
			return "text-white"
	}
}

function textColor500(color: Color) {
	switch (color) {
		case "red":
			return "text-red-500"
		case "orange":
			return "text-orange-500"
		case "amber":
			return "text-amber-500"
		case "yellow":
			return "text-yellow-500"
		case "lime":
			return "text-lime-500"
		case "green":
			return "text-green-500"
		case "emerald":
			return "text-emerald-500"
		case "teal":
			return "text-teal-500"
		case "cyan":
			return "text-cyan-500"
		case "sky":
			return "text-sky-500"
		case "blue":
			return "text-blue-500"
		case "indigo":
			return "text-indigo-500"
		case "violet":
			return "text-violet-500"
		case "purple":
			return "text-purple-500"
		case "fuchsia":
			return "text-fuchsia-500"
		case "pink":
			return "text-pink-500"
		case "rose":
			return "text-rose-500"
		case "slate":
			return "text-slate-500"
		case "gray":
			return "text-gray-500"
		case "zinc":
			return "text-zinc-500"
		case "neutral":
			return "text-neutral-500"
		case "stone":
			return "text-stone-500"
		default:
			return "text-white"
	}
}

function textColor600(color: Color) {
	switch (color) {
		case "red":
			return "text-red-600"
		case "orange":
			return "text-orange-600"
		case "amber":
			return "text-amber-600"
		case "yellow":
			return "text-yellow-600"
		case "lime":
			return "text-lime-600"
		case "green":
			return "text-green-600"
		case "emerald":
			return "text-emerald-600"
		case "teal":
			return "text-teal-600"
		case "cyan":
			return "text-cyan-600"
		case "sky":
			return "text-sky-600"
		case "blue":
			return "text-blue-600"
		case "indigo":
			return "text-indigo-600"
		case "violet":
			return "text-violet-600"
		case "purple":
			return "text-purple-600"
		case "fuchsia":
			return "text-fuchsia-600"
		case "pink":
			return "text-pink-600"
		case "rose":
			return "text-rose-600"
		case "slate":
			return "text-slate-600"
		case "gray":
			return "text-gray-600"
		case "zinc":
			return "text-zinc-600"
		case "neutral":
			return "text-neutral-600"
		case "stone":
			return "text-stone-600"
		default:
			return "text-white"
	}
}

function textColor700(color: Color) {
	switch (color) {
		case "red":
			return "text-red-700"
		case "orange":
			return "text-orange-700"
		case "amber":
			return "text-amber-700"
		case "yellow":
			return "text-yellow-700"
		case "lime":
			return "text-lime-700"
		case "green":
			return "text-green-700"
		case "emerald":
			return "text-emerald-700"
		case "teal":
			return "text-teal-700"
		case "cyan":
			return "text-cyan-700"
		case "sky":
			return "text-sky-700"
		case "blue":
			return "text-blue-700"
		case "indigo":
			return "text-indigo-700"
		case "violet":
			return "text-violet-700"
		case "purple":
			return "text-purple-700"
		case "fuchsia":
			return "text-fuchsia-700"
		case "pink":
			return "text-pink-700"
		case "rose":
			return "text-rose-700"
		case "slate":
			return "text-slate-700"
		case "gray":
			return "text-gray-700"
		case "zinc":
			return "text-zinc-700"
		case "neutral":
			return "text-neutral-700"
		case "stone":
			return "text-stone-700"
		default:
			return "text-white"
	}
}

function textColor800(color: Color) {
	switch (color) {
		case "red":
			return "text-red-800"
		case "orange":
			return "text-orange-800"
		case "amber":
			return "text-amber-800"
		case "yellow":
			return "text-yellow-800"
		case "lime":
			return "text-lime-800"
		case "green":
			return "text-green-800"
		case "emerald":
			return "text-emerald-800"
		case "teal":
			return "text-teal-800"
		case "cyan":
			return "text-cyan-800"
		case "sky":
			return "text-sky-800"
		case "blue":
			return "text-blue-800"
		case "indigo":
			return "text-indigo-800"
		case "violet":
			return "text-violet-800"
		case "purple":
			return "text-purple-800"
		case "fuchsia":
			return "text-fuchsia-800"
		case "pink":
			return "text-pink-800"
		case "rose":
			return "text-rose-800"
		case "slate":
			return "text-slate-800"
		case "gray":
			return "text-gray-800"
		case "zinc":
			return "text-zinc-800"
		case "neutral":
			return "text-neutral-800"
		case "stone":
			return "text-stone-800"
		default:
			return "text-white"
	}
}

function textColor900(color: Color) {
	switch (color) {
		case "red":
			return "text-red-900"
		case "orange":
			return "text-orange-900"
		case "amber":
			return "text-amber-900"
		case "yellow":
			return "text-yellow-900"
		case "lime":
			return "text-lime-900"
		case "green":
			return "text-green-900"
		case "emerald":
			return "text-emerald-900"
		case "teal":
			return "text-teal-900"
		case "cyan":
			return "text-cyan-900"
		case "sky":
			return "text-sky-900"
		case "blue":
			return "text-blue-900"
		case "indigo":
			return "text-indigo-900"
		case "violet":
			return "text-violet-900"
		case "purple":
			return "text-purple-900"
		case "fuchsia":
			return "text-fuchsia-900"
		case "pink":
			return "text-pink-900"
		case "rose":
			return "text-rose-900"
		case "slate":
			return "text-slate-900"
		case "gray":
			return "text-gray-900"
		case "zinc":
			return "text-zinc-900"
		case "neutral":
			return "text-neutral-900"
		case "stone":
			return "text-stone-900"
		default:
			return "text-white"
	}
}

function textColor950(color: Color) {
	switch (color) {
		case "red":
			return "text-red-950"
		case "orange":
			return "text-orange-950"
		case "amber":
			return "text-amber-950"
		case "yellow":
			return "text-yellow-950"
		case "lime":
			return "text-lime-950"
		case "green":
			return "text-green-950"
		case "emerald":
			return "text-emerald-950"
		case "teal":
			return "text-teal-950"
		case "cyan":
			return "text-cyan-950"
		case "sky":
			return "text-sky-950"
		case "blue":
			return "text-blue-950"
		case "indigo":
			return "text-indigo-950"
		case "violet":
			return "text-violet-950"
		case "purple":
			return "text-purple-950"
		case "fuchsia":
			return "text-fuchsia-950"
		case "pink":
			return "text-pink-950"
		case "rose":
			return "text-rose-950"
		case "slate":
			return "text-slate-950"
		case "gray":
			return "text-gray-950"
		case "zinc":
			return "text-zinc-950"
		case "neutral":
			return "text-neutral-950"
		case "stone":
			return "text-stone-950"
		default:
			return "text-white"
	}
}