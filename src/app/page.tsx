export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            NeverNoShow
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A tenant credibility and no-show rating platform for landlords. 
            Assess tenant reliability before scheduling viewings.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Credibility Scoring
            </h3>
            <p className="text-gray-600">
              Advanced algorithms assess tenant reliability based on contact information, 
              history, and communication quality.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No-Show Risk Assessment
            </h3>
            <p className="text-gray-600">
              Get detailed risk analysis with factors and recommendations 
              to make informed decisions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Instant Notifications
            </h3>
            <p className="text-gray-600">
              Landlords receive immediate email notifications with comprehensive 
              tenant assessment reports.
            </p>
          </div>
        </div>

        {/* Demo Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Try the Demo
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Test the tenant check process with these sample landlord links:
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="/check?landlord=abc123"
              className="block p-4 border border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-semibold text-blue-900 mb-1">John Doe</h3>
              <p className="text-sm text-blue-600 mb-2">john.doe@example.com</p>
              <p className="text-xs text-gray-500">Landlord ID: abc123</p>
            </a>
            
            <a
              href="/check?landlord=def456"
              className="block p-4 border border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
            >
              <h3 className="font-semibold text-green-900 mb-1">Jane Smith</h3>
              <p className="text-sm text-green-600 mb-2">jane.smith@example.com</p>
              <p className="text-xs text-gray-500">Landlord ID: def456</p>
            </a>
            
            <a
              href="/check?landlord=ghi789"
              className="block p-4 border border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors"
            >
              <h3 className="font-semibold text-purple-900 mb-1">Demo Landlord</h3>
              <p className="text-sm text-purple-600 mb-2">demo@landlord.com</p>
              <p className="text-xs text-gray-500">Landlord ID: ghi789</p>
            </a>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gray-100 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Landlord Shares Link</h3>
              <p className="text-sm text-gray-600">
                Landlord sends unique link to potential tenant
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Tenant Fills Form</h3>
              <p className="text-sm text-gray-600">
                Tenant provides contact details and history
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-sm text-gray-600">
                System calculates credibility and risk scores
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Landlord Notified</h3>
              <p className="text-sm text-gray-600">
                Detailed report sent to landlord via email
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
