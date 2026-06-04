import {useDispatch, useSelector, useStore} from "react-redux";
import {type AppStore, type AppDispatch, type RootState} from "@/store/store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

// export function useBudgets() {
//     return useAppSelector((state) => state.app.budgets);
// }
//
// export function useSections() {
//     return useAppSelector((state) => state.app.sections);
// }
//
// export function useItems() {
//     return useAppSelector((state) => state.app.items);
// }
//
// export function useTransactions() {
//     return useAppSelector((state) => state.app.transactions);
// }
//
// export function useOpenBudget() {
//     return useAppSelector((state) => state.user.openBudget != null ? state.app.budgets[state.user.openBudget] : null);
// }
//
// export function useHasCompletedSetup() {
//     return useAppSelector((state) => state.user.hasCompletedSetup);
// }