import Typography from "@mui/material/Typography";
import {
  Box,
  LinearProgress,
  LinearProgressProps,
} from "@mui/material";

export default function LinearProgressWithLabel(
    props: LinearProgressProps & { value: number }
  ) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress
            variant="determinate"
            value={Math.round((props.value / 60) * 100)}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value
          )}S`}</Typography>
        </Box>
      </Box>
    );
  }