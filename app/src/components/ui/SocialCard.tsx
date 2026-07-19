import { Card } from "@mui/material";
import StyledText from "./StyledText";

export default function SocialCard({
  title,
  href,
  imgSrc,
}: {
  title: string;
  href: string;
  imgSrc: string;
}) {
  return (
    <Card
      component="a"
      href={href}
      target="_blank"
      rel="noreferrer"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 2,
        boxShadow: 3,
        p: 3,
        minWidth: 200,
        textAlign: "center",
        transition: "transform 0.3s ease, boxShadow 0.3s ease",
        cursor: "pointer",
        textDecoration: "none",
        color: "inherit",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <img
        src={imgSrc}
        alt={title}
        width={80}
        height={80}
        style={{ objectFit: "contain", marginBottom: 4 }}
      />

      <StyledText
        type="heading"
        component="h3"
        sx={{
          m: 0,
        }}
      >
        {title}
      </StyledText>
    </Card>
  );
}
