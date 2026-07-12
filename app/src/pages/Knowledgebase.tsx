import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  TextField,
  InputAdornment,
  CircularProgress,
  Stack,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArticleIcon from "@mui/icons-material/Article";
import { SimpleHero, PageSection, StyledText } from "../components/ui";
import MarkdownContent from "../components/content/MarkdownContent";
import { sharedHeroImage } from "../config/images";

interface KBArticle {
  slug: string;
  title: string;
  description: string;
  authors?: string[];
  tags?: string[];
}

export default function Knowledgebase() {
  const { article } = useParams<{ article?: string }>();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<KBArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [articleContent, setArticleContent] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const response = await fetch("/content/index/knowledgebase.json", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to load knowledgebase");
        const data = await response.json();
        setArticles(data.files || []);
      } catch (error) {
        console.error("Failed to load knowledgebase:", error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  useEffect(() => {
    if (article) {
      const loadArticle = async () => {
        try {
          const response = await fetch(`/content/pages/knowledgebase/${article}.md`);
          if (!response.ok) throw new Error("Article not found");
          const raw = await response.text();

          setArticleContent(stripFrontmatter(raw));
        } catch (error) {
          console.error("Failed to load article:", error);
          setArticleContent(null);
        }
      };

      void loadArticle();
    } else {
      setArticleContent(null);
    }
  }, [article]);

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.authors || []).some((author) =>
        author.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      (art.tags || []).some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = !selectedTag || (art.tags || []).some((t) => t === selectedTag);

    return matchesSearch && matchesTag;
  });

  const formatTag = (tag: string) => {
    if (!tag) return tag;
    return tag.charAt(0).toUpperCase() + tag.slice(1);
  };

  const allTags = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((art) => {
      (art.tags || []).forEach((t) => {
        if (t) set.add(t);
      });
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [articles]);

  const currentArticleMeta = article
    ? articles.find((a) => a.slug.toLowerCase() === article.toLowerCase()) || null
    : null;

  if (article && articleContent) {
    return (
      <>
        <SimpleHero
          backgroundImage={sharedHeroImage}
          title="Knowledgebase"
          subtitle="Documentation and guides, based on research and testing on the Susquehanna Valley mesh network"
          backgroundPosition="center 60%"
          attributionUrl="https://commons.wikimedia.org/wiki/File:Ridges_and_valleys_near_the_West_Branch_Susquehanna_River.jpg"
          height="25vh"
        />
        <PageSection>
          <Box sx={{ mb: 3 }}>
            <StyledText
              type="body"
              sx={{
                color: "primary.main",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => navigate("/knowledgebase")}
            >
              ← Back to Knowledgebase
            </StyledText>
          </Box>
          <Stack spacing={1.5} sx={{ mb: 3 }}>
            <StyledText
              type="heading"
              component="h1"
              sx={{ fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" }, mb: 1 }}
            >
              {currentArticleMeta?.title || article}
            </StyledText>
            {currentArticleMeta?.authors && currentArticleMeta.authors.length > 0 && (
              <StyledText type="body" sx={{ color: "text.secondary" }}>
                By {currentArticleMeta.authors.join(", ")}
              </StyledText>
            )}
            {currentArticleMeta?.tags && currentArticleMeta.tags.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {currentArticleMeta.tags.map((tag) => (
                  <Box
                    key={tag}
                    sx={{
                      px: 1.25,
                      py: 0.5,
                      borderRadius: 999,
                      bgcolor: "background.default",
                      border: "1px solid",
                      borderColor: "divider",
                      fontSize: "0.75rem",
                      color: "text.secondary",
                    }}
                  >
                    {formatTag(tag)}
                  </Box>
                ))}
              </Stack>
            )}
          </Stack>
          <MarkdownContent content={articleContent} />
        </PageSection>
      </>
    );
  }

  return (
    <>
      <SimpleHero
        backgroundImage={sharedHeroImage}
        title="Knowledgebase"
        subtitle="Documentation and guides, based on research and testing on the Susquehanna Valley mesh network"
        backgroundPosition="center 60%"
        height="25vh"
      />
      <PageSection>
        <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
          <StyledText type="body-large" sx={{ mb: 3, textAlign: "center" }}>
            Browse our collection of articles, guides, and documentation, written by members of the
            community, based on research and testing on the Susquehanna Valley mesh network.
          </StyledText>

          <TextField
            fullWidth
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 4 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {allTags.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
              <Chip
                label="All tags"
                size="small"
                color={selectedTag === null ? "primary" : "default"}
                variant={selectedTag === null ? "filled" : "outlined"}
                onClick={() => setSelectedTag(null)}
              />
              {allTags.map((tag) => (
                <Chip
                  key={tag}
                  label={formatTag(tag)}
                  size="small"
                  color={selectedTag === tag ? "primary" : "default"}
                  variant={selectedTag === tag ? "filled" : "outlined"}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                />
              ))}
            </Stack>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : filteredArticles.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <StyledText type="body" sx={{ color: "text.secondary" }}>
                {searchQuery
                  ? "No articles match your search."
                  : "No articles available yet. Check back soon!"}
              </StyledText>
            </Box>
          ) : (
            <Stack spacing={2}>
              {filteredArticles.map((art) => (
                <Card
                  key={art.slug}
                  elevation={2}
                  sx={{
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateX(4px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardActionArea onClick={() => navigate(`/knowledgebase/${art.slug}`)}>
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <ArticleIcon sx={{ color: "primary.main", mt: 0.5 }} />
                        <Box sx={{ flex: 1 }}>
                          <StyledText
                            type="heading"
                            component="h3"
                            sx={{ mb: 1, fontSize: "1.1rem" }}
                          >
                            {art.title}
                          </StyledText>
                          {art.tags && art.tags.length > 0 && (
                            <Stack
                              direction="row"
                              spacing={0.75}
                              flexWrap="wrap"
                              useFlexGap
                              sx={{ mb: 0.5 }}
                            >
                              {art.tags.map((tag) => (
                                <Box
                                  key={tag}
                                  sx={{
                                    px: 1,
                                    py: 0.35,
                                    borderRadius: 999,
                                    bgcolor: "background.default",
                                    border: "1px solid",
                                    borderColor: "divider",
                                    fontSize: "0.7rem",
                                    color: "text.secondary",
                                  }}
                                >
                                  {formatTag(tag)}
                                </Box>
                              ))}
                            </Stack>
                          )}
                          {art.authors && art.authors.length > 0 && (
                            <StyledText type="body" sx={{ color: "text.secondary", mb: 0.5 }}>
                              By {art.authors.join(", ")}
                            </StyledText>
                          )}
                          {art.description && (
                            <StyledText type="body" sx={{ color: "text.secondary" }}>
                              {art.description}
                            </StyledText>
                          )}
                        </Box>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      </PageSection>
    </>
  );
}

function stripFrontmatter(raw: string): string {
  const lines = raw.split("\n");
  if (lines[0]?.trim() !== "---") {
    return raw;
  }

  let i = 1;
  while (i < lines.length && lines[i].trim() !== "---") {
    i += 1;
  }

  if (i >= lines.length) {
    return raw;
  }

  return lines.slice(i + 1).join("\n");
}
