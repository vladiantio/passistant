# Contributing to Passistant

Thank you for your interest in contributing to Passistant! We welcome contributions from the community to help improve this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Fork and Clone](#fork-and-clone)
  - [Install Dependencies](#install-dependencies)
- [Development Workflow](#development-workflow)
  - [Branch Naming](#branch-naming)
  - [Making Changes](#making-changes)
  - [Testing](#testing)
  - [Linting](#linting)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
  - [TypeScript](#typescript)
  - [React Components](#react-components)
  - [Styling](#styling)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)
- [License](#license)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before making any contributions.

## Getting Started

### Prerequisites

- Node.js (version 18 or later)
- npm (version 9 or later) (recommended using pnpm)
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your forked repository:
   ```bash
   git clone https://github.com/your-username/passistant.git
   cd passistant
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/vladiantio/passistant.git
   ```

### Install Dependencies

```bash
pnpm install
```

## Development Workflow

### Branch Naming

Create a new branch for your feature or bugfix:

- For features: `feature/descriptive-name`
- For refactoring: `refactor/descriptive-name`
- For bug fixes: `fix/issue-number-description`
- For style changes: `style/descriptive-name`
- For documentation: `docs/description`

### Making Changes

1. Ensure you have the latest changes from the main branch:
   ```bash
   git fetch upstream
   git checkout main
   git pull upstream main
   ```
2. Create and switch to your feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes following the [Code Style](#code-style) guidelines
4. Test your changes
5. Commit your changes with a descriptive message:
   ```bash
   git commit -m "feat: add new feature"
   ```

### Testing

Run the test suite before submitting your changes:

```bash
npm test
```

### Linting

Ensure your code follows our style guidelines:

```bash
npm run lint
```

## Pull Request Process

1. Ensure all tests pass and there are no linting errors
2. Update the README.md with details of changes if needed
3. Push your changes to your fork:
   ```bash
   git push origin your-branch-name
   ```
4. Open a Pull Request against the `main` branch
5. Ensure all CI checks pass
6. Address any code review feedback

## Code Style

### TypeScript

- Use TypeScript for all new code
- Always provide types for function parameters and return values
- Use interfaces for object types
- Prefer `type` over `interface` for simple types
- Use `readonly` for immutable properties

### React Components

- Use functional components with TypeScript
- Prefer named exports over default exports
- Use React hooks for state management
- Keep components small and focused on a single responsibility
- Use PascalCase for component names
- Use `useCallback` and `useMemo` for performance optimizations when necessary

### Styling

- Use TailwindCSS for styling
- Follow the existing design system and component library
- Use the theme variables for colors and spacing
- Keep styles scoped to components
- Use CSS modules for complex styles

## Reporting Issues

When reporting issues, please include:

1. A clear title and description
2. Steps to reproduce the issue
3. Expected vs actual behavior
4. Screenshots if applicable
5. Browser/OS version if relevant

## Feature Requests

We welcome feature requests! Please open an issue with:

1. A clear description of the feature
2. The problem it solves
3. Any alternative solutions considered
4. Additional context or screenshots

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
