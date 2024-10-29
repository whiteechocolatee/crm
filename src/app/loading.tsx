'use client';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="space-y-6 text-center">
        <div className="relative inline-block h-16 w-16">
          <div className="absolute left-0 top-0 h-full w-full">
            <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
            <div className="absolute left-0 top-0 h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Загрузка...</h2>
          <p className="text-sm text-gray-500">
            Пожалуйста, подождите, пока мы подготовим ваше содержимое
          </p>
        </div>
        <div className="mx-auto w-full max-w-md">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-1/2 animate-[loading_1s_ease-in-out_infinite] rounded-full bg-blue-600"></div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex space-x-4 text-sm text-gray-500">
        <div className="flex items-center">
          <svg
            className="mr-2 h-4 w-4 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Подключение</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <span>Загрузка</span>
        </div>
        <div className="flex items-center opacity-50">
          <div className="mr-2 h-4 w-4 rounded-full border-2 border-gray-300"></div>
          <span>Финал</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
