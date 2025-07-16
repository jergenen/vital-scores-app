# Project Structure

## Current State
This workspace is currently empty. The following structure guidelines should be followed as the project develops:

## Recommended Organization
```
/
├── src/           # Source code
├── tests/         # Test files
├── docs/          # Documentation
├── config/        # Configuration files
├── scripts/       # Build and utility scripts
├── .kiro/         # Kiro AI assistant configuration
└── README.md      # Project overview and setup instructions
```

## File Naming Conventions
- Use lowercase with hyphens for directories: `my-component/`
- Follow language-specific conventions for file names
- Keep names descriptive but concise
- Group related files in appropriate directories

## Code Organization
- Separate concerns into logical modules
- Keep files focused on single responsibilities
- Use consistent import/export patterns
- Maintain clear dependency hierarchies

## Configuration Files
- Keep configuration at project root when possible
- Use environment-specific config files when needed
- Document all configuration options