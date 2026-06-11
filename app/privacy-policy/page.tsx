import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | HandyFor.Me',
  description: 'Privacy Policy for HandyFor.Me personal productivity hub.'
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#ffffff] text-black p-6 sm:p-12 flex justify-center items-center">
      <div className="max-w-3xl w-full border-2 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 uppercase tracking-tight border-b-4 border-black pb-4">
          Privacy Policy
        </h1>
        
        <p className="text-sm text-gray-500 mb-8 font-semibold">
          Last Updated: June 11, 2026
        </p>

        <div className="space-y-6 text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold uppercase mb-2 border-b-2 border-black pb-1">
              1. Introduction
            </h2>
            <p>
              Welcome to <strong>HandyFor.Me</strong>. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our web application and mobile wrapped application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase mb-2 border-b-2 border-black pb-1">
              2. Data We Collect
            </h2>
            <p>
              When you authenticate and interact with our application, we collect the following types of information:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Your Name and Email Address (collected via NextAuth through Google or GitHub authentication)</li>
              <li>Your Profile Picture URL</li>
              <li>Device or other IDs (non-identifiable identifiers used strictly for app performance monitoring and analytics)</li>
            </ul>
            <p className="mt-2">
              Additionally, we store user-generated content that you voluntarily create inside the app, including checklist tasks, decision helper items, vision boards, yearly promises, and dashboard preferences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase mb-2 border-b-2 border-black pb-1">
              3. How We Use Your Data
            </h2>
            <p>
              We use the collected information solely for the following purposes:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>To create and manage your personal user account.</li>
              <li>To save and retrieve your custom lists, boards, and productivity inputs.</li>
              <li>To personalize your profile dashboard inside the app.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase mb-2 border-b-2 border-black pb-1">
              4. Data Protection & Sharing
            </h2>
            <p>
              We do not sell, trade, or share your personal information with third parties. All database transactions are secure and encrypted.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold uppercase mb-2 border-b-2 border-black pb-1">
              5. Your Rights & Control
            </h2>
            <p>
              You maintain complete control over your data. You can edit, update, or permanently delete your user-generated information at any time from within the application settings.
            </p>
            <p className="mt-2">
              Additionally, in compliance with Google Play Developer Policies, you may request full account and data deletion at any time by visiting our{' '}
              <Link href="/delete-account" className="underline font-bold text-red-600">
                Delete Account
              </Link>{' '}
              page or by emailing us directly at{' '}
              <a href="mailto:fhkodama@gmail.com" className="underline font-bold text-red-600">
                fhkodama@gmail.com
              </a>. We will process all deletion requests within 48 hours.
            </p>
          </section>

        </div>

        <div className="mt-10 pt-6 border-t-2 border-black flex justify-between items-center">
          <Link href="/login" className="px-4 py-2 border-2 border-black bg-black text-white hover:bg-white hover:text-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
