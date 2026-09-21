import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";

export function RepoCardSkeleton() {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardHeader
        avatar={<Skeleton variant="circular" width={40} height={40} />}
        title={<Skeleton width="60%" />}
      />
      <CardContent sx={{ pt: 0 }}>
        <Skeleton />
        <Skeleton width="80%" />
        <Skeleton width="50%" sx={{ mt: 2 }} />
      </CardContent>
    </Card>
  );
}
