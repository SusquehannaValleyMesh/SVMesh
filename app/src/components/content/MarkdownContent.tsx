import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { StyledText, StyledLink, WarningBanner } from "../ui";
import { Box } from "@mui/material";
import TopologyDiagram from "./TopologyDiagram";

interface MarkdownContentProps {
  content: string;
}

interface ContentPart {
  type: "markdown" | "warning" | "diagram";
  content: string;
  warningType?: "warning" | "critical" | "info";
  title?: string;
}

// Configure sanitization to allow img tags
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), "details", "summary"],
  attributes: {
    ...defaultSchema.attributes,
    img: [["src"], ["alt"], ["width"], ["height"], ["title"]],
  },
};

// Process custom syntax (warnings and diagrams) into separate parts
function processCustomBlocks(content: string): ContentPart[] {
  const parts: ContentPart[] = [];
  const blockMatches: Array<{ index: number; length: number; part: ContentPart }> = [];

  // Find all warning blocks
  const warningRegex = /::(warning|critical|info)(?:\[(.*?)\])?\n([\s\S]*?)::\1/g;
  let match;

  while ((match = warningRegex.exec(content)) !== null) {
    blockMatches.push({
      index: match.index,
      length: match[0].length,
      part: {
        type: "warning",
        content: match[3].trim(),
        warningType: match[1] as "warning" | "critical" | "info",
        title: match[2] || undefined,
      },
    });
  }

  // Find all network diagram blocks (code blocks containing node diagrams)
  const diagramRegex =
    /```(?:network-diagram)?\n([\s\S]*?(?:Ingress|Base|Backbone)[\s\S]*?Node[\s\S]*?)```/g;
  while ((match = diagramRegex.exec(content)) !== null) {
    // Check if this looks like a network diagram
    const diagramContent = match[1];
    if (
      diagramContent.includes("Node") &&
      (diagramContent.includes("Ingress") ||
        diagramContent.includes("Base") ||
        diagramContent.includes("Backbone"))
    ) {
      blockMatches.push({
        index: match.index,
        length: match[0].length,
        part: {
          type: "diagram",
          content: diagramContent.trim(),
        },
      });
    }
  }

  // Sort matches by index
  blockMatches.sort((a, b) => a.index - b.index);

  // Build parts array
  let lastIndex = 0;
  for (const block of blockMatches) {
    // Add markdown content before this block
    if (block.index > lastIndex) {
      const markdownContent = content.slice(lastIndex, block.index).trim();
      if (markdownContent) {
        parts.push({ type: "markdown", content: markdownContent });
      }
    }

    // Add the block
    parts.push(block.part);
    lastIndex = block.index + block.length;
  }

  // Add any remaining markdown content
  if (lastIndex < content.length) {
    const remaining = content.slice(lastIndex).trim();
    if (remaining) {
      parts.push({ type: "markdown", content: remaining });
    }
  }

  return parts;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const contentParts = processCustomBlocks(content);

  // Define shared markdown components
  const markdownComponents = {
    h1: ({ children }: any) => (
      <StyledText type="heading" component="h1" sx={{ mt: 0, mb: 3 }}>
        {children}
      </StyledText>
    ),
    h2: ({ children }: any) => (
      <StyledText
        type="heading"
        component="h2"
        sx={{ mt: 0, mb: 2.5, fontSize: { xs: "1.35rem", sm: "1.5rem", md: "1.65rem" } }}
      >
        {children}
      </StyledText>
    ),
    h3: ({ children }: any) => (
      <StyledText
        type="subheading"
        component="h3"
        sx={{ mt: 3, mb: 2, fontSize: { xs: "1.1rem", sm: "1.15rem", md: "1.25rem" } }}
      >
        {children}
      </StyledText>
    ),
    p: ({ children }: any) => (
      <StyledText type="body-large" sx={{ mb: 2.5 }}>
        {children}
      </StyledText>
    ),
    a: ({ href, children }: any) => (
      <StyledLink href={href || "#"} target={href?.startsWith("http") ? "_blank" : undefined}>
        {children}
      </StyledLink>
    ),
    img: ({ src, alt }: any) => (
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
          maxWidth: "100%",
          height: "auto",
          borderRadius: 1,
          mb: 2.5,
          display: "block",
        }}
      />
    ),
    ul: ({ children }: any) => (
      <Box component="ul" sx={{ pl: 3, mb: 2.5 }}>
        {children}
      </Box>
    ),
    ol: ({ children }: any) => (
      <Box component="ol" sx={{ pl: 3, mb: 2.5 }}>
        {children}
      </Box>
    ),
    li: ({ children }: any) => (
      <StyledText type="body-large" component="li" sx={{ mb: 0.5 }}>
        {children}
      </StyledText>
    ),
    strong: ({ children }: any) => (
      <Box component="strong" sx={{ fontWeight: 600 }}>
        {children}
      </Box>
    ),
    em: ({ children }: any) => (
      <Box component="em" sx={{ fontStyle: "italic", fontWeight: 500 }}>
        {children}
      </Box>
    ),
    blockquote: ({ children }: any) => (
      <Box
        sx={{
          borderLeft: 4,
          borderColor: "primary.main",
          pl: 3,
          py: 1,
          mb: 2.5,
          bgcolor: "background.paper",
          borderRadius: 1,
        }}
      >
        {children}
      </Box>
    ),
    code: ({ children, className }: any) => {
      // Only apply special styling to inline code (not code blocks)
      const isCodeBlock = className?.includes("language-");
      if (isCodeBlock) {
        return <Box component="code">{children}</Box>;
      }
      return (
        <Box
          component="code"
          sx={{
            fontFamily: "monospace",
            bgcolor: "background.paper",
            px: 1,
            py: 0.5,
            borderRadius: 0.5,
            fontSize: "0.9em",
          }}
        >
          {children}
        </Box>
      );
    },
    pre: ({ children }: any) => (
      <Box
        component="pre"
        sx={{
          fontFamily: "monospace",
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          px: 2,
          py: 2,
          borderRadius: 1,
          fontSize: "0.9em",
          overflowX: "auto",
          mb: 2.5,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {children}
      </Box>
    ),
    table: ({ children }: any) => (
      <Box sx={{ overflowX: "auto", mb: 2.5 }}>
        <Box
          component="table"
          sx={{
            width: "100%",
            borderCollapse: "collapse",
            bgcolor: "background.paper",
            "& th": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontWeight: 600,
              p: 1.5,
              textAlign: "left",
              borderBottom: 2,
              borderColor: "divider",
            },
            "& td": {
              p: 1.5,
              borderBottom: 1,
              borderColor: "divider",
            },
            "& tr:last-child td": {
              borderBottom: 0,
            },
            "& tr:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          {children}
        </Box>
      </Box>
    ),
    thead: ({ children }: any) => <Box component="thead">{children}</Box>,
    tbody: ({ children }: any) => <Box component="tbody">{children}</Box>,
    tr: ({ children }: any) => <Box component="tr">{children}</Box>,
    th: ({ children }: any) => (
      <Box component="th">
        <StyledText type="body-large" component="span" sx={{ fontWeight: 600, color: "inherit" }}>
          {children}
        </StyledText>
      </Box>
    ),
    td: ({ children }: any) => (
      <Box component="td">
        <StyledText type="body" component="span">
          {children}
        </StyledText>
      </Box>
    ),
    details: ({ children }: any) => (
      <Box
        component="details"
        sx={{
          mb: 2.5,
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          p: 2,
          bgcolor: "background.paper",
          "& summary": {
            cursor: "pointer",
            fontWeight: 600,
            userSelect: "none",
            "&:hover": {
              color: "primary.main",
            },
          },
          "& summary::-webkit-details-marker": {
            color: "primary.main",
          },
        }}
      >
        {children}
      </Box>
    ),
    summary: ({ children }: any) => (
      <Box component="summary">
        <StyledText type="body-large" component="span" sx={{ fontWeight: 600 }}>
          {children}
        </StyledText>
      </Box>
    ),
  };

  return (
    <Box>
      {contentParts.map((part, index) => {
        if (part.type === "warning") {
          return (
            <WarningBanner key={index} type={part.warningType!} title={part.title}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
                components={{
                  h1: ({ children }: any) => (
                    <StyledText
                      type="heading"
                      component="h1"
                      sx={{ mt: 0, mb: 2, color: "inherit" }}
                    >
                      {children}
                    </StyledText>
                  ),
                  h2: ({ children }: any) => (
                    <StyledText
                      type="heading"
                      component="h2"
                      sx={{
                        mt: 0,
                        mb: 1.5,
                        fontSize: { xs: "1.35rem", sm: "1.5rem", md: "1.65rem" },
                        color: "inherit",
                      }}
                    >
                      {children}
                    </StyledText>
                  ),
                  h3: ({ children }: any) => (
                    <StyledText
                      type="subheading"
                      component="h3"
                      sx={{
                        mt: 2,
                        mb: 1,
                        fontSize: { xs: "1.1rem", sm: "1.15rem", md: "1.25rem" },
                        color: "inherit",
                      }}
                    >
                      {children}
                    </StyledText>
                  ),
                  p: ({ children }: any) => (
                    <StyledText type="body" sx={{ mb: 0, color: "inherit" }}>
                      {children}
                    </StyledText>
                  ),
                  a: ({ href, children }: any) => (
                    <StyledLink
                      href={href || "#"}
                      target={href?.startsWith("http") ? "_blank" : undefined}
                      sx={{ color: "inherit" }}
                    >
                      {children}
                    </StyledLink>
                  ),
                  img: ({ src, alt }: any) => (
                    <Box
                      component="img"
                      src={src}
                      alt={alt}
                      sx={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: 1,
                        mb: 1,
                        display: "block",
                      }}
                    />
                  ),
                  ul: ({ children }: any) => (
                    <Box component="ul" sx={{ pl: 3, mb: 0, mt: 1 }}>
                      {children}
                    </Box>
                  ),
                  ol: ({ children }: any) => (
                    <Box component="ol" sx={{ pl: 3, mb: 0, mt: 1 }}>
                      {children}
                    </Box>
                  ),
                  li: ({ children }: any) => (
                    <StyledText type="body" component="li" sx={{ mb: 0.5, color: "inherit" }}>
                      {children}
                    </StyledText>
                  ),
                  strong: ({ children }: any) => (
                    <Box component="strong" sx={{ color: "inherit", fontWeight: 600 }}>
                      {children}
                    </Box>
                  ),
                  em: ({ children }: any) => (
                    <Box
                      component="em"
                      sx={{ color: "inherit", fontStyle: "italic", fontWeight: 500 }}
                    >
                      {children}
                    </Box>
                  ),
                  code: ({ children }: any) => (
                    <Box
                      component="code"
                      sx={{
                        fontFamily: "monospace",
                        bgcolor: "action.hover",
                        px: 1,
                        py: 0.5,
                        borderRadius: 0.5,
                        fontSize: "0.9em",
                        color: "inherit",
                      }}
                    >
                      {children}
                    </Box>
                  ),
                  details: ({ children }: any) => (
                    <Box
                      component="details"
                      sx={{
                        mb: 1,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                        p: 1,
                        bgcolor: "background.paper",
                        "& summary": {
                          cursor: "pointer",
                          fontWeight: 600,
                          userSelect: "none",
                        },
                        "& summary::-webkit-details-marker": {
                          color: "inherit",
                        },
                      }}
                    >
                      {children}
                    </Box>
                  ),
                  summary: ({ children }: any) => (
                    <Box component="summary">
                      <StyledText
                        type="body"
                        component="span"
                        sx={{ fontWeight: 600, color: "inherit" }}
                      >
                        {children}
                      </StyledText>
                    </Box>
                  ),
                }}
              >
                {part.content}
              </ReactMarkdown>
            </WarningBanner>
          );
        }

        if (part.type === "diagram") {
          return <TopologyDiagram key={index} />;
        }

        return (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
            key={index}
            components={markdownComponents}
          >
            {part.content}
          </ReactMarkdown>
        );
      })}
    </Box>
  );
}
