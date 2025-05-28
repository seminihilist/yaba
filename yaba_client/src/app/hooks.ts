import { useDispatch, useSelector, useStore } from "react-redux";
import { type AppStore, type AppDispatch, type RootState } from "../lib/store";

export const useAppDispatch = useDispatch //useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector //useSelector.withTypes<RootState>();
export const useAppStore 	= useStore    //useStore.withTypes<AppStore>();