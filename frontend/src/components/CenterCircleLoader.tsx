import CircularProgress from "@mui/material/CircularProgress";

export default function CenterCircleLoader() {
	return (
		<div className="flex items-center justify-center h-full bg-amber-100">
			<CircularProgress />
		</div>
	);
}