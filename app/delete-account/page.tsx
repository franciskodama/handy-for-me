import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Delete Account | HandyFor.Me',
  description: 'Request deletion of your HandyFor.Me account and personal data.'
};

export default function DeleteAccount() {
  return (
    <div className="min-h-screen bg-[#ffffff] text-black p-6 sm:p-12 flex justify-center items-center">
      <div className="max-w-md w-full border-2 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-3xl font-extrabold mb-6 uppercase tracking-tight border-b-4 border-black pb-4 text-red-600">
          Delete Account & Data
        </h1>

        <p className="text-base leading-relaxed mb-6">
          In compliance with Google Play Developer Policies, we provide an easy way for you to request the deletion of your account and all associated personal data.
        </p>

        <div className="border-2 border-black p-4 bg-yellow-50 mb-6">
          <p className="text-sm font-bold uppercase mb-2 text-yellow-800">
            What will be deleted:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 text-yellow-900">
            <li>Your account profile (Name, Email, Profile Picture).</li>
            <li>Your entire checklist and TODO items.</li>
            <li>Your bucket list, yearly promises, and decisions.</li>
          </ul>
        </div>

        <p className="text-base leading-relaxed mb-6">
          To request deletion, please email us from your registered address:
        </p>

        <a
          href="mailto:fhkodama@gmail.com?subject=HandyFor.Me Data Deletion Request"
          className="block w-full text-center py-3 border-2 border-black bg-red-600 text-white font-extrabold uppercase hover:bg-white hover:text-red-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all mb-8"
        >
          Request Deletion via Email
        </a>

        <p className="text-xs text-gray-500 mb-6 text-center">
          Or send an email to <strong className="text-black">fhkodama@gmail.com</strong> with the subject "HandyFor.Me Data Deletion Request". We will delete your data within 48 hours.
        </p>

        <div className="border-t-2 border-black pt-4 flex justify-center">
          <Link href="/login" className="text-sm underline font-bold hover:bg-black hover:text-white px-2 py-1">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
