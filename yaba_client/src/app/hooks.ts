import { useDispatch, useSelector, useStore } from "react-redux";
import { type AppStore, type AppDispatch, type RootState } from "../lib/store";

export const useAppDispatch = useDispatch //useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector //useSelector.withTypes<RootState>();
export const useAppStore 	= useStore    //useStore.withTypes<AppStore>();

export function useDeviceType(): "mobile" | "desktop" | "not yet known" {
	if (typeof window === "undefined") {
		return "not yet known"; // Server-side rendering, we don't know the device type
	} else if (window.innerWidth < 768) {
		return "mobile"; // Mobile device
	} else {
		return "desktop"; // Desktop device
	}
}