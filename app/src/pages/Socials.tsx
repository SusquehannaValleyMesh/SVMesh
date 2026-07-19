import { Card, Box, Stack } from "@mui/material";
import { SimpleHero, PageSection, StyledText } from "../components/ui";
import { discordLogoImage, sharedHeroImage } from "../config/images";
import { SOCIAL_LINKS } from "../config/social";
import SocialCard from "../components/ui/SocialCard";

export default function Socials() {
  return (
    <>
      <SimpleHero
        backgroundImage={sharedHeroImage}
        title="Join the community"
        subtitle="Find us on Discord and Facebook"
        backgroundPosition="center 70%"
        attributionUrl="https://commons.wikimedia.org/wiki/File:Ridges_and_valleys_near_the_West_Branch_Susquehanna_River.jpg"
      />
      <PageSection>
        <Stack spacing={4}>
          <StyledText type="heading" component="h2">
            Join the Community
          </StyledText>
          <StyledText type="body-large">
            The SVMesh community is thriving on two main platforms, each serving different
            communication styles and preferences. Our Discord server is active with real-time
            discussion, and our Facebook is active with images and event notifications. Come join
            the community! We are always happy to help newcomers get started! Join us on your
            platform of choice:
          </StyledText>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            <SocialCard
              title="Discord Server"
              href={SOCIAL_LINKS.discord}
              imgSrc="/images/discord.png"
            />
            <SocialCard
              title="Facebook Group"
              href={SOCIAL_LINKS.facebook}
              imgSrc="/images/facebook.png"
            />
          </Box>

          <Stack spacing={1.5}>
            <StyledText type="heading" component="h3">
              Community Guidelines
            </StyledText>
            <Box component="ul" sx={{ pl: 3, m: 0 }}>
              <StyledText component="li" type="body-large">
                <b>Be kind and civil</b>: Respect everyone. No harassment, hate, bullying, or
                aggressive behavior. Disagreements are fine—keep them constructive.
              </StyledText>
              <StyledText component="li" type="body-large">
                <b>Stay on-topic, no spam</b>: Avoid ads, excessive self-promo, or off-topic links
                unless an admin okays it.
              </StyledText>
              <StyledText component="li" type="body-large">
                <b>Protect privacy and safety</b>: Don’t share personal details (yours or others’)
                without consent.
              </StyledText>
              <StyledText component="li" type="body-large">
                <b>Respect the law and creators</b>: Share only what you have rights to; follow
                copyright and intellectual property rules. Public discussion of illegal activity,
                including placing nodes where you lack permission, hurts our ability to maintain
                goodwill with the groups graciously hosting our nodes.
              </StyledText>
              <StyledText component="li" type="body-large">
                <b>Ask or report</b>: If something seems off, report it or message the admins. Sales
                or fundraising need prior admin approval.
              </StyledText>
            </Box>
          </Stack>
        </Stack>
      </PageSection>
    </>
  );
}
