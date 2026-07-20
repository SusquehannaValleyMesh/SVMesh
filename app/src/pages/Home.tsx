import { useEffect, useState } from "react";
import { Box, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import RecentUpdates from "../components/content/RecentUpdates";
import RecentUpdatesMobileMenu from "../components/menus/RecentUpdatesMobileMenu";
import MarkdownContent from "../components/content/MarkdownContent";
import { HeroSection, PageSection, ContentGrid, StyledText } from "../components/ui";
import { contentImageMap, sharedHeroImage } from "../config/images";
import { parsePageMarkdown, type ParsedPage } from "../utils/pageMarkdown";
import { useUpdates } from "../hooks/useUpdates";

export default function Home() {
  const [pageData, setPageData] = useState<ParsedPage | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const { posts, loading: updatesLoading, error: updatesError } = useUpdates();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const loadPageContent = async () => {
      try {
        const data = await parsePageMarkdown("home");
        setPageData(data);
      } catch (error) {
        console.error("Failed to load home page content:", error);
      } finally {
        setPageLoading(false);
      }
    };

    loadPageContent();
  }, []);

  // Show loading until both page content and updates are ready
  if (pageLoading || updatesLoading) {
    return (
      <PageSection>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <CircularProgress size={40} />
        </Box>
      </PageSection>
    );
  }

  if (!pageData) {
    return (
      <PageSection>
        <StyledText type="body">Failed to load page content.</StyledText>
      </PageSection>
    );
  }

  const { metadata, content } = pageData;

  return (
    <>
      <HeroSection
        backgroundImage={metadata.heroImage ? contentImageMap[metadata.heroImage] : sharedHeroImage}
        title={metadata.title || "We mesh well together."}
        subtitle={metadata.subtitle || ""}
        textAlign="left"
        rightImage={metadata.rightImage ? contentImageMap[metadata.rightImage] : undefined}
        rightImageAlt={metadata.rightImageAlt || ""}
        attributionUrl={metadata.attributionUrl || ""}
        imageCredit={metadata.imageCredit || ""}
      />

      <PageSection>
        <ContentGrid
          mainContent={
            <>
              <MarkdownContent content={content} />
            </>
          }
          sideContent={
            isMobile ? (
              <RecentUpdatesMobileMenu posts={posts} error={updatesError} />
            ) : (
              <RecentUpdates posts={posts} error={updatesError} />
            )
          }
        />
      </PageSection>
    </>
  );
}
