module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'style',
        'test',
        'hotfix',
        'assets',
      ],
    ],
  },
  prompt: {
    questions: {
      type: {
        description: "Select the TYPE of change that you're committing",
        enum: {
          feat: {
            description: '✨ A new FEATURE',
            title: 'feat',
          },
          fix: {
            description: '🐛 A bug FIX',
            title: 'fix',
          },
          docs: {
            description: '📝 DOCUMENTATION changes (eg. docs site, README.md)',
            title: 'docs',
          },
          style: {
            description:
              '💎 STYLE changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
            title: 'style',
          },
          refactor: {
            description:
              '📦 A code change to OPTIMISE, REORGANIZE existing code (changes that neither fixes a bug nor adds a feature)',
            title: 'refactor',
          },
          perf: {
            description: '🚀 A code change that improves PERFORMANCE',
            title: 'perf',
          },
          test: {
            description: '🧪 Adding missing OR correcting existing TESTS',
            title: 'test',
          },
          build: {
            description:
              '🛠 Changes that affect the BUILD system or external dependencies (eg. webpack, gulp, parcel, vite, etc)',
            title: 'build',
          },
          ci: {
            description:
              '👷 Changes to CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs, Github/Gitlab workflows)',
            title: 'ci',
          },
          chore: {
            description:
              "♻️  Misc. changes that don't modify src or test files (eg. updating package.json, gitignore, comments cleanup, license updates, etc)",
            title: 'chore',
          },
          revert: {
            description: '⏪️ REVERTS a previous commit',
            title: 'revert',
          },
          hotfix: {
            description: '🚑️ EMERGENCY fix for critical issues in production',
            title: 'hotfix',
          },
          assets: {
            description:
              '🍱 Updates or manages project assets (images, fonts, static files)',
            title: 'assets',
          },
					// add or remove based on need
        },
      },
			// change the description as per need
      scope: {
        description:
          'What is the SCOPE of this change (e.g. component or file name)',
      },
      subject: {
        description:
          'Write a SHORT, IMPERATIVE tense description of the change',
      },
      body: {
        description: 'Provide a LONGER description of the change',
      },
      isBreaking: {
        description: 'Are there any BREAKING changes in this commit?',
      },
      breakingBody: {
        description:
          'A BREAKING CHANGE commit requires a body. Please enter a LONGER description of the commit itself',
      },
      breaking: {
        description: 'Describe the breaking changes',
      },
      isIssueAffected: {
        description: 'Does this change affect any open issues?',
      },
      issuesBody: {
        description:
          'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself',
      },
      issues: {
        description:
          'Add issue references or ticket numbers (e.g. "fix #123", "re #459", "#FF2942".)',
      },
    },
  },
}
