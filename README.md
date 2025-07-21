# NeverNoShow - Tenant Credibility and No-Show Rating App

A Next.js TypeScript application that helps landlords assess tenant credibility and no-show risk before scheduling property viewings.

## 🚀 Features

- **Unique Landlord Links**: Generate custom links for each landlord (`/check?landlord=abc123`)
- **Tenant Form**: Clean, validated form with required and optional fields
- **Credibility Scoring**: Advanced algorithm that calculates tenant reliability scores
- **No-Show Risk Assessment**: Detailed risk analysis with factors and recommendations
- **Email Notifications**: Automatic notifications to landlords with comprehensive reports
- **TypeScript**: Full TypeScript implementation with proper interfaces
- **Responsive Design**: Modern, clean UI with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: In-memory simulation (ready for Firebase/DB integration)
- **API**: Next.js API routes
- **Validation**: Custom form validation with error handling

## 📋 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── landlords/[landlordId]/route.ts  # Landlord validation API
│   │   └── submissions/route.ts             # Form submission API
│   ├── check/page.tsx                       # Tenant form page
│   ├── confirmation/page.tsx                # Success page
│   ├── layout.tsx                           # App layout
│   └── page.tsx                             # Home page
├── lib/
│   └── database.ts                          # In-memory database simulation
├── types/
│   └── index.ts                            # TypeScript interfaces
└── utils/
    └── scoring.ts                          # Scoring algorithms and validation
```

## 🔧 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How It Works

1. **Landlord Shares Link**: Landlord sends unique link (`/check?landlord=abc123`) to potential tenant
2. **Tenant Fills Form**: Tenant provides contact details, history, and optional comments
3. **AI Analysis**: System calculates credibility score and no-show risk percentage
4. **Landlord Notified**: Detailed assessment report is generated and landlord is notified

## 🧪 Demo

Try the demo with these sample landlord links:

- John Doe: `/check?landlord=abc123`
- Jane Smith: `/check?landlord=def456`
- Demo Landlord: `/check?landlord=ghi789`

## 📊 Scoring Algorithm

The credibility score is calculated based on:

- **Contact Info Quality** (85% base): Email domain, phone number format
- **History Assessment** (80% base): Previous no-show reports, tenant history
- **Communication Score** (75% base): Quality of additional comments provided

Risk factors include:
- Previous no-show history (+35% risk)
- Low credibility scores (+20-40% risk)
- Limited information provided (+10% risk)

## 🔐 API Endpoints

### GET `/api/landlords/[landlordId]`
Validates if a landlord ID exists in the system.

**Response:**
```json
{
  "exists": true,
  "name": "John Doe"
}
```

### POST `/api/submissions`
Processes tenant form submissions and generates credibility reports.

**Request Body:**
```json
{
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "phoneNumber": "+1234567890",
  "previousNoShow": false,
  "additionalComments": "Looking forward to viewing the property",
  "landlordId": "abc123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Submission successful",
  "credibilityScore": {
    "overall": 82,
    "breakdown": {
      "contactInfo": 90,
      "history": 80,
      "communication": 75
    },
    "riskLevel": "low"
  },
  "noShowRisk": {
    "percentage": 15,
    "factors": ["Limited additional information provided"],
    "recommendation": "Low risk tenant - proceed with confidence"
  }
}
```

## 🚀 Deployment

Deploy to Vercel (recommended):

```bash
npm run build
vercel deploy
```

## 🔮 Future Enhancements

- **Email Integration**: Real email notifications using SendGrid/Nodemailer
- **Database Integration**: Replace in-memory DB with Firebase/PostgreSQL
- **Machine Learning**: Advanced ML models for better risk assessment
- **Dashboard**: Landlord dashboard to view all submissions
- **Authentication**: User authentication and authorization
- **Analytics**: Detailed reporting and analytics
- **Mobile App**: React Native mobile application

## 📝 License

This project is a Proof of Concept (PoC) for educational purposes.

---

**Built with ❤️ using Next.js and TypeScript**
