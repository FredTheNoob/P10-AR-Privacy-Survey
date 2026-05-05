export default function DonePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl text-center space-y-4">
        <h1 className="text-3xl font-semibold">Thank you for participating</h1>
        <p className="text-gray-700">
          Your responses have been submitted successfully.
        </p>
        <p className="text-gray-700">
          You can now close this window.
        </p>
      </div>
    </main>
  );
}