const ConnectPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <button
        onClick={() => console.log("Connect Wallet")}
        className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 
                 text-white font-semibold text-lg rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 
                 hover:shadow-lg transform hover:-translate-y-1 transition duration-300 ease-in-out"
      >
        <svg
          className="w-6 h-6 mr-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-9a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 004.5 21h9a2.25 2.25 0 002.25-2.25V15M19.5 12H9m0 0l3 3m-3-3l3-3"
          />
        </svg>
        Connect Wallet
      </button>
    </div>
  );
};

export default ConnectPage;
