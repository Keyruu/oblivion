import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { SimpleSlug } from "./quartz/util/path"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [Component.CustomComments({
    provider: 'giscus',
    options: {
      // from data-repo
      repo: 'keyruu/oblivion',
      // from data-repo-id
      repoId: 'R_kgDOMYH8cw',
      // from data-category
      category: 'Announcements',
      // from data-category-id
      categoryId: 'DIC_kwDOMYH8c84Cg-En',
      mapping: 'pathname',
    }
  })],
  footer: Component.Footer({
    links: {
      Keyruu: "https://keyruu.de",
      GitHub: "https://github.com/keyruu/",
      LinkedIn: "https://www.linkedin.com/in/lucasrott/",
      Imprint: "https://keyruu.de/imprint"
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.Search(),
    Component.Darkmode(),
    Component.Explorer({
      folderDefaultState: "collapsed",
      useSavedState: false,
    }),
    Component.DesktopOnly(Component.RecentNotes({
      showTags: false,
      title: "Recent Blog Posts",
      linkToMore: "tags/blog" as SimpleSlug,
      filter: (f) => !!f.frontmatter?.tags?.includes("blog"),
    })),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer()),
  ],
  right: [],
}
