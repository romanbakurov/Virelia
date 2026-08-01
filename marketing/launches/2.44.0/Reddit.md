# I built a cross-platform design system for React and React Native — I'd love your feedback

Hi everyone!

Over the past several months I've been working on a personal open-source project called **Vellira**.

The original goal wasn't to build "another UI library."

It came from repeatedly running into the same problem while building products for both React and React Native.

Even when the visual design stayed the same, I kept duplicating:

- components
- design tokens
- interaction logic
- accessibility behavior
- documentation

Eventually I found myself maintaining two separate component libraries instead of one shared system.

That led me to start building Vellira.

Instead of sharing everything, Vellira shares only what makes sense to share:

- Design Tokens
- TypeScript contracts
- Interaction logic
- Component APIs

while keeping rendering platform-specific.

The first public release currently includes:

- Button
- Checkbox
- Dropdown
- FormField
- Input
- Modal
- Portal
- Radio
- RadioGroup
- Select
- Tabs
- Tooltip

Some technical highlights:

- React + React Native
- TypeScript-first
- Accessibility-minded component APIs
- Shared design tokens
- CSS Variables
- Storybook
- Automated tests
- Semantic Release
- OpenSSF Scorecard

The project is completely open source (MIT).

I'd genuinely appreciate feedback—especially from developers who have built or maintained design systems before.

Website:
https://vellira.dev

Documentation:
https://docs.vellira.dev

Storybook:
https://storybook.vellira.dev

GitHub:
https://github.com/vellira-dev/vellira

A few questions I'd especially love feedback on:

- Does the architecture make sense?
- Is there anything missing before you'd consider trying it?
- Which components would you prioritize next?
- Would you use something like this in a real project?

Thanks for taking a look!
