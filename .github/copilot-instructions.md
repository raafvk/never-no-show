<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Tenant Credibility and No-Show Rating App

This is a Next.js TypeScript application for landlords to assess tenant credibility and no-show risk.

## Project Structure
- **Frontend**: React with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes for form submission and email notifications
- **Database**: In-memory simulation for PoC (can be replaced with Firebase or other DB)

## Key Features
- Unique landlord links (`/check?landlord=abc123`)
- Tenant form with required and optional fields
- Credibility scoring based on form inputs
- Email notifications to landlords
- Clean, modular TypeScript code with proper interfaces

## Development Guidelines
- Use TypeScript interfaces for all data structures
- Implement proper form validation and error handling
- Keep components modular and reusable
- Use Tailwind CSS for minimal, clean styling
- Follow Next.js best practices for API routes and server-side logic
