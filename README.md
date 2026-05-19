# Course Site Actions

This repository contains reusable GitHub Actions workflows for UC Berkeley CDSS course websites. These workflows automate accessibility scanning (using [Axe-core](https://github.com/dequelabs/axe-core)) and dynamically generate an accessibility badge indicating the number of violations and issues found.

The badge JSON is pushed to an orphaned `badges` branch so it doesn't pollute your `main` commit history.

## Supported Frameworks

We provide workflows for both **MyST** and **Quarto** course websites.

---

## MyST Websites

For MyST-based course sites, use the `myst-a11y.yml` workflow. This workflow builds the MyST HTML assets, serves them locally, and runs the Axe accessibility scan.

Create or update `.github/workflows/a11y.yml` in your course repository:

```yaml
name: Accessibility Checks

on:
  push:
    branches:
      - main
  pull_request:
  workflow_dispatch:

jobs:
  axe-audit:
    uses: berkeley-cdss/course-site-actions/.github/workflows/myst-a11y.yml@main
    with:
      base_url: /${{ github.event.repository.name }}
    permissions:
      contents: write
```

---

## Quarto Websites

For Quarto-based course sites, there are two workflow options depending on how your site is structured and deployed.

### Option A: Render from Main

Use this if your workflow manually renders the Quarto site from the `main` branch before deploying. This workflow sets up Quarto, installs dependencies, renders the site to HTML locally, and then runs the Axe scan.

Create or update `.github/workflows/main-a11y.yml`:

```yaml
name: Accessibility Checks (main)

on:
  push:
    branches-ignore:
      - gh-pages
  workflow_dispatch:

jobs:
  axe-audit:
    uses: berkeley-cdss/course-site-actions/.github/workflows/quarto-a11y.yml@main
    with:
      site_subdir: ${{ github.event.repository.name }}
    permissions:
      contents: write
      pages: read
```

### Option B: Post-Pages Deployment (`gh-pages` branch)

Use this if your site uses a GitHub Pages build-deployment workflow that pushes artifacts to a `gh-pages` branch (often used in simpler "quarto-lite" setups). This workflow runs *after* the pages deployment completes, checking out the `gh-pages` branch and scanning the built site directly.

Create or update `.github/workflows/gh-pages-a11y.yml`:

```yaml
name: Accessibility Checks (gh-pages)

on:
  workflow_run:
    workflows: ["pages-build-deployment"] # Make sure this matches your Pages deployment workflow name
    types:
      - completed
  workflow_dispatch:

jobs:
  axe-audit:
    uses: berkeley-cdss/course-site-actions/.github/workflows/quarto-a11y-gh-pages.yml@main
    with:
      site_subdir: ${{ github.event.repository.name }}
    permissions:
      contents: write
```

---

## Displaying the Badge

Once the workflow runs successfully for the first time, it will create an `a11y-badge.json` file in the `badges` branch. 

To display the badge on your website or in your `README.md`, use a Shields.io custom endpoint URL pointing to the raw JSON file on the `badges` branch. 

For example, using an HTML `<img>` tag (recommended to bypass build-time bundling):

```html
<img src="https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/berkeley-cdss/YOUR_REPO_NAME/badges/a11y-badge.json" alt="Accessibility Badge">
```

> [!IMPORTANT]
> Remember to replace `YOUR_REPO_NAME` with your actual repository name in the URL above!
