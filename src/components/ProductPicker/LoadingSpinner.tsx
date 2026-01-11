const LoadingSpinner = () => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center p-10 border-y border-neutral-300">
      <div className="w-8 h-8 border-4 border-neutral-200 border-t-[#008060] rounded-full animate-spin mb-3"></div>
    </div>
  );
};

export default LoadingSpinner;
