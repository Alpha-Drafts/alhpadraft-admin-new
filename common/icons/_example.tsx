// Example of how to create an icon
<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="black"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d="M5 3h14v2H5V3zM3 21h18v-2H3v2zm2-5h14v-2H5v2z" />
</svg>;

export const MyIcon = ({ className }: { className?: string }) => (
  <svg
    className={className} // className is required
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor" //change any fill that has color to currentColor
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5 3h14v2H5V3zM3 21h18v-2H3v2zm2-5h14v-2H5v2z" />
  </svg>
);

// Example usage
// Don't include this example when creating the icon
export default function IconExample() {
  return (
    <div className="space-x-4">
      <MyIcon className="h-6 w-6 text-gray-500" />
      <MyIcon className="h-6 w-6 text-gray-500 transition hover:text-blue-500" />
    </div>
  );
}
