import React from 'react';
import { ArrowRight, Upload, Palette, Download, CheckCircle, Star, Users, Zap, Shield } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Resume Builder</span>
          </div>
          <button
            onClick={onSignIn}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Resume Creation
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your LinkedIn Profile<br />
            Into a <span className="text-blue-600">Professional Resume</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Upload your LinkedIn PDF export and watch our AI instantly create a beautiful, 
            customizable resume. Choose from professional templates and export in seconds.
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={onGetStarted}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button className="text-gray-600 hover:text-gray-800 px-8 py-4 rounded-xl text-lg font-medium transition-colors">
              Watch Demo
            </button>
          </div>
          
          <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              No Credit Card Required
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              30-Second Setup
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Professional Templates
            </div>
          </div>
        </div>

        {/* Hero Image/Demo */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div className="ml-4 text-sm text-gray-600">Resume Builder - AI Powered</div>
              </div>
            </div>
            <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-80 flex items-center justify-center">
              <div className="text-center">
                <Upload className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Upload Your LinkedIn PDF</h3>
                <p className="text-gray-600">AI will extract and format your information automatically</p>
              </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute -top-4 -left-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            ✨ AI Powered
          </div>
          <div className="absolute -top-4 -right-4 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
            🚀 30 Seconds
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Create your professional resume in 3 simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Upload LinkedIn PDF</h3>
              <p className="text-gray-600">Export your LinkedIn profile as PDF and upload it. Our AI will intelligently extract all your information.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Palette className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Choose Template</h3>
              <p className="text-gray-600">Select from our collection of professional, modern, and creative resume templates designed by experts.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Download className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Customize & Export</h3>
              <p className="text-gray-600">Personalize colors, fonts, and sections. Export as PDF or Word document ready for job applications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Resume Builder?</h2>
            <p className="text-xl text-gray-600">Professional results with cutting-edge technology</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Zap className="w-8 h-8 text-yellow-500 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
              <p className="text-gray-600 text-sm">Advanced AI extracts and formats your information with 95% accuracy.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Palette className="w-8 h-8 text-purple-500 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Professional Templates</h3>
              <p className="text-gray-600 text-sm">Choose from expertly designed templates for every industry.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Shield className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600 text-sm">Your data is encrypted and stored securely. GDPR compliant.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Download className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Multiple Formats</h3>
              <p className="text-gray-600 text-sm">Export as PDF, Word, or share online with a custom link.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Professionals</h2>
            <p className="text-xl text-gray-600">Join thousands who've landed their dream jobs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Resumes Created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">30s</div>
              <div className="text-gray-600">Average Creation Time</div>
            </div>
          </div>
          
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
            <div className="flex items-center justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-lg text-gray-700 text-center italic mb-4">
              "This tool saved me hours of formatting. The AI perfectly extracted my LinkedIn data and created a beautiful resume in under a minute!"
            </blockquote>
            <div className="text-center">
              <div className="font-semibold text-gray-900">Sarah Johnson</div>
              <div className="text-gray-600">Software Engineer at Google</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Create Your Professional Resume?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who've already transformed their careers
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 flex items-center mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Start Building Your Resume
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          <p className="text-blue-200 text-sm mt-4">No credit card required • Free to start</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">R</span>
                </div>
                <span className="text-lg font-bold">Resume Builder</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered resume creation tool that helps professionals build stunning resumes in minutes.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Examples</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Resume Builder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};