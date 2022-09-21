import { styled } from "@mui/material/styles";
import Box, { BoxProps } from "@mui/material/Box";
import { Link, LinkProps } from "@mui/material";

export const LoginWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: 400,
  height: 600,
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  border: "1px solid gray",
  borderRadius: "4px",
}));

export const LinkWrapper = styled(Link)<LinkProps>(({ theme }) => ({
  textDecoration: "none",
  fontWeight: "600",
  paddingLeft: "0.5rem",
  cursor: 'pointer',
}));
