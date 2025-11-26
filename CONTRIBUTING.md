# Contributing to TournaPro

Thank you for your interest in contributing to TournaPro! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/tournapro.git
   cd tournapro
   ```
3. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

### Backend Development
1. Ensure you have Java 17 and Maven installed
2. Set up PostgreSQL database
3. Navigate to backend directory: `cd backend`
4. Run: `mvn spring-boot:run`

### Frontend Development
1. Ensure you have Node.js 18+ installed
2. Navigate to frontend directory: `cd frontend`
3. Install dependencies: `npm install`
4. Run: `npm run dev`

## Code Style

### Backend (Java)
- Follow Java naming conventions
- Use meaningful variable and method names
- Add JavaDoc comments for public methods
- Keep methods focused and concise
- Use Lombok annotations where appropriate

### Frontend (React)
- Use functional components with hooks
- Follow React best practices
- Keep components small and reusable
- Use meaningful component and variable names
- Add PropTypes or TypeScript for type checking (if using TypeScript)

## Making Changes

1. Make your changes in your feature branch
2. Test your changes thoroughly
3. Ensure the code builds without errors:
   - Backend: `mvn clean compile`
   - Frontend: `npm run build`
4. Commit your changes with clear, descriptive messages:
   ```bash
   git commit -m "Add feature: description of your changes"
   ```

## Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Submitting Changes

1. Push your changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Create a Pull Request from your fork to the main repository
3. Provide a clear description of your changes
4. Reference any related issues

## Pull Request Guidelines

- Provide a clear title and description
- Reference related issues using #issue-number
- Ensure all tests pass
- Update documentation if needed
- Add screenshots for UI changes

## Reporting Issues

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, etc.)

## Feature Requests

We welcome feature requests! Please:
- Check if the feature already exists
- Provide a clear use case
- Explain why it would be valuable
- Consider implementation details

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on the code, not the person

## Questions?

If you have questions, feel free to:
- Open an issue for discussion
- Contact the maintainers

Thank you for contributing to TournaPro!
